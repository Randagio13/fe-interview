import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../data/users";
import { useQuery } from "./useQuery";

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    title: "Software Engineer",
    team: "Engineering",
    email: "john@example.com",
    role: "admin",
    details: "Test details",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Product Manager",
    team: "Product",
    email: "jane@example.com",
    role: "editor",
    details: "Test details",
  },
  {
    id: 3,
    name: "Bob Wilson",
    title: "Designer",
    team: "Design",
    email: "bob@example.com",
    role: "viewer",
    details: "Test details",
  },
];

describe("useQuery Hook", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useQuery("", undefined, mockUsers));

    expect(result.current.filteredUsers).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it("filters users by name", async () => {
    const { result } = renderHook(() => useQuery("John", undefined, mockUsers));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].name).toBe("John Doe");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.count).toBe(1);
    });
  });

  it("filters users by role", async () => {
    const { result } = renderHook(() => useQuery("a", "editor", mockUsers));

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].role).toBe("editor");
    });
  });

  it("filters users by both name and role", async () => {
    const { result } = renderHook(() => useQuery("Jane", "editor", mockUsers));

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].name).toBe("Jane Smith");
      expect(result.current.filteredUsers[0].role).toBe("editor");
    });
  });

  it("returns empty array when no matches found", async () => {
    const { result } = renderHook(() => useQuery("NonExistent", undefined, mockUsers));

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(0);
      expect(result.current.count).toBe(0);
    });
  });

  it("handles case insensitive search", async () => {
    const { result } = renderHook(() => useQuery("JOHN", undefined, mockUsers));

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].name).toBe("John Doe");
    });
  });

  it("does not filter when search is empty", () => {
    const { result } = renderHook(() => useQuery("", undefined, mockUsers));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.filteredUsers).toEqual([]);
  });

  it("updates when search term changes", async () => {
    const { result, rerender } = renderHook(
      ({ searchName }) => useQuery(searchName, undefined, mockUsers),
      { initialProps: { searchName: "John" } },
    );

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(1);
    });

    rerender({ searchName: "Jane" });

    await waitFor(() => {
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].name).toBe("Jane Smith");
    });
  });

  it("sets loading state during search", async () => {
    const { result } = renderHook(() => useQuery("test", undefined, mockUsers));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
