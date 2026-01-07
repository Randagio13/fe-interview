import { type JSX, useEffect, useId, useState } from "react";

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
  debounceDelay = 500,
}: SearchProps): JSX.Element {
  const [query, setQuery] = useState("");
  const searchId = useId();

  // Debounce the search
  useEffect(() => {
    if (!query) return;

    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch, debounceDelay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <search className="search-container" aria-label="Search form" data-testid="search-container">
      <label htmlFor={searchId} className="poppins-medium search-label">
        {label}
      </label>
      <div className="search-form">
        <form onSubmit={handleSubmit}>
          <input
            id={searchId}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="search-input"
            aria-describedby={`${searchId}-description`}
            autoComplete="off"
          />
          <button type="submit" className="search-button" aria-label="Submit search">
            Search
          </button>
        </form>
      </div>
    </search>
  );
}

export default Search;
