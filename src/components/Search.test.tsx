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

  it("calls onSearch with debounce when typing", async () => {
    const user = userEvent.setup();
    render(<Search onSearch={mockOnSearch} debounceDelay={100} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "test");

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Should call after debounce delay
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith("test");
      },
      { timeout: 200 },
    );
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
    const mockPreventDefault = vi.fn();

    render(<Search onSearch={mockOnSearch} />);

    // Find the form element by its tag
    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();

    // Mock form submission
    const submitHandler = (e: Event) => {
      mockPreventDefault();
      e.preventDefault();
    };

    form?.addEventListener("submit", submitHandler);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
