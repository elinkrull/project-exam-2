import Footer from "../components/Footer";
import Header from "../components/Header";
import VenueCard from "../components/Product";

function Home() {
  return (
    <>
      <Header className="homepage" />
      <main className="home">
        <h1>Listing of all venues here</h1>
        <VenueCard />
      </main>
      <Footer />
    </>
  );
}

export default Home;
