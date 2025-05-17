import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../../components/Header";
import { useUserAuth } from "../../context/UserAuthContext";
import { get_Users } from "../../services/login_service";
import { useNavigate } from "react-router-dom";

// Mocks
jest.mock("../../context/UserAuthContext", () => ({
  useUserAuth: jest.fn(),
}));
jest.mock("../../services/login_service", () => ({
  get_Users: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Header Component", () => {
  const mockNavigate = jest.fn();
  const mockLogOut = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useUserAuth.mockReturnValue({
      user: { email: "test@example.com" },
      logOut: mockLogOut,
    });
    get_Users.mockResolvedValue([{ role: "reviewer", user_id: 123 }]);
    mockNavigate.mockClear();
    mockLogOut.mockClear();
  });

  test("renders logo, title, icons, and menu", () => {
    render(<Header />);
    expect(screen.getByAltText("RE:HUB Logo")).toBeInTheDocument();
    expect(screen.getByText("My Research Hub")).toBeInTheDocument();
    expect(screen.getByTitle("Messages")).toBeInTheDocument();
    expect(screen.getByTitle("Notifications")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("menu toggles when menu icon is clicked", () => {
    render(<Header />);
    const menuIcon = screen.getByRole("img", { hidden: true }); // FaBars is SVG
    fireEvent.click(menuIcon);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("calls navigate to /home when Home is clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("img", { hidden: true })); // open menu
    fireEvent.click(screen.getByText("Home"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("calls navigate to /profile when Profile is clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("img", { hidden: true })); // open menu
    fireEvent.click(screen.getByText("Profile"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("calls logOut and navigates to / on Log Out", async () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("img", { hidden: true }));
    fireEvent.click(screen.getByText("Log Out"));
    await waitFor(() => {
      expect(mockLogOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("calls get_Users with user email and triggers callback", async () => {
    const mockCallback = jest.fn();
    render(<Header onUser_IdLoaded={mockCallback} />);
    await waitFor(() => {
      expect(get_Users).toHaveBeenCalledWith("test@example.com");
      expect(mockCallback).toHaveBeenCalledWith(123);
    });
  });

  test("handles error in get_Users gracefully", async () => {
    console.error = jest.fn(); // silence expected error
    get_Users.mockRejectedValueOnce(new Error("Failed"));

    render(<Header />);
    await waitFor(() => {
      expect(get_Users).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Failed to get User_Role", expect.any(Error));
    });
  });
});
