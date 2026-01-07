import { useState } from "react";
import { type Role, roles } from "../data/users";
import { useQuery } from "../hooks/useQuery";

interface SearchResultsProps {
  query?: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const { filteredUsers, isLoading } = useQuery(query, selectedRole);
  if (filteredUsers.length === 0 && !query) {
    return null;
  }
  if (isLoading) {
    return <div className="search-results loading">Loading...</div>;
  }

  return (
    <div className="search-results">
      <div className="filter-container">
        <span className="filter-label">FILTER BY:</span>
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`filter-button ${selectedRole === role ? "active" : ""}`}
            data-role={role}
            type="button"
          >
            {role}
          </button>
        ))}
      </div>
      <hr className="divider" />
      {filteredUsers.length === 0 ? (
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
            <button type="button" className="card-button">
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchResults;
