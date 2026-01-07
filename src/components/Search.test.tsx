import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Search from "./Search";

describe("Search Component", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("renders with default props", () => {
    render(<Search onSearch={mockOnSearch} />);

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit search" })).toBeInTheDocument();
    expect(screen.getByTestId("search-container")).toBeInTheDocument();
  });

  it("renders with custom placeholder and label", () => {
    render(
      <Search onSearch={mockOnSearch} placeholder="Custom placeholder" label="Custom Label" />,
    );

    expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
    expect(screen.getByLabelText("Custom Label")).toBeInTheDocument();
  });

  it("calls onSearch when form is submitted", async () => {
    const user = userEvent.setup();
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: "Submit search" });

    await user.type(input, "test query");
    await user.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith("test query");
  });

  it("has proper accessibility attributes", () => {
    render(<Search onSearch={mockOnSearch} />);

    const form = screen.getByTestId("search-container");
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button");

    expect(form).toHaveAttribute("aria-label", "Search form");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("aria-describedby");
    expect(button).toHaveAttribute("aria-label", "Submit search");
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    render(<Search onSearch={mockOnSearch} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "new query");

    expect(input).toHaveValue("new query");
  });

  it("prevents default form submission", async () => {
    const user = userEvent.setup();

    render(<Search onSearch={mockOnSearch} />);

    // Add some text to enable the button
    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "test");

    // Get the form and spy on form submission
    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();

    const mockSubmit = vi.fn();
    form?.addEventListener("submit", mockSubmit);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockSubmit).toHaveBeenCalled();
    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });
});
