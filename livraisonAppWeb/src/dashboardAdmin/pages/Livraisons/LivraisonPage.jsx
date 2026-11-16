import React, { useState, useEffect } from "react";
import { Plus, Barcode, User, MapPin, Eye, Edit2 } from "lucide-react";
import api from "../../../api/api";
import LivraisonForm from "../../components/Livraisons/LivraisonForm";
import "./LivraisonPage.css";

const LivraisonsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLivraison, setEditingLivraison] = useState(null);
  const [livraisons, setLivraisons] = useState([]);
  const [clients, setClients] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH Backend
  useEffect(() => {
    fetchData();
  }, []);


const fetchData = async () => {
  try {
    setLoading(true);
    
    // ✅ SEULEMENT livraisons (clients/livreurs optionnels)
    const livRes = await api.get("/api/livraisons");
    console.log("📦 API Livraisons:", livRes.data); // DEBUG
    
    const formattedLivraisons = livRes.data.map(l => {
      console.log("🔍 Livraison brute:", l); // DEBUG chaque objet
      
      return {
        id: l.numeroLivraison || `LIV-${l.id}`,
        code: l.codeBarre || l.codeBarres || "N/A",       // ✅ + fallback
        client: `${l.client?.prenom || ''} ${l.client?.nom || ''}`.trim() || "Client inconnu",
        adresse: l.adresseLivraison || l.adresse || "Adresse non spécifiée",  // ✅ + fallback
        statut: l.statutLivraison || l.statut || "En attente",
        livreur: l.livreur ? `${l.livreur.prenom || ''} ${l.livreur.nom || ''}`.trim() : null,
        clientId: l.client?.id,
        livreurId: l.livreur?.id,
        rawData: l
      };
    });

    console.log("✅ Formaté:", formattedLivraisons); // DEBUG FINAL
    setLivraisons(formattedLivraisons);
    
  
try {
  console.log("🔍 Fetch clients/livreurs...");
  const [clientRes, livreurRes] = await Promise.all([
    api.get("/api/clients"),
    api.get("/api/livreurs")
  ]);
  console.log("👥 Clients:", clientRes.data);
  console.log("🚚 Livreurs:", livreurRes.data);
  
  setClients(clientRes.data.map(c => ({ 
    id: c.id, 
    name: `${c.prenom} ${c.nom}`.trim()  // Format name pour Form
  })));
  
  setLivreurs(livreurRes.data.map(l => ({ 
    id: l.id, 
    name: `${l.prenom} ${l.nom}`.trim(),
    statut: l.statut || "Disponible"
  })));
  
} catch (e) {
  console.error("❌ APIs clients/livreurs:", e);
  
}

    
  } catch (error) {
    console.error("❌ Erreur API:", error);
  } finally {
    setLoading(false);
  }
 
};

  const handleCreateLivraison = async (formData) => {
  try {
    console.log("📤 Payload envoyé:", formData); // DEBUG
    
    const payload = {
      codeBarre: formData.codeBarres,      // ✅ SINGULIER backend
      client: { id: parseInt(formData.clientId) },     // ✅ parseInt
      adresse: formData.adresse,           
      livreur: formData.livreurId ? { id: parseInt(formData.livreurId) } : null,
      statut: "EN_ATTENTE"                 // ✅ Backend enum
    };
    
    console.log("📤 FINAL payload:", payload);
    
    const response = await api.post("/api/livraisons", payload);
    console.log("✅ Créée:", response.data);
    
    fetchData();
    setShowForm(false);
  } catch (error) {
    console.error("❌ Create ERROR:", error.response?.data);
  }
};


  const handleEditLivraison = async (formData) => {
  try {
    const payload = {
      ...editingLivraison.rawData, 
      codeBarre: formData.codeBarres,      
      client: { id: parseInt(formData.clientId) },
      adresse: formData.adresse,         
      livreur: formData.livreurId ? { id: parseInt(formData.livreurId) } : null,
      statut: formData.statut || editingLivraison.rawData.statut
    };
    
    await api.put(`/api/livraisons/${editingLivraison.rawData.id}`, payload);
    fetchData();
    setEditingLivraison(null);
  } catch (error) {
    console.error("❌ Update ERROR:", error.response?.data);
  }
};

  if (loading) {
    return <div className="livraisons-page"><h1>Chargement...</h1></div>;
  }

  return (
    <div className="livraisons-page">
      {/* Header ANCIEN */}
      <div className="page-header">
        <h1 className="page-title">Gestion des Colis & Livraisons ({livraisons.length})</h1>
        <button onClick={() => { setShowForm(true); setEditingLivraison(null); }} className="btn-add">
          <Plus size={22} />
          Nouvelle livraison
        </button>
      </div>

      {/* Tableau ANCIEN + Backend */}
      <div className="table-card">
        <div className="table-container">
          <table className="livraisons-table">
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Code-barres</th>
                <th>Client</th>
                <th>Adresse</th>
                <th>Statut</th>
                <th>Livreur assigné</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {livraisons.map((liv) => (
                <tr key={liv.id}>
                  <td><strong className="text-blue-600">{liv.id}</strong></td>
                  <td className="flex items-center gap-2 text-gray-600">
                    <Barcode size={18} />
                    <span className="font-medium">{liv.code}</span>
                  </td>
                  <td className="flex items-center gap-2 text-gray-700">
                    <User size={16} />
                    <span className="font-medium">{liv.client}</span>
                  </td>
                  <td className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{liv.adresse}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${liv.statut.toLowerCase().replace(" ", "_")}`}>
                      {liv.statut}
                    </span>
                  </td>
                  <td>
                    {liv.livreur ? (
                      <span className="font-semibold text-green-600">{liv.livreur}</span>
                    ) : (
                      <span className="text-gray-500 italic">Non assigné</span>
                    )}
                  </td>
                  <td className="actions">  {/* ✅ ICÔNES ANCIENNES */}
                    <button 
                      className="btn-view" 
                      title="Voir"
                      onClick={() => console.log("👁️ Voir", liv.id)}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="btn-edit" 
                      title="Modifier"
                      onClick={() => setEditingLivraison(liv)}
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULAIRE Backend */}
      {(showForm || editingLivraison) && (
        <LivraisonForm
          clients={clients}
          livreurs={livreurs.filter(l => l.statut === "Disponible")}
          onSave={editingLivraison ? handleEditLivraison : handleCreateLivraison}
          initialData={editingLivraison}
          onClose={() => {
            setShowForm(false);
            setEditingLivraison(null);
          }}
        />
      )}
    </div>
  );
};

export default LivraisonsPage;
