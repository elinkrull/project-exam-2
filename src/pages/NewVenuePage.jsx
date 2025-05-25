import Layout from "../components/Layout";
import NewVenueForm from "../components/NewVenueForm";
import { Container } from "react-bootstrap";

function NewVenuePage() {
  return (
    <Layout>
      <Container className="my-5">
        <h1>Create a New Venue</h1>
        <NewVenueForm />
      </Container>
    </Layout>
  );
}

export default NewVenuePage;
