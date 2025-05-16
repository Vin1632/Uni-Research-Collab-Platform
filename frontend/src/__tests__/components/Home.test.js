import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../../components/Home";
import { useNavigate } from "react-router-dom";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock Header component to avoid side effects
jest.mock("../../components/Header", () => () => <div data-testid="mock-header">Mock Header</div>);

describe("Dashboard Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  test("renders header and all proposal cards", () => {
    render(<Dashboard />);

    // Header mock
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();

    // Titles
    expect(screen.getByText("Create Proposal")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.getByText("Recommendations")).toBeInTheDocument();

    // Descriptions
    expect(
      screen.getByText(/Advance knowledge, challenge convention/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Gain insights, track your impact/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Discover ongoing research/i)
    ).toBeInTheDocument();
  });

  test("navigates to /add-proposal on clicking Create Proposal card", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByLabelText("Create Project"));
    expect(mockNavigate).toHaveBeenCalledWith("/add-proposal");
  });

  test("navigates to /milestones on clicking Reports card", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByLabelText("Reports"));
    expect(mockNavigate).toHaveBeenCalledWith("/milestones/");
  });

  test("navigates to /recommendations on clicking Recommendations card", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByLabelText("Recommendations"));
    expect(mockNavigate).toHaveBeenCalledWith("/recommendations");
  });
});
