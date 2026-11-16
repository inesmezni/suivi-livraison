import React , { useState, useEffect ,useRef} from "react";
import "./Historique.css";
import api from "../../../api/api"; 

const HistoriqueModal = ({ livraison, onClose }) => {
   const [preuveImages, setPreuveImages] = useState({
    signature: null,
    photo: null
  });
  const [loadingImages, setLoadingImages] = useState(true);
  const imageUrlsRef = useRef([]);
// ✅ FETCH BLOB → URL objet
 useEffect(() => {
  const fetchPreuves = async () => {
  if (!livraison.id) return;
  
  // ✅ EXTRAIT NUMÉRO livraison.id = "LIV-1" → 1
  const idLivraison = livraison.id.replace(/[^0-9]/g, '');
  console.log("🔍 ID utilisé:", idLivraison); // DEBUG
  
  try {
    setLoadingImages(true);
    
    const preuveResponse = await api.get(`/mobile/preuve/${idLivraison}`, {
      responseType: 'blob'
    });
    
    const imageUrl = URL.createObjectURL(preuveResponse.data);
    console.log("✅ Image chargée !"); // DEBUG
    
    setPreuveImages({
      signature: imageUrl,
      photo: imageUrl
    });
  } catch (error) {
    console.error("❌ Preuve ERROR:", error.response?.status, error.response?.data);
  } finally {
    setLoadingImages(false);
  }
};


  fetchPreuves();
  // ❌ SUPPRIME cleanup = Images visibles !
}, [livraison.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="livraison-details-simple" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="details-header">
          <div className="avatar livraison-avatar">
            📦
          </div>
          <h2>Détails Livraison</h2>
          <span className={`status-badge ${livraison.statut === 'Livrée' ? 'livree' : 'en-cours'}`}>
            {livraison.statut}
          </span>
        </div>

        {/* Infos grille */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">👤</div>
            <div>
              <strong>Client</strong>
              <p>{livraison.client}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📅</div>
            <div>
              <strong>Date</strong>
              <p>{livraison.date}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">⏱️</div>
            <div>
              <strong>Durée</strong>
              <p>{livraison.duree}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">🚚</div>
            <div>
              <strong>Livreur</strong>
              <p>{livraison.livreur || "—"}</p>
            </div>
          </div>

          {livraison.adresse && (
            <div className="info-item note-item">
              <div className="info-icon">📍</div>
              <div>
                <strong>Adresse</strong>
                <p>{livraison.adresse}</p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ PREUVES avec BLOB */}
        <div className="preuves-section">
          <h3>📸 Preuves de livraison</h3>
          <div className="preuves-grid">
            <div className="preuve-card">
              <div className="preuve-icon">📝</div>
              <h4>Signature Client</h4>
              <div className="image-container">
                {loadingImages ? (
                  <div>Chargement...</div>
                ) : preuveImages.signature ? (
                  <img src={preuveImages.signature} alt="Signature" />
                ) : (
                  <div>Pas de signature</div>
                )}
              </div>
            </div>

            <div className="preuve-card">
              <div className="preuve-icon">📦</div>
              <h4>Photo Colis</h4>
              <div className="image-container">
                {loadingImages ? (
                  <div>Chargement...</div>
                ) : preuveImages.photo ? (
                  <img src={preuveImages.photo} alt="Colis" />
                ) : (
                  <div>Pas de photo</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>
            ✕ Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueModal;
