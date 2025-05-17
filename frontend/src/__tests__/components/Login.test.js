import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../components/Login";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { get_Users } from "../../services/login_service";

jest.mock("../../context/UserAuthContext");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("../../services/login_service");

describe("Login component", () => {
  const mockGoogleSignIn = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useUserAuth.mockReturnValue({ googleSignIn: mockGoogleSignIn });
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test("renders Login title and Google button", () => {
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("successful sign-in with existing researcher navigates to /home", async () => {
    mockGoogleSignIn.mockResolvedValue({
      user: { email: "test@example.com" },
    });

    get_Users.mockResolvedValue([{ email: "test@example.com", role: "researcher" }]);

    render(<Login />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(get_Users).toHaveBeenCalledWith("test@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("successful sign-in with existing reviewer navigates to /reviewer-dashboard", async () => {
    mockGoogleSignIn.mockResolvedValue({
      user: { email: "reviewer@example.com" },
    });

    get_Users.mockResolvedValue([{ email: "reviewer@example.com", role: "reviewer" }]);

    render(<Login />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(get_Users).toHaveBeenCalledWith("reviewer@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/reviewer-dashboard");
    });
  });

  test("successful sign-in with user missing role navigates to /choose-role", async () => {
    mockGoogleSignIn.mockResolvedValue({
      user: { email: "norole@example.com" },
    });

    get_Users.mockResolvedValue([{ email: "norole@example.com" }]); // No role

    render(<Login />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(get_Users).toHaveBeenCalledWith("norole@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/choose-role", {
        state: { email: "norole@example.com" },
      });
    });
  });

  test("successful sign-in with new user navigates to /choose-role", async () => {
    mockGoogleSignIn.mockResolvedValue({
      user: { email: "newuser@example.com" },
    });

    get_Users.mockResolvedValue([]); // No user found

    render(<Login />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(get_Users).toHaveBeenCalledWith("newuser@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/choose-role", {
        state: { email: "newuser@example.com" },
      });
    });
  });

  test("displays error message when sign-in fails", async () => {
    mockGoogleSignIn.mockRejectedValue(new Error("Sign-in failed"));

    render(<Login />);
    fireEvent.click(screen.getByRole("button"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Sign-in failed");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
