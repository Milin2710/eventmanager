import { useState } from "react";
import styles from "./auth.module.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [name, setname] = useState();
  const [profilepic, setprofilepic] = useState(null);
  const [redmessage, setredmessage] = useState();
  const [greenmessage, setgreenmessage] = useState();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const login = queryParams.get("login") == null ? false : true;
  const islogin = login ? "Login" : "Register";

  async function loginfetch(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      setgreenmessage("Login successful.");
      setredmessage("");
      navigate("/");
    } else {
      setredmessage("Wrong credentials. Please try again.");
      setgreenmessage("");
    }
  }
  async function register(ev) {
    ev.preventDefault();

    const requestBody = new FormData();
    requestBody.append("name", name);
    requestBody.append("email", email);
    requestBody.append("password", password);

    if (profilepic) {
      console.log("Profile picture added");
      requestBody.append("profilepic", profilepic); // Assuming profilepic is a file input or a File object
    }

    console.log(requestBody); // Just to see what the FormData looks like

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      body: requestBody, // Send the FormData directly
      credentials: "include", // Include credentials (cookies)
    });

    const result = await response.json();

    if (response.ok) {
      setgreenmessage("Registration successful.");
      setredmessage("");
      navigate("/auth?login");
    } else {
      if (result.status === "alreadyexists") {
        setredmessage(`${email} is already registered`);
      } else {
        setredmessage("Something went wrong. Please try again.");
      }
      setgreenmessage("");
    }
  }

  return (
    <section className={styles.authsection}>
      <div className={styles.content}>
        <h1>{islogin}</h1>
        <form onSubmit={login ? loginfetch : register}>
          {login ? (
            <></>
          ) : (
            <>
              <div className={styles.forminputdiv}>
                <label htmlFor="name">Enter your name</label>
                <div className={styles.inputdiv}>
                  <img src="/icons/name.svg" alt="" />
                  <input
                    type="text"
                    placeholder="Name"
                    onChange={(ev) => setname(ev.target.value)}
                  />
                </div>
              </div>
              <div className={styles.forminputdiv}>
                <label htmlFor="name">Enter your name</label>
                {/* <div className={styles.inputdiv}> */}
                <input
                  type="file"
                  onChange={(ev) => setprofilepic(ev.target.files[0])}
                />
                {/* </div> */}
              </div>
            </>
          )}
          <div className={styles.forminputdiv}>
            <label htmlFor="name">Enter your email</label>
            <div className={styles.inputdiv}>
              <img src="/icons/email.svg" alt="" />
              <input
                type="email"
                placeholder="Email"
                onChange={(ev) => setemail(ev.target.value)}
              />
            </div>
          </div>
          <div className={styles.forminputdiv}>
            <label htmlFor="name">
              Enter {login ? "new" : "your"} password
            </label>
            <div className={styles.inputdiv}>
              <img src="/icons/password.svg" alt="" />
              <input
                type="password"
                placeholder="Password"
                onChange={(ev) => setpassword(ev.target.value)}
              />
            </div>
          </div>
          <p className={styles.redmessage}>{redmessage}</p>
          <p className={styles.greenmessage}>{greenmessage}</p>
          <button type="submit">{login ? "Login" : "Register"}</button>
        </form>
      </div>
      {login ? (
        <p className={styles.loginmessage}>
          Don't have an account? <Link to="/auth">Register</Link>
        </p>
      ) : (
        <p className={styles.loginmessage}>
          Already have a account? <Link to="/auth?login">Login</Link>
        </p>
      )}
    </section>
  );
}
