import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewerDashboard from "../../components/ReviewerDashboard";
import { useNavigate } from "react-router-dom";

// Mock react-router-dom useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock Header to avoid rendering internals in tests
jest.mock("../../components/Header", () => () => <div data-testid="mock-header" />);

describe("ReviewerDashboard", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it("renders all three reviewer cards with correct titles and summaries", () => {
    render(<ReviewerDashboard />);

    // Header is rendered
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();

    // Review Projects card
    expect(screen.getByRole("button", { name: /review projects/i })).toBeInTheDocument();
    expect(screen.getByText("Review Projects")).toBeInTheDocument();
    expect(screen.getByText(/explore available research projects/i)).toBeInTheDocument();

    // My Reviews card
    expect(screen.getByRole("button", { name: /my reviews/i })).toBeInTheDocument();
    expect(screen.getByText("My Reviews")).toBeInTheDocument();
    expect(screen.getByText(/access projects you've previously reviewed/i)).toBeInTheDocument();

    // Recommendations card
    expect(screen.getByRole("button", { name: /recommendations/i })).toBeInTheDocument();
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText(/discover projects matching your expertise/i)).toBeInTheDocument();
  });

  it("navigates to /review when Review Projects card is clicked", () => {
    render(<ReviewerDashboard />);

    const reviewCard = screen.getByRole("button", { name: /review projects/i });
    fireEvent.click(reviewCard);

    expect(mockNavigate).toHaveBeenCalledWith("/review");
  });

  it("navigates to /my-reviews when My Reviews card is clicked", () => {
    render(<ReviewerDashboard />);

    const myReviewsCard = screen.getByRole("button", { name: /my reviews/i });
    fireEvent.click(myReviewsCard);

    expect(mockNavigate).toHaveBeenCalledWith("/my-reviews");
  });

  it("navigates to /recommendations when Recommendations card is clicked", () => {
    render(<ReviewerDashboard />);

    const recommendationsCard = screen.getByRole("button", { name: /recommendations/i });
    fireEvent.click(recommendationsCard);

    expect(mockNavigate).toHaveBeenCalledWith("/recommendations");
  });
});
