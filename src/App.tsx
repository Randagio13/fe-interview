import { useState } from "react";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import { Title } from "./components/Title";
import { Container } from "./layout/Container";

export function App() {
  const [query, setQuery] = useState("");
  return (
    <Container className="dashboard-container">
      <Title level={1} className="poppins-bold dashboard-title" id="home-title">
        User <span className="dashboard-title-secondary">Dashboard</span>
      </Title>
      <Search
        onSearch={(query) => {
          console.log("Searching for:", query);
          setQuery(query);
        }}
        placeholder="Search by name..."
        label="what are you looking for?"
      />
      <SearchResults query={query} />
    </Container>
  );
}
