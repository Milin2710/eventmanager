import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import styles from "./profile.module.css";

export default function Profile() {
  const [events, setevents] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { setUserInfo, userInfo } = useContext(UserContext);

  async function getadminevents() {
    const response = await fetch(
      `http://localhost:5000/getadminevents?page=${currentPage}`,
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
    setevents(data.events);
    setTotalPages(data.totalPages);
  }

  useEffect(() => {
    getadminevents();
  }, [currentPage]);

  useEffect(() => {
    getadminevents();
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <section className={styles.profile}>
      <h1>YOUR EVENTS</h1>

      {userInfo.profilepic ? (
        <>
          <img className={styles.profilepic} src={userInfo.profilepic} alt="" />
        </>
      ) : (
        <>
          <div className={styles.noprofile}>
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
        </>
      )}
      <div className="nameemail">
        <p>
          <b>Name:</b> {userInfo.name}
        </p>
        <p>
          <b>Email:</b> {userInfo.email}
        </p>
      </div>

      <ul>
        {(Array.isArray(events) && events.length > 0) || currentPage > 1 ? (
          events.map((event) => {
            return (
              <li key={event._id}>
                <div className={styles.event}>
                  <p className={styles.eventname}>{event.eventname}</p>
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
                      <span>
                        {new Date(event.eventdate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button className={styles.update}>UPDATE</button>
                  <button className={styles.delete}>DELETE</button>
                </div>
              </li>
            );
          })
        ) : (
          <>
            <p>You haven't created any events</p>
          </>
        )}

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
      </ul>
    </section>
  );
}
