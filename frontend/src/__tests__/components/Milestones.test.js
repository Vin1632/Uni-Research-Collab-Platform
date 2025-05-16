import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Milestones from "../../components/Milestones";
import Header from "../../components/Header";
import { get_project_data } from "../../services/milestone_tracking_service";
import { useNavigate } from "react-router-dom";
//import { FaImage } from "react-icons/fa";

jest.mock("../../components/Header");
jest.mock("../../services/milestone_tracking_service");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("Milestones component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    Header.mockImplementation(({ onUser_IdLoaded }) => {
      // Simulate Header calling onUser_IdLoaded immediately with user_id = 1
      React.useEffect(() => {
        onUser_IdLoaded(1);
      }, [onUser_IdLoaded]);
      return <div>Mocked Header</div>;
    });

    get_project_data.mockReset();
    mockNavigate.mockReset();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders Header and fetches projects on user_id set", async () => {
    const fakeProposals = [
      {
        project_id: 1,
        title: "Project One",
        description: "Description One",
        link_image: "https://example.com/image1.jpg",
      },
      {
        project_id: 2,
        title: "Project Two",
        description: "Description Two",
        link_image: "",
      },
    ];
    get_project_data.mockResolvedValue([fakeProposals]);

    render(<Milestones />);

    expect(screen.getByText("Mocked Header")).toBeInTheDocument();

    // Wait for proposals to be loaded and rendered
    await waitFor(() => {
      expect(get_project_data).toHaveBeenCalledWith(1);
      expect(screen.getByText("Project One")).toBeInTheDocument();
      expect(screen.getByText("Project Two")).toBeInTheDocument();
    });
  });

  test("clicking on proposal navigates with correct state", async () => {
    const fakeProposals = [
      {
        project_id: 1,
        title: "Clickable Project",
        description: "Some description",
        link_image: "",
      },
    ];
    get_project_data.mockResolvedValue([fakeProposals]);

    render(<Milestones />);

    // Wait for proposal to render
    await waitFor(() => {
      expect(screen.getByText("Clickable Project")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Clickable Project").closest("article"));

    expect(mockNavigate).toHaveBeenCalledWith("/project_details_user", {
      state: { project_id: 1 },
    });
  });
});

describe("ProposalCard component", () => {
  const ProposalCard = require("../../components/Milestones").ProposalCard;

  test("renders image when valid link_image present", () => {
    const proposal = {
      project_id: 1,
      title: "Image Project",
      description: "Desc",
      link_image: "https://example.com/image.jpg",
    };
    const onClick = jest.fn();

    render(<ProposalCard proposal={proposal} onClick={onClick} />);

    const img = screen.getByAltText("Image Project");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", proposal.link_image);
  });

  test("renders fallback icon when no valid link_image", () => {
    const proposal = {
      project_id: 2,
      title: "No Image Project",
      description: "Desc",
      link_image: "",
    };
    const onClick = jest.fn();
  
    render(<ProposalCard proposal={proposal} onClick={onClick} />);
  
    // There should be no <img> tag
    expect(screen.queryByRole("img")).toBeNull();
  
    // Text content is rendered
    expect(screen.getByText("No Image Project")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  
    // Fallback icon div exists
    expect(document.querySelector(".fallback-icon")).toBeInTheDocument();
  });
  

  test("sets fallback icon on image error", () => {
    const proposal = {
      project_id: 3,
      title: "Broken Image Project",
      description: "Desc",
      link_image: "broken-link.jpg",
    };
    const onClick = jest.fn();

    render(<ProposalCard proposal={proposal} onClick={onClick} />);

    const img = screen.getByAltText("Broken Image Project");
    expect(img).toBeInTheDocument();

    fireEvent.error(img);

    // After error, the image should be removed and fallback icon shown
    // Re-render is async due to useState, so use waitFor
    return waitFor(() => {
      expect(screen.queryByAltText("Broken Image Project")).not.toBeInTheDocument();
      expect(screen.getByText((content, node) => {
        return node.classList?.contains("fallback-icon");
      })).toBeInTheDocument();
    });
  });
});
