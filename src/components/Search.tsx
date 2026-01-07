import { type JSX, useEffect, useId, useRef, useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  label?: string;
  debounceDelay?: number;
}

function Search({
  onSearch,
  placeholder = "Search...",
  label = "Search",
}: SearchProps): JSX.Element {
  const searchId = useId();
  const searchInput = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.current?.value || "");
  };

  return (
    <search className="search-container" aria-label="Search form" data-testid="search-container">
      <label htmlFor={searchId} className="poppins-medium search-label">
        {label}
      </label>
      <div className="search-form">
        <form onSubmit={handleSubmit}>
          <input
            ref={searchInput}
            id={searchId}
            type="text"
            placeholder={placeholder}
            className="search-input"
            aria-describedby={`${searchId}-description`}
            autoComplete="off"
            onChange={(e) => setDisabled(e.target.value.trim() === "")}
          />
          <button
            type="submit"
            className="search-button"
            aria-label="Submit search"
            onSubmit={handleSubmit}
            disabled={disabled}
          >
            Search
          </button>
        </form>
      </div>
    </search>
  );
}

export default Search;
