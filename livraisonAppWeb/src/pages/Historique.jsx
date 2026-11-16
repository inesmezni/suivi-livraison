import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Historique.css";

const HistoriqueLivraisons = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, week, month
  const navigate = useNavigate();
  const clientId = localStorage.getItem("userId");

  // ✅ FETCH TOUTES LIVRAISONS clientId
  useEffect(() => {
    if (!clientId) return;
    
    const fetchLivraisons = async () => {
  try {
    setLoading(true);
    const response = await api.get(`/api/livraisons/client/${clientId}`);
    const data = response.data;
    
    // ✅ FILTRER LIVRÉES UNIQUEMENT
    const livraisonsLivrees = data.filter(livraison => 
      livraison.statut === "LIVREE" || 
      livraison.statut === "livree" ||
      livraison.statut === "LIVRÉE"
    );
    
    console.log("📦 Historique LIVRÉES:", livraisonsLivrees);
    setLivraisons(livraisonsLivrees);  // ✅ UNIQUEMENT LIVRÉES
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    setLoading(false);
  }
};


    fetchLivraisons();
  }, [clientId]);

  // Filtre + recherche
  const filteredLivraisons = livraisons
    .filter(livraison => {
      if (filter === "week") {
        const uneSemaine = 7 * 24 * 60 * 60 * 1000;
        const dateLivraison = new Date(livraison.dateLivraison);
        return Date.now() - dateLivraison < uneSemaine;
      }
      if (filter === "month") {
        const unMois = 30 * 24 * 60 * 60 * 1000;
        const dateLivraison = new Date(livraison.dateLivraison);
        return Date.now() - dateLivraison < unMois;
      }
      return true;
    })
    .filter(livraison =>
      livraison.codeBarre.toLowerCase().includes(search.toLowerCase()) ||
      livraison.adresse.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="history-page">
        <div style={{ padding: "100px", textAlign: "center" }}>
          Chargement de l'historique...
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* HEADER */}
      <header className="history-header">
        <button className="history-back" onClick={() => navigate(-1)}>
          ←
        </button>
        <div>
          <h1 className="history-title">Historique des livraisons</h1>
          <p className="history-subtitle">
            {filteredLivraisons.length} livraison{livraisons.length !== 1 ? 's' : ''} trouvée{livraisons.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      {/* BARRE RECHERCHE + FILTRES */}
      <div className="history-filters">
        <div className="history-search">
          <span className="history-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher code barre, adresse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="history-chips">
          <button 
            className={`chip ${filter === "all" ? "chip-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tout
          </button>
          <button 
            className={`chip ${filter === "week" ? "chip-active" : ""}`}
            onClick={() => setFilter("week")}
          >
            Cette semaine
          </button>
          <button 
            className={`chip ${filter === "month" ? "chip-active" : ""}`}
            onClick={() => setFilter("month")}
          >
            Ce mois
          </button>
        </div>
      </div>

      {/* LISTE DES COLIS */}
      <div className="history-list">
        {filteredLivraisons.length > 0 ? (
          filteredLivraisons.map((livraison) => (
            <div key={livraison.id} className="delivery-card">
              <div className="delivery-left">
                <div className="delivery-status-icon">
                  <span>✔</span>
                </div>

                <div>
                  <div className="delivery-id-row">
                    <span className="delivery-id">{livraison.codeBarre}</span>
                    <span className="delivery-status-pill">
                      {livraison.statut === "LIVREE" ? "Livré" : livraison.statut}
                    </span>
                  </div>

                  <div className="delivery-main-info">
                    <div className="delivery-line">
                      <span className="delivery-icon">📍</span>
                      <span>{livraison.adresse}</span>
                    </div>
                    <div className="delivery-line">
                      <span className="delivery-icon">📅</span>
                      <span>
                        {livraison.dateLivraison 
                          ? `Livré le ${new Date(livraison.dateLivraison).toLocaleDateString('fr-FR')} à ${new Date(livraison.dateLivraison).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                          : "Date indisponible"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="delivery-meta">
                <div className="delivery-meta-block">
                  <span className="meta-label">Livreur</span>
                  <span className="meta-value">
                    {livraison.livreur?.prenom} {livraison.livreur?.nom}
                  </span>
                </div>
                <div className="delivery-meta-block">
                  <span className="meta-label">Confirmation</span>
                  <span className="meta-value">
                    Signature électronique
                  </span>
                </div>
                <div className="delivery-meta-block delivery-meta-action">
                  <span className="meta-label">Actions</span>
                  <button className="details-link">
                    Voir les détails →
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Aucune livraison trouvée</h3>
            <p>Essayez de modifier vos filtres ou de rechercher autrement</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoriqueLivraisons;
