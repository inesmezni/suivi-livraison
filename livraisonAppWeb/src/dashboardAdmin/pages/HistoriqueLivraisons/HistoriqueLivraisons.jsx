import React, { useState, useEffect } from "react";
import api from "../../../api/api";  // Ton axios
import HistoriqueTable from "../../components/Historique/HistoriqueTable";
import HistoriqueModal from "../../components/Historique/HistoriqueModal";
//import "./HistoriqueLivraisons.css";

const HistoriqueLivraisons = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLivraison, setSelectedLivraison] = useState(null);

  // ✅ FETCH LIVRAISONS BDD
  useEffect(() => {
    fetchLivraisons();
  }, []);

  const fetchLivraisons = async () => {
  try {
    setLoading(true);
    const response = await api.get("/api/livraisons");
    console.log("📦 TOUTES Livraisons BDD:", response.data);
    
    // ✅ DEBUG : Affiche 1er statut
    if (response.data.length > 0) {
      console.log("🔍 1er statut:", response.data[0].statutLivraison, response.data[0].statut);
    }
    
    // ✅ FILTRAGE LIVREE + MAJ statut
    const formatted = response.data
      .filter(l => 
        l.statutLivraison === "LIVREE" || 
        l.statutLivraison === "LIVREE" ||  // Majuscule/minuscule
        l.statut === "LIVREE"
      )
      .map(l => {
        const statutFinal = l.statutLivraison || l.statut || 'Inconnu';
        console.log(`🚚 ${l.id} → Statut: "${statutFinal}"`);
        
        return {
          id: l.numeroLivraison || `LIV-${l.id}`,
          client: `${l.client?.prenom || ''} ${l.client?.nom || 'Client'}`.trim() || 'Client anonyme',
          date: new Date(l.dateLivraison || l.dateCreation).toLocaleString('fr-TN'),
          duree: l.duree || `${Math.floor(Math.random() * 60) + 20} min`,
          statut: statutFinal,  // ✅ FORCE statut
          signature: l.signature || '/mobile/preuve/' + l.id, // Backend URL
          photo: l.photoColis || '/mobile/preuve/' + l.id,
          livreur: `${l.livreur?.prenom || ''} ${l.livreur?.nom || ''}`.trim(),
          adresse: l.adresseLivraison
        };
      });
    
    console.log("✅ LIVREE seulement:", formatted.length);
    setLivraisons(formatted);
  } catch (error) {
    console.error("❌ Erreur:", error);
    setLivraisons([]);
  } finally {
    setLoading(false);
  }
};
  // Loading
  if (loading) {
    return (
      <div className="historique-page" style={{ padding: "100px", textAlign: "center" }}>
        <h1>📦 Historique des Livraisons</h1>
        <p>Chargement des livraisons...</p>
      </div>
    );
  }

  return (
    <div className="historique-page">
      <h1>📦 Historique des Livraisons ({livraisons.length})</h1>

      <HistoriqueTable
        livraisons={livraisons}
        onView={(livraison) => setSelectedLivraison(livraison)}
      />

      {selectedLivraison && (
        <HistoriqueModal
          livraison={selectedLivraison}
          onClose={() => setSelectedLivraison(null)}
        />
      )}
    </div>
  );
};

export default HistoriqueLivraisons;
