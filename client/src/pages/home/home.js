import { useContext, useState, useEffect } from "react";
import styles from "./home.module.css";
import { UserContext } from "../../UserContext";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [redmessage, setredmessage] = useState();
  const [greenmessage, setgreenmessage] = useState();
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetchEvents();
  }, [userInfo]);

  async function fetchEvents() {
    try {
      console.log(userInfo);
      const response = await fetch(
        `http://localhost:5000/getevents?page=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userInfo),
        }
      );
      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  useEffect(() => {
    // getuserdata();
    fetchEvents();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  async function joinevent(id) {
    const response = await fetch("http://localhost:5000/joinevent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userInfo.email, id: id }),
      credentials: "include",
    });
    if (response.ok) {
      fetchEvents();
      setgreenmessage("Joined successfully!");
      setredmessage("");
      setTimeout(() => {
        setgreenmessage("");
      }, 2000);
    } else {
      console.log("FAILED");
    }
  }

  return (
    <div className={styles.home}>
      <h1>EVENTS</h1>
      <p className={styles.redmessage}>{redmessage}</p>
      <p className={styles.greenmessage}>{greenmessage}</p>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <div className={styles.event} key={event._id}>
              <p className={styles.eventname}>
                {event.eventname} - {event.admin}
              </p>
              <p className={styles.desc}>{event.eventdesc}</p>
              <div className={styles.content}>
                <p className={styles.members}>
                  <img src="/icons/name.svg" alt="" />
                  <span>
                    {event.members.length - 1}/{event.eventmemberscapacity}
                  </span>
                </p>
                <p className={styles.calendar}>
                  <img src="/icons/calendar.svg" alt="" />
                  <span>{new Date(event.eventdate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.join}
                onClick={() => {
                  joinevent(event._id);
                }}
              >
                JOIN
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.pagenav}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
