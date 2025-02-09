// import logo from "./logo.svg";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth/auth";
import Home from "./pages/home/home";
import Navbar from "./Navbar";
import { UserContextProvider } from "./UserContext";
import Createevent from "./pages/createevent/createevent";
import Profile from "./pages/profile/profile";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <AppNavbar />
      </BrowserRouter>
    </UserContextProvider>
  );
}

const AppNavbar = () => {
  const location = useLocation();

  return (
    <section className={location.pathname === "/auth" ? "mainsection" : ""}>
      {location.pathname !== "/auth" && <Navbar />}

      <Routes>
        <Route index element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/createevent" element={<Createevent />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </section>
  );
};

export default App;
