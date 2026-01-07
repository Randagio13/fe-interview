import { useEffect, useState } from "react";
import { Dialog } from "./components/Dialog";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import { Title } from "./components/Title";
import type { User } from "./data/users";
import { Container } from "./layout/Container";

export function App() {
  const [query, setQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      setIsDialogOpen(true);
    }
  }, [currentUser]);

  return (
    <Container className="dashboard-container">
      <Title level={1} className="poppins-bold dashboard-title" id="home-title">
        User <span className="dashboard-title-secondary">Dashboard</span>
      </Title>
      <Search
        onSearch={(query) => setQuery(query)}
        placeholder="Search by name..."
        label="what are you looking for?"
      />
      <SearchResults query={query} setCurrentUser={setCurrentUser} />

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setCurrentUser(null);
        }}
        title="Example Dialog"
      >
        <div>
          <label
            htmlFor={`role-${currentUser?.id}`}
            data-role={currentUser?.role}
            className="filter-button"
          >
            {currentUser?.role}
          </label>
        </div>
        <div>
          <p className="card-name">{currentUser?.name}</p>
          <p className="card-title poppins-regular">{currentUser?.title}</p>
        </div>
        <div>
          <p className="poppins-light">Team:</p>
          <p>{currentUser?.team}</p>
        </div>
        <div>
          <p className="poppins-light">Contact information:</p>
          <a href={`mailto:${currentUser?.email}`} className="card-link">
            {currentUser?.email}
          </a>
        </div>
        <div>
          <p className="poppins-light">Other details:</p>
          <p>{currentUser?.details}</p>
        </div>
        <div className="dialog-button-container">
          <button
            type="button"
            onClick={() => {
              setIsDialogOpen(false);
              setCurrentUser(null);
            }}
          >
            Close
          </button>
        </div>
      </Dialog>
    </Container>
  );
}
