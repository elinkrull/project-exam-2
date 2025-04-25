import Header from "../components/Header";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <h1 className="home">Listing of all venues here</h1>
    </>
  );
}

export default Home;
