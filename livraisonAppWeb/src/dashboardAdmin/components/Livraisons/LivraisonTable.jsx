import React from "react";
import { Eye } from "lucide-react";
import "./LivraisonTable.css";

const LivraisonTable = ({ livraisons = [], onViewDetails }) => {
  const getStatusClass = (statut) => {
    switch(statut) {
      case "Livré": return "status-delivered";
      case "En cours": return "status-in-progress";
      case "Annulé": return "status-cancelled";
      default: return "status-pending";
    }
  };

  return (
    <div className="table-container">
      <table className="livraisons-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code-barres</th>
            <th>Client</th>
            <th>Adresse</th>
            <th>Statut</th>
            <th>Livreur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {livraisons.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.codeBarres}</td>
              <td>{l.clientName}</td>
              <td>{l.adresse}</td>
              <td>
                <span className="badge success" title={l.statut}>
                  {l.statut || 'NULL'}  {/* ✅ Affiche même NULL */}
                </span>
              </td>
              <td>{l.livreurName}</td>
              <td className="action-buttons">
                <button className="btn btn-view" onClick={() => onViewDetails(l)}>
                  <Eye size={16} /> Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LivraisonTable;