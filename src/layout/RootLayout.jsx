import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
     <Nav />
        <Outlet />
    <Footer />
    </div>
  );
}
