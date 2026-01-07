import { useEffect, useState } from "react";
import { mockUsers, type Role, type User } from "../data/users";

export const useQuery = (searchName?: string, role?: Role, users: User[] = mockUsers) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // No search and no role - return empty results immediately
    if (!searchName && !role) {
      setFilteredUsers([]);
      setLoading(false);
      return;
    }

    // Simulate server request delay when there is search/filter criteria
    setLoading(true);
    setTimeout(() => {
      let filtered = users;

      // Filter by name if provided
      if (searchName?.trim()) {
        filtered = filtered.filter((user) =>
          user.name.toLowerCase().includes(searchName.toLowerCase()),
        );
      }

      // Filter by role if provided
      if (role) {
        filtered = filtered.filter((user) => user.role.toLowerCase() === role.toLowerCase());
      }

      setFilteredUsers(filtered);
      setLoading(false);
    }, 500);
  }, [searchName, role, users.length]);

  return {
    filteredUsers,
    isLoading,
    count: filteredUsers.length,
  };
};
