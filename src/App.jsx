import "./styles/global.css";
import Header from "./components/Header/Header";
import MenuBar from "./components/MenuBar/MenuBar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="content-wrapper">
        <div className="menu-container">
          <MenuBar />
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
