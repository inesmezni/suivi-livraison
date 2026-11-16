import React, { useState, useEffect } from "react";
import api from "../../../api/api";  // Ton axios
import "./ClientsPage.css";  // Garde CSS livreurs

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH CLIENTS BDD (comme livreurs)
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/clients");  // ✅ TON API
      console.log("👥 Clients BDD:", response.data);
      
      // Map backend → frontend
      const formatted = response.data.map(c => ({
        id: c.id,
        prenom: c.prenom,
        nom: c.nom,
        email: c.email,
        telephone: c.telephone,
        adresse: c.adresseLivraison || c.adresse || "—"
      }));
      
      setClients(formatted);
    } catch (error) {
      console.error("❌ Erreur clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="livreurs-page">
        <div style={{ padding: "100px", textAlign: "center" }}>
          Chargement des clients...
        </div>
      </div>
    );
  }

  return (
    <div className="livreurs-page"> {/* Même classe = même design */}
      
      {/* Header SANS bouton */}
      <div className="page-header" style={{ justifyContent: "flex-start" }}>
        <h1 className="page-title">Liste des Clients</h1>
      </div>

      {/* Tableau 100% identique à Livreurs */}
      <div className="table-card">
        <div className="table-container">
          <table className="livreurs-table"> {/* Même classe = même style */}
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Adresse</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td><strong>{client.nom}</strong></td>
                    <td>{client.prenom}</td>
                    <td>{client.email}</td>
                    <td>{client.telephone}</td>
                    <td>{client.adresse}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#6b7280" }}>
                    Aucun client trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
