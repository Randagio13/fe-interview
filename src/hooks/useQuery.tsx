import { useEffect, useState } from "react";
import { mockUsers, type Role, type User } from "../data/users";

export const useQuery = (searchName?: string, role?: Role, users: User[] = mockUsers) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate server request delay
    if (!isLoading) setLoading(true);
    setTimeout(() => {
      if (!searchName) return;
      let filtered = users;

      // Filter by name
      if (searchName.trim()) {
        filtered = filtered.filter((user) =>
          user.name.toLowerCase().includes(searchName.toLowerCase()),
        );
      }

      if (role) {
        filtered = filtered.filter((user) => user.role === role);
      }

      setFilteredUsers(filtered);
      setLoading(false);
    }, 1000);
  }, [searchName, role, users.length]);

  return {
    filteredUsers,
    isLoading,
    count: filteredUsers.length,
  };
};
