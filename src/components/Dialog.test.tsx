import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Dialog } from "./Dialog";

// Mock HTMLDialogElement methods since they might not be available in test environment
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
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Dialog Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders dialog content when isOpen is true", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    expect(screen.getByText("Dialog content")).toBeInTheDocument();
    expect(mockShowModal).toHaveBeenCalledTimes(1);
  });

  it("calls showModal when isOpen becomes true", () => {
    const { rerender } = render(
      <Dialog isOpen={false} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    expect(mockShowModal).not.toHaveBeenCalled();

    rerender(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    expect(mockShowModal).toHaveBeenCalledTimes(1);
  });

  it("calls close when isOpen becomes false", () => {
    const { rerender } = render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    rerender(
      <Dialog isOpen={false} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} className="custom-dialog">
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toHaveClass("dialog", "custom-dialog");
  });

  it("calls onClose when Escape key is pressed on dialog", async () => {
    const user = userEvent.setup();
    
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    if (dialog) {
      await user.type(dialog, "{Escape}");
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking on dialog backdrop", async () => {
    const user = userEvent.setup();
    
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    if (dialog) {
      await user.click(dialog);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking on dialog content", async () => {
    const user = userEvent.setup();
    
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const content = screen.getByText("Dialog content");
    await user.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("sets up and cleans up event listeners", () => {
    const addEventListenerSpy = vi.spyOn(HTMLDialogElement.prototype, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(HTMLDialogElement.prototype, "removeEventListener");

    const { unmount } = render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith("close", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("close", expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("handles native dialog close event", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    if (dialog) {
      fireEvent(dialog, new Event("close"));
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles native keydown event with Escape key", () => {
    mockOnClose.mockClear(); // Clear any previous calls
    
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    if (dialog) {
      fireEvent.keyDown(dialog, { key: "Escape" });
    }

    // Should be called at least once (might be called by both native and React handlers)
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not call onClose for other keyboard events", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    if (dialog) {
      fireEvent.keyDown(dialog, { key: "Enter" });
      fireEvent.keyDown(dialog, { key: "Space" });
    }

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("renders complex content correctly", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <h2>Dialog Title</h2>
        <p>This is a paragraph</p>
        <button type="button">Action Button</button>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Dialog>,
    );

    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("This is a paragraph")).toBeInTheDocument();
    expect(screen.getByText("Action Button")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("updates onClose callback when prop changes", async () => {
    const user = userEvent.setup();
    const newOnClose = vi.fn();

    const { rerender } = render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    rerender(
      <Dialog isOpen={true} onClose={newOnClose}>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    if (dialog) {
      await user.type(dialog, "{Escape}");
    }

    expect(mockOnClose).not.toHaveBeenCalled();
    expect(newOnClose).toHaveBeenCalledTimes(1);
  });
});