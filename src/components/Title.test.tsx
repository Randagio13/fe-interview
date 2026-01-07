import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Title } from "./Title";

describe("Title Component", () => {
  it("renders with default props", () => {
    render(<Title>Test Title</Title>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test Title");
  });

  it("renders with custom level", () => {
    render(<Title level={2}>Test Title</Title>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
  });

  it("renders with custom className", () => {
    render(<Title className="custom-class">Test Title</Title>);
    const heading = screen.getByRole("heading");
    expect(heading).toHaveClass("custom-class");
  });

  it("renders with custom id", () => {
    render(<Title id="custom-id">Test Title</Title>);
    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("id", "custom-id");
  });

  it("has correct aria-level attribute", () => {
    render(<Title level={3}>Test Title</Title>);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveAttribute("aria-level", "3");
  });

  it("renders all heading levels correctly", () => {
    const levels: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];

    levels.forEach((level) => {
      const { unmount } = render(<Title level={level}>Level {level}</Title>);
      const heading = screen.getByRole("heading", { level });
      expect(heading.tagName).toBe(`H${level}`);
      expect(heading).toHaveAttribute("aria-level", level.toString());
      unmount();
    });
  });
});
