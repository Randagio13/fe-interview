import { useState } from "react";
import { type Role, roles, type User } from "../data/users";
import { useQuery } from "../hooks/useQuery";

interface SearchResultsProps {
  query?: string;
  setCurrentUser?: (user: User | null) => void;
}

export function SearchResults({ query, setCurrentUser }: SearchResultsProps) {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const { filteredUsers, isLoading } = useQuery(query, selectedRole);
  if (filteredUsers.length === 0 && !query) {
    return null;
  }
  return (
    <div className="search-results">
      <div className="filter-container">
        <span className="filter-label">FILTER BY:</span>
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role === selectedRole ? undefined : role)}
            className={`filter-button ${selectedRole === role ? "active" : selectedRole ? "opacity-50" : ""}`}
            data-role={role}
            type="button"
          >
            {role}
          </button>
        ))}
      </div>
      <hr className="divider" />
      {isLoading ? (
        <div className="search-results loading">Loading...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="search-results empty">No results found</div>
      ) : (
        filteredUsers.map((result) => (
          <div key={result.id} className="search-result-item poppins-medium">
            <label htmlFor={`role-${result.id}`} data-role={result.role} className="filter-button">
              {result.role}
            </label>
            <div>
              <p className="card-name">{result.name}</p>
              <p className="card-title poppins-regular">{result.title}</p>
            </div>
            <div>
              <p className="poppins-light">Team:</p>
              <p>{result.team}</p>
            </div>
            <div>
              <p className="poppins-light">Contact information:</p>
              <a href={`mailto:${result.email}`} className="card-link">
                {result.email}
              </a>
            </div>
            <button type="button" className="card-button" onClick={() => setCurrentUser?.(result)}>
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchResults;
