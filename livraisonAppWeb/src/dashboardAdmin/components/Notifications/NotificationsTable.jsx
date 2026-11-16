import React from "react";
import { Bell } from "lucide-react";
import "./NotificationTable.css";
const NotificationsTable = ({ notifications }) => {
  if (notifications.length === 0)
    return <p className="empty">Aucune notification envoyée</p>;

  return (
    <div className="table-container">
      <table className="notifications-table">
        <thead>
          <tr>
            <th>Cible</th>
            <th>Titre</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n.id}>
              <td>{n.cible}</td>
              <td><Bell size={14} /> {n.titre}</td>
              <td>{n.message}</td>
              <td>{n.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsTable;
