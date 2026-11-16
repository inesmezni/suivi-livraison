// src/dashboardAdmin/components/Livreurs/LivreursTable.jsx
import React from "react";
import { Eye, Edit2, Trash2, Star } from "lucide-react";

const LivreursTable = ({ livreurs, vehicules, onView, onEdit, onDelete }) => {
  const getStatusClass = (statut) => {
    switch (statut) {
      case "Actif": return "status actif";
      case "Inactif": return "status inactif";
      default: return "status inactif";
    }
  };

  return (
    <div className="table-container">
      <table className="livreurs-table">
        <thead>
          <tr>
            <th>Nom complet</th>
            <th>Téléphone</th>
            <th>Statut</th>
            <th>Note</th>
            <th>matricule Véhicule</th>
            <th>Type véhicule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {livreurs.map((l) => {
            const v = vehicules.find(veh => veh.id === l.vehiculeId);
            return (
              <tr key={l.id}>
                <td><strong>{l.prenom} {l.nom}</strong></td>
                <td>{l.telephone}</td>
                <td><span className={getStatusClass(l.statut)}>{l.statut}</span></td>
                <td className="note">
                  {l.noteMoyenne ? (
                    <>★ <span>{l.noteMoyenne}</span></>
                  ) : "—"}
                </td>
                <td>{l.vehicleInfo || "—"}</td>
                <td>{l.typeVehicule || "—"}</td>
                <td className="actions">
                  <button onClick={() => onView(l)} title="Voir"><Eye size={18} /></button>
                  <button onClick={() => onEdit(l)} title="Modifier"><Edit2 size={18} /></button>
                  <button onClick={() => onDelete(l.id)} title="Supprimer"><Trash2 size={18} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LivreursTable;