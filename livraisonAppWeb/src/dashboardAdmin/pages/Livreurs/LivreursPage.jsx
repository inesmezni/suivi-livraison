import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "../../../api/api";  // Ajuste le chemin
import LivreursTable from "../../components/Livreurs/LivreursTable";
import LivreursForm from "../../components/Livreurs/LivreursForm";
import LivreursDetails from "../../components/Livreurs/LivreursDetails";
import "./LivreursPage.css";

const LivreursPage = () => {
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicules, setVehicules] = useState([]); // À implémenter plus tard
  const [showForm, setShowForm] = useState(false);
  const [editLivreur, setEditLivreur] = useState(null);
  const [selectedLivreur, setSelectedLivreur] = useState(null);

  // ✅ FETCH LIVREURS BDD
  useEffect(() => {
    fetchLivreurs();
  }, []);

  const fetchLivreurs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/livreurs");
      console.log("🚚 Livreurs BDD:", response.data);
      
      // Map backend → frontend
      const formatted = response.data.map(l => ({
      id: l.id,
      prenom: l.prenom,
      nom: l.nom,
      telephone: l.telephone,
      email: l.email,
      statut: l.actif ? "Actif" : "Inactif",
      noteMoyenne: l.note,
      vehicleInfo: l.vehicleInfo,  // ✅ Matricule pour tableau + détails
      typeVehicule: l.typeVehicule, 
      driverStatut: l.driverStatut
    }));
      
      setLivreurs(formatted);
    } catch (error) {
      console.error("❌ Erreur livreurs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE LIVREUR
  const handleSave = async (data) => {
  try {
    const livreurData = {
      id: editLivreur?.id,  // ✅ ID pour UPDATE
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,           // ✅ AJOUTÉ
      motDePasse: data.motDePasse, // ✅ AJOUTÉ (si rempli)
      telephone: data.telephone,
      vehicleInfo: data.vehicleInfo,
      typeVehicule: data.typeVehicule,
      driverStatut: data.statut,
      actif: data.statut === "Actif",
      role: "ROLE_LIVREUR"
    };

    console.log("💾 ENVOI:", livreurData); // DEBUG

    if (editLivreur) {
      // UPDATE
      await api.put(`/api/livreurs/${editLivreur.id}`, livreurData);
      console.log("✅ UPDATE OK");
    } else {
      // CREATE
      await api.post("/api/livreurs", livreurData);
      console.log("✅ CREATE OK");
    }
    
    fetchLivreurs();
    setShowForm(false);
    setEditLivreur(null);
  } catch (error) {
    console.error("❌ Save erreur:", error.response?.data || error);
    alert("Erreur: " + (error.response?.data?.message || "Sauvegarde échouée"));
  }
};


  // ✅ DELETE LIVREUR
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce livreur ?")) return;
    
    try {
      await api.delete(`/api/livreurs/${id}`);
      fetchLivreurs(); // Refresh
    } catch (error) {
      console.error("❌ Delete:", error);
      alert("Erreur suppression");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="livreurs-page">
        <div style={{ padding: "100px", textAlign: "center" }}>
          Chargement des livreurs...
        </div>
      </div>
    );
  }

  return (
    <div className="livreurs-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Gestion des Livreurs</h1>
        <button 
          onClick={() => { setShowForm(true); setEditLivreur(null); }} 
          className="btn-add"
          disabled={loading}
        >
          <Plus size={22} />
          Ajouter un livreur
        </button>
      </div>

      {/* Tableau */}
      <div className="table-card">
        <LivreursTable
          livreurs={livreurs}
          vehicules={vehicules}
          onView={setSelectedLivreur}
          onEdit={(l) => { setEditLivreur(l); setShowForm(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h2>{editLivreur ? "Modifier le livreur" : "Nouveau livreur"}</h2>
            <LivreursForm
              initialData={editLivreur}
              vehicules={vehicules}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {selectedLivreur && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedLivreur(null)}>
          <div className="modal wide">
            <button className="close-btn" onClick={() => setSelectedLivreur(null)}>×</button>
            <LivreursDetails
              livreur={selectedLivreur}
              vehicule={null} // À mapper
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LivreursPage;
