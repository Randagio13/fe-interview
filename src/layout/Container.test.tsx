import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

describe("Container Component", () => {
  it("renders with children", () => {
    render(
      <Container>
        <p>Test content</p>
      </Container>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<Container />);

    const container = document.querySelector(".poppins-medium");
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("applies default poppins-medium class", () => {
    render(
      <Container>
        <span>Content</span>
      </Container>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("poppins-medium");
  });

  it("applies custom className along with default class", () => {
    render(
      <Container className="custom-class">
        <span>Content</span>
      </Container>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("poppins-medium");
    expect(container).toHaveClass("custom-class");
  });

  it("renders as a div element", () => {
    render(
      <Container>
        <span data-testid="child">Content</span>
      </Container>,
    );

    const container = screen.getByTestId("child").parentElement;
    expect(container?.tagName).toBe("DIV");
  });

  it("handles multiple children", () => {
    render(
      <Container>
        <h1>Title</h1>
        <p>Paragraph</p>
        <button type="button">Button</button>
      </Container>,
    );

    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Button" })).toBeInTheDocument();
  });

  it("handles nested components", () => {
    render(
      <Container>
        <div>
          <Container className="nested">
            <span>Nested content</span>
          </Container>
        </div>
      </Container>,
    );

    expect(screen.getByText("Nested content")).toBeInTheDocument();

    const nestedContainer = screen.getByText("Nested content").parentElement;
    expect(nestedContainer).toHaveClass("poppins-medium");
    expect(nestedContainer).toHaveClass("nested");
  });

  it("handles complex content structure", () => {
    render(
      <Container className="wrapper">
        <header>
          <h1>Header</h1>
        </header>
        <main>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
        </main>
        <footer>
          <p>Footer content</p>
        </footer>
      </Container>,
    );

    const container = screen.getByRole("heading", { name: "Header" }).closest(".wrapper");
    expect(container).toHaveClass("poppins-medium");
    expect(container).toHaveClass("wrapper");

    expect(screen.getByRole("heading", { name: "Header" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Section Title" })).toBeInTheDocument();
    expect(screen.getByText("Section content")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("handles empty string className", () => {
    render(
      <Container className="">
        <span>Content</span>
      </Container>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("poppins-medium");
    expect(container?.className).toBe("poppins-medium ");
  });

  it("handles undefined className", () => {
    render(
      <Container className={undefined}>
        <span>Content</span>
      </Container>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("poppins-medium");
  });
});
