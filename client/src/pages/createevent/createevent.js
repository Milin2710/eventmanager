import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./createevent.module.css";

export default function Createevent() {
  const [eventname, seteventname] = useState("");
  const [eventdesc, seteventdesc] = useState("");
  const [eventdate, seteventdate] = useState("");
  const [eventmemberscapacity, seteventmemberscapacity] = useState(0);
  const [redmessage, setredmessage] = useState("");
  const [greenmessage, setgreenmessage] = useState("");
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  async function createnewevent(ev) {
    ev.preventDefault();
    const data = {
      admin: userInfo.name,
      adminemail: userInfo.email,
      eventname,
      eventdesc,
      eventdate,
      eventmemberscapacity,
    };
    console.log("Sending data:", data);
    const response = await fetch("http://localhost:5000/createnewevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (response.ok) {
      setgreenmessage("Event created successfully");
      setredmessage("");
    } else {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      if (errorData.status === "adminnotfound") {
        setredmessage("Login first to create event");
        setgreenmessage("");
      } else {
        setredmessage("Something went wrong. Please try again");
        setgreenmessage("");
      }
    }
  }

  return (
    <div className={styles.createeventsection}>
      <form onSubmit={createnewevent} className={styles.form}>
        <h1>CREATE NEW EVENT</h1>
        <p className={styles.redmessage}>{redmessage}</p>
        <p className={styles.greenmessage}>{greenmessage}</p>
        <div className={styles.inputdiv}>
          <label htmlFor="name">ADMIN</label>
          <input type="text" value={userInfo.name} disabled />
        </div>
        <div className={styles.inputdiv}>
          <label htmlFor="name">Event Name</label>
          <input type="text" onChange={(ev) => seteventname(ev.target.value)} />
        </div>
        <div className={styles.inputdiv}>
          <label htmlFor="description">Event Description</label>
          <textarea rows={3} onChange={(ev) => seteventdesc(ev.target.value)} />
        </div>
        <div className={styles.inputdiv}>
          <label htmlFor="name">Date/Time</label>
          <input
            type="date"
            name="date"
            placeholder="01/01/01"
            onChange={(ev) => seteventdate(ev.target.value)}
          />
        </div>
        <div className={styles.inputdiv}>
          <label htmlFor="name">Max members capacity</label>
          <input
            type="number"
            onChange={(ev) => seteventmemberscapacity(ev.target.value)}
          />
        </div>
        <p className={styles.redmessage}>{redmessage}</p>
        <p className={styles.greenmessage}>{greenmessage}</p>
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}
