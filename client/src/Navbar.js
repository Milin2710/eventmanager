import { useContext, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(UserContext);

  async function getuserdata() {
    try {
      const response = await fetch("http://localhost:5000/getuserdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        console.log("Received user info:", userInfo);
        setUserInfo(userInfo);
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    if (!userInfo.name) {
      getuserdata();
    }
  }, []);

  const email = userInfo?.email;
  async function logout() {
    const response = await fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: "POST",
    });
    if (response.ok) {
      setUserInfo();
      navigate("/");
    }
  }
  return (
    <nav>
      <div className="content">
        <div className="logo">
          <img src="/images/mainlogo.png" alt="" />
        </div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          {!email ? (
            <>
              <li>
                <NavLink
                  to="/auth"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/auth?login"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/createevent"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Create Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "active profile" : "profile"
                  }
                >
                  {userInfo.name.charAt(0).toUpperCase()}
                </NavLink>
              </li>
              <li>
                <a href="/" onClick={logout}>
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
