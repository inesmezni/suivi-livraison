// src/dashbordAdmin/components/Historique/HistoriqueTable.jsx
import React from "react";
import "./Historique.css";

const HistoriqueTable = ({ livraisons, onView }) => {
  return (
    <table className="historique-table">
      <thead>
        <tr>
          <th>Identifiant</th>
          <th>Client</th>
          <th>Date & Heure</th>
          <th>Durée</th>
          <th>Statut</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {livraisons.map((l) => (
          <tr key={l.id}>
            <td>{l.id}</td>
            <td>{l.client}</td>
            <td>{l.date}</td>
            <td>{l.duree}</td>
            <td>
  <span className="status-badge livree">
    {l.statut || '—'}
  </span>
</td>
            <td>
              <button onClick={() => onView(l)}>Voir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoriqueTable;
