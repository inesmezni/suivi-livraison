import React, { useState, useEffect } from "react";
import { Star, Phone, Truck, MessageCircle } from "lucide-react";
import api from "../../../api/api";

const LivreursDetails = ({ livreur, vehicule }) => {
  const [profilEval, setProfilEval] = useState(null);
  const [loadingAvis, setLoadingAvis] = useState(true);

  // ✅ NOUVELLE API /mobile/evaluation/profil/{id}
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoadingAvis(true);
        console.log("🔍 FETCH profil livreur", livreur.id);
        
        const response = await api.get(`/mobile/evaluation/profil/${livreur.id}`);
        console.log("📊 Profil eval livreur", livreur.id, ":", response.data);
        
        setProfilEval(response.data);
      } catch (error) {
        console.error("❌ Erreur profil:", error);
        setProfilEval(null);
      } finally {
        setLoadingAvis(false);
      }
    };

    if (livreur?.id) {
      fetchProfil();
    }
  }, [livreur.id]);

  const getStatusClass = (statut) => {
    if (statut === "Disponible") return "disponible";
    if (statut === "En livraison") return "en-livraison";
    return "indisponible";
  };

  // ✅ Utilise données profilEval
  const avisClients = profilEval?.evaluations || [];
  const moyenne = profilEval?.moyenne || "—";
  const nombreAvis = profilEval?.nombreEvaluations || 0;

  return (
    <div className="livreur-details-simple">
      {/* Header */}
      <div className="details-header">
        <div className="avatar">
          {livreur.prenom[0]}{livreur.nom[0]}
        </div>
        <h2>{livreur.prenom} {livreur.nom}</h2>
        <span className={`status-badge ${getStatusClass(livreur.statut)}`}>
          {livreur.statut}
        </span>
      </div>

      {/* Infos rapides */}
      <div className="info-grid">
        <div className="info-item">
          <Phone size={18} />
          <div>
            <strong>Téléphone</strong>
            <p>{livreur.telephone}</p>
          </div>
        </div>

        <div className="info-item">
          <Truck size={18} />
          <div>
            <strong>Véhicule</strong>
            <p>{livreur.vehicleInfo || "—"}<br />
              <small>{livreur.typeVehicule || "—"}</small>
            </p>
          </div>
        </div>

        <div className="info-item note-item">
          <Star size={28} fill="#fbbf24" stroke="#fbbf24" />
          <div>
            <strong>Note moyenne</strong>
            <p className="big-note">
              {moyenne !== "—" ? moyenne : "—"} / 5.0
              <span className="avis-count">({nombreAvis} avis)</span>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ AVIS DU PROFIL */}
      <div className="avis-section">
        <h3><MessageCircle size={19} /> Avis des clients ({nombreAvis})</h3>
        {loadingAvis ? (
          <p>Chargement des avis...</p>
        ) : nombreAvis > 0 ? (
          <div className="avis-list">
            {avisClients.map((avis) => (
              <div key={avis.id} className="avis-card">
                <div className="avis-header">
                  <strong>{avis.nomClient}</strong>
                  <div className="stars">
                    {"★".repeat(avis.note)}{"☆".repeat(5 - avis.note)}
                  </div>
                </div>
                <p className="avis-text">"{avis.commentaire}"</p>
                <small>{new Date(avis.dateEvaluation).toLocaleDateString('fr-TN')}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-avis">Aucun avis pour ce livreur</p>
        )}
      </div>
    </div>
  );
};

export default LivreursDetails;
