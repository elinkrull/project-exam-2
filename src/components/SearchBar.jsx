import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <InputGroup className="mb-4">
      <InputGroup.Text id="search-label">🔍</InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Search by name or city..."
        aria-label="Search"
        aria-describedby="search-label"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </InputGroup>
  );
}

export default SearchBar;
