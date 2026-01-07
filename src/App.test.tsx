import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { useQuery } from "./hooks/useQuery";

// Mock the useQuery hook
vi.mock("./hooks/useQuery");
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
    details: "Experienced software engineer specializing in React development",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Product Manager",
    team: "Product",
    email: "jane@example.com",
    role: "editor" as const,
    details: "Product manager with 5+ years experience in user research",
  },
];

// Mock HTMLDialogElement methods
const mockShowModal = vi.fn();
const mockClose = vi.fn();

beforeEach(() => {
  // Mock dialog element methods
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    value: mockShowModal,
    writable: true,
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    value: mockClose,
    writable: true,
  });

  mockShowModal.mockClear();
  mockClose.mockClear();

  // Default mock return value
  mockUseQuery.mockReturnValue({
    filteredUsers: mockUsers,
    isLoading: false,
    count: mockUsers.length,
  });
});

describe("App Component", () => {
  it("renders the main dashboard elements", () => {
    render(<App />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByLabelText("what are you looking for?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search by name...")).toBeInTheDocument();
  });

  it("renders search results when users are available", () => {
    render(<App />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
  });

  it("shows loading state when search is in progress", () => {
    mockUseQuery.mockReturnValue({
      filteredUsers: [],
      isLoading: true,
      count: 0,
    });

    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when no results found", () => {
    mockUseQuery.mockReturnValue({
      filteredUsers: [],
      isLoading: false,
      count: 0,
    });

    render(<App />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("opens dialog when 'View Details' button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    // Check if dialog is present and has the user's information
    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Example Dialog")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("Experienced software engineer specializing in React development"),
    ).toBeInTheDocument();
  });

  it("opens dialog with correct user information for different users", async () => {
    const user = userEvent.setup();
    render(<App />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[1]); // Click second user

    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("Product manager with 5+ years experience in user research"),
    ).toBeInTheDocument();
  });

  it("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open dialog
    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    // Close dialog
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("updates search results when search query changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText("Search by name...");
    await user.type(searchInput, "John");

    // useQuery should be called with the search term
    expect(mockUseQuery).toHaveBeenCalledWith("John", undefined);
  });

  it("handles role filtering through SearchResults component", async () => {
    const user = userEvent.setup();
    render(<App />);

    const adminFilterButton = screen.getByRole("button", { name: "admin" });
    await user.click(adminFilterButton);

    // useQuery should be called with role filter
    expect(mockUseQuery).toHaveBeenCalledWith("", "admin");
  });

  it("email links are properly formatted", async () => {
    const user = userEvent.setup();
    render(<App />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    const emailLink = screen.getByText("john@example.com");
    expect(emailLink).toHaveAttribute("href", "mailto:john@example.com");
    expect(emailLink).toHaveClass("card-link");
  });

  it("dialog displays role with proper styling", async () => {
    const user = userEvent.setup();
    render(<App />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    const roleLabels = screen.getAllByText("admin");
    const dialogRoleLabel = roleLabels.find(
      (label) =>
        label.getAttribute("data-role") === "admin" && label.classList.contains("filter-button"),
    );

    expect(dialogRoleLabel).toBeInTheDocument();
  });

  it("handles empty user state gracefully", async () => {
    mockUseQuery.mockReturnValue({
      filteredUsers: [],
      isLoading: false,
      count: 0,
    });

    render(<App />);

    // Should not render any user cards
    expect(screen.queryByText("View Details")).not.toBeInTheDocument();

    // Should show empty state
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("maintains dialog state properly", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially dialog should be closed
    expect(document.querySelector("dialog")).not.toHaveAttribute("open");

    // Open dialog
    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    // Dialog should open with showModal called
    expect(mockShowModal).toHaveBeenCalledTimes(1);

    // Close dialog
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    // Dialog should close
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
