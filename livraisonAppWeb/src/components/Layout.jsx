import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: "calc(100vh - 180px)" }}>{children}</main>
    <Footer />
  </>
);

export default Layout;