import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </>
  );
};

export default UserLayout;
