import Nav from "react-bootstrap/Nav";

function Navbar() {
  return (
    <Nav
      activeKey="/link-1"
      onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Register</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2">Login</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar;
