import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../../components/Profile";
import * as profileService from "../../services/profileService";

// MOCK useUserAuth hook from your auth context used in Header
// Adjust this import path to your actual auth context file!
jest.mock("../../context/UserAuthContext", () => ({
  useUserAuth: jest.fn(),
}));

// MOCK react-router-dom's useNavigate (if used in Header)
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Import mocked hook so you can set return values
import { useUserAuth } from "../../context/UserAuthContext";

beforeAll(() => {
  const user = { email: "test@example.com" };
  Storage.prototype.getItem = jest.fn(() => JSON.stringify(user));
});

jest.mock("../../services/profileService", () => ({
  get_profile_data: jest.fn(),
  update_profile_data: jest.fn(),
}));

describe("Profile Component", () => {
  const mockProfile = {
    name: "Test User",
    institution: "Test University",
    qualification: "PhD",
    interests: "AI, ML"
  };

  beforeEach(() => {
    profileService.get_profile_data.mockResolvedValue(mockProfile);
    profileService.update_profile_data.mockResolvedValue({ message: "Profile updated" });

    // Mock useUserAuth return value
    useUserAuth.mockReturnValue({
      logOut: jest.fn(),
      user: { email: "test@example.com", role: "user" },
    });
  });

  it("renders profile data fetched from service", async () => {
    render(<Profile />);
    expect(profileService.get_profile_data).toHaveBeenCalledWith("test@example.com");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test University")).toBeInTheDocument();
    });
  });

  it("toggles to edit mode when button is clicked", async () => {
    render(<Profile />);
    await screen.findByText("Edit Profile");

    fireEvent.click(screen.getByText("Edit Profile"));
    expect(screen.getByText("View Profile")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test User")).not.toBeDisabled();
  });

  it("shows validation error when name is too short", async () => {
    render(<Profile />);
    fireEvent.click(await screen.findByText("Edit Profile"));

    const nameInput = await screen.findByDisplayValue("Test User");
    fireEvent.change(nameInput, { target: { value: "A" } });

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 3 characters.")).toBeInTheDocument();
    });
  });

  it("triggers autosave and shows success toast", async () => {
    jest.useFakeTimers();
    render(<Profile />);
    fireEvent.click(await screen.findByText("Edit Profile"));

    const input = await screen.findByDisplayValue("Test User");
    fireEvent.change(input, { target: { value: "Updated User" } });

    jest.advanceTimersByTime(1300);

    await waitFor(() => {
      expect(profileService.update_profile_data).toHaveBeenCalledWith(expect.objectContaining({
        name: "Updated User",
        email: "test@example.com"
      }));
    });

    jest.useRealTimers();
  });
});
