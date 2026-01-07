import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useQuery } from "../hooks/useQuery";
import SearchResults from "./SearchResults";

// Mock the useQuery hook
vi.mock("../hooks/useQuery");
const mockUseQuery = vi.mocked(useQuery);

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    title: "Software Engineer",
    team: "Engineering",
    email: "john@example.com",
    role: "admin" as const,
    details: "Test details",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Product Manager",
    team: "Product",
    email: "jane@example.com",
    role: "editor" as const,
    details: "Test details",
  },
];

describe("SearchResults Component", () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      filteredUsers: mockUsers,
      isLoading: false,
      count: mockUsers.length,
    });
  });

  it("renders search results with filter buttons", () => {
    render(<SearchResults query="test" />);

    expect(screen.getByText("FILTER BY:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "admin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "editor" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "viewer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "guest" })).toBeInTheDocument();

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseQuery.mockReturnValue({
      filteredUsers: [],
      isLoading: true,
      count: 0,
    });

    render(<SearchResults query="test" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when no results found", () => {
    mockUseQuery.mockReturnValue({
      filteredUsers: [],
      isLoading: false,
      count: 0,
    });

    render(<SearchResults query="test" />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("filters by role when filter button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchResults query="test" />);

    // Initially called with no role
    expect(mockUseQuery).toHaveBeenLastCalledWith("test", undefined);

    const adminButton = screen.getByRole("button", { name: "admin" });
    await user.click(adminButton);

    // Should be called with admin role after click
    expect(mockUseQuery).toHaveBeenLastCalledWith("test", "admin");
  });

  it("shows active state for selected role", async () => {
    const user = userEvent.setup();
    render(<SearchResults query="test" />);

    const editorButton = screen.getByRole("button", { name: "editor" });

    // Initially not active
    expect(editorButton).not.toHaveClass("active");

    // Click to select
    await user.click(editorButton);
    expect(editorButton).toHaveClass("active");
  });

  it("has proper data-role attributes on filter buttons", () => {
    render(<SearchResults query="test" />);

    expect(screen.getByRole("button", { name: "admin" })).toHaveAttribute("data-role", "admin");
    expect(screen.getByRole("button", { name: "editor" })).toHaveAttribute("data-role", "editor");
    expect(screen.getByRole("button", { name: "viewer" })).toHaveAttribute("data-role", "viewer");
    expect(screen.getByRole("button", { name: "guest" })).toHaveAttribute("data-role", "guest");
    render(<SearchResults query="test" />);

    const divider = document.querySelector(".divider");
    expect(divider).toBeInTheDocument();
  });

  it("does not show empty state when no query provided", () => {
    mockUseQuery.mockReturnValue({
      filteredUsers: [],
      isLoading: false,
      count: 0,
    });

    render(<SearchResults />);

    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("renders 'View Details' buttons for each user", () => {
    render(<SearchResults query="test" />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    expect(viewDetailsButtons).toHaveLength(mockUsers.length);
  });

  it("calls setCurrentUser when 'View Details' button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetCurrentUser = vi.fn();

    render(<SearchResults query="test" setCurrentUser={mockSetCurrentUser} />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    expect(mockSetCurrentUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("calls setCurrentUser with correct user for different buttons", async () => {
    const user = userEvent.setup();
    const mockSetCurrentUser = vi.fn();

    render(<SearchResults query="test" setCurrentUser={mockSetCurrentUser} />);

    const viewDetailsButtons = screen.getAllByText("View Details");

    // Click first user's button
    await user.click(viewDetailsButtons[0]);
    expect(mockSetCurrentUser).toHaveBeenCalledWith(mockUsers[0]);

    // Click second user's button
    await user.click(viewDetailsButtons[1]);
    expect(mockSetCurrentUser).toHaveBeenCalledWith(mockUsers[1]);
  });

  it("still renders properly when setCurrentUser is not provided", () => {
    render(<SearchResults query="test" />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    expect(viewDetailsButtons).toHaveLength(mockUsers.length);
  });

  it("'View Details' button does not error when clicked without setCurrentUser", async () => {
    const user = userEvent.setup();

    render(<SearchResults query="test" />);

    const viewDetailsButtons = screen.getAllByText("View Details");

    // This should not throw an error
    await user.click(viewDetailsButtons[0]);

    // Test passes if no error is thrown
    expect(viewDetailsButtons[0]).toBeInTheDocument();
  });

  it("combines role filtering with user selection functionality", async () => {
    const user = userEvent.setup();
    const mockSetCurrentUser = vi.fn();

    render(<SearchResults query="test" setCurrentUser={mockSetCurrentUser} />);

    // Test role filter button
    const editorButton = screen.getByRole("button", { name: "editor" });
    await user.click(editorButton);

    // Test view details button
    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);
    expect(mockSetCurrentUser).toHaveBeenCalledWith(mockUsers[0]);
  });
});
