// DashboardSuivi.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker,Popup} from "react-leaflet";
import L from "leaflet";
import {
  MapPin, Truck, User, X, Star, Check, PenTool,
   Calendar, Clock
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./SuiviColis.css";
import api from "../api/api";
import Confirmation from './Confirmation'; 
import { geocodeAddress } from "../geocode";


// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icône livreur animée
const deliveryIcon = L.divIcon({
  html: `
    <div style="background:linear-gradient(135deg,#8b5cf6,#c084fc);width:56px;height:56px;border-radius:50%;display:grid;place-items:center;border:5px solid white;box-shadow:0 10px 30px rgba(139,92,246,0.6);animation:pulse 2s infinite">
      <svg width="32" height="32" fill="none" stroke="white" stroke-width="3"><path d="M3 17h18v-2l2-5-2-5H3l2 5v7z"/><circle cx="7" cy="17" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>
    </div>
    <style>@keyframes pulse{0%,100%{box-shadow:0 10px 30px rgba(139,92,246,0.6)}50%{box-shadow:0 10px 50px rgba(139,92,246,0.9)}}</style>
  `,
  iconSize: [56, 56],
  iconAnchor: [28, 56],
});



const DashboardSuivi = () => {
  const clientId = localStorage.getItem("userId");
  const [colisData, setColisData] = useState([]);

  const [selectedColis, setSelectedColis] = useState(null);
  const [colisToRate, setColisToRate] = useState(null);
  const [colisToConfirm, setColisToConfirm] = useState(null);
  const [colisDetails, setColisDetails] = useState(null);
 
  const [signature, setSignature] = useState("");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

  
useEffect(() => {
  if (!clientId) return;

  const fetchLivraisons = async () => {
    try {
      const res = await api.get(`/api/livraisons/client/${clientId}`);

      const mapped = res.data.map(l => ({
        id: l.id,
        number: l.codeBarre,
        status: l.statut === "LIVREE" ? "livré" : "en-cours",
        address: l.adresse,
        livreur_id: l.livreur?.id, 
        driver: l.livreur
          ? `${l.livreur.prenom} ${l.livreur.nom}`
          : "Non assigné",
        deliveredAt: l.dateLivraison,
        // champs UI facultatifs
        eta: l.statut === "LIVREE" ? "Livrée" : "En cours",
        isNear: false,
        position: [41.3, 2.1], // mock GPS temporaire
      }));

      setColisData(mapped);
    } catch (err) {
      console.error("Erreur récupération livraisons", err);
    }
  };

  fetchLivraisons();
}, [clientId]);

  // Signature canvas
  useEffect(() => {
    if (!colisToConfirm) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
  }, [colisToConfirm]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    canvas.getContext("2d").beginPath();
    canvas.getContext("2d").moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    canvas.getContext("2d").lineTo(x, y);
    canvas.getContext("2d").stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const dataUrl = canvasRef.current.toDataURL();
      setSignature(dataUrl);
    }
  };

  const clearSignature = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignature("");
  };

  const confirmDelivery = () => {

    if (!signature) return alert("Veuillez signer pour confirmer la réception");
    // Met à jour le colis comme livré avec signature
    const updatedColis = { ...colisToConfirm, status: "livré", deliveredAt: new Date().toLocaleString("fr-FR"), signature };
    //colisData[colisData.findIndex(c => c.id === colisToConfirm.id)] = updatedColis;
    setColisData(prev => prev.map(c => c.id === colisToConfirm.id ? updatedColis : c));
    console.log("Livraison confirmée !", updatedColis);
    setColisToConfirm(null);
    setShowEvaluation(true);
    alert("Livraison confirmée avec succès !");
  };
const handleFollowMap = async (colis) => {
  try {
    const res = await api.get(`/api/livraisons/${colis.id}/tracking`);
    const { livreurLat, livreurLng, adresseClient } = res.data;
    
    console.log("📍 Backend:", { livreurLat, livreurLng, adresseClient });

    // ✅ FIX : fallback UNIQUEMENT si les DEUX sont invalides
    const livreurPos = (livreurLat > 0 && livreurLng !== 0 && !isNaN(livreurLat) && !isNaN(livreurLng))
      ? [Number(livreurLat), Number(livreurLng)]  // Force number
      : [36.8065, 10.1815];

    // Destination
    let destPos = [36.8065, 10.1815];
    if (adresseClient) {
      destPos = await geocodeAddress(adresseClient);
    }

    // Debug FINAL
    console.log("🗺️ FINAL:", { livreurPos, destPos });
    // Calcul distance
    function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
      const R = 6371000; // m
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 +
                Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                Math.sin(dLon/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }
    const distance = getDistanceFromLatLonInMeters(livreurPos[0], livreurPos[1], destPos[0], destPos[1]);

    const updatedColis = {
      ...colis,
      position: livreurPos,
      positionDest: destPos,
      distance,
      eta: `${Math.ceil(distance / 250)} min`,
      isNear: distance < 50  // 19m < 50m = true ✅
    };

    // 1. Met à jour selectedColis (modal)
    setSelectedColis(updatedColis);

    // 2. Met à jour colisData (liste des cartes)
    setColisData(prev => 
      prev.map(c => c.id === colis.id ? updatedColis : c)
    );

    console.log("✅ colis.isNear =", updatedColis.isNear, "distance =", Math.round(distance));

  } catch (err) {
    console.error("❌ Erreur:", err);
  }
};


// Suivi automatique toutes les 15 secondes
useEffect(() => {
  if (!selectedColis) return;

  const interval = setInterval(() => {
    handleFollowMap(selectedColis);
  }, 15000); // toutes les 15 secondes

  return () => clearInterval(interval);
}, [selectedColis]);



  return (
    <>
      <div className="dashboard-suivi">

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-title">En cours</div><div className="stat-number">{colisData.filter(c => c.status === "en-cours").length}</div><div className="stat-subtitle">Livraisons actives</div><div className="stat-icon blue"><Truck size={28} /></div></div>
          <div className="stat-card"><div className="stat-title">Total</div><div className="stat-number">{colisData.length}</div><div className="stat-subtitle">Colis suivis</div><div className="stat-icon purple"><Truck size={28} /></div></div>
          <div className="stat-card"><div className="stat-title">Livrés</div><div className="stat-number">{colisData.filter(c => c.status === "livré").length}</div><div className="stat-subtitle">Livraisons complétées</div><div className="stat-icon green"><Truck size={28} /></div></div>
        </div>

        <div className="filters">
          <h2>Mes livraisons</h2>
          <div className="filter-buttons">
            <button className="filter-btn active">Tous</button>
            <button className="filter-btn">En cours</button>
            <button className="filter-btn">Livrés</button>
          </div>
        </div>

        <div className="colis-grid">
          {colisData.map((colis) => (
            <div key={colis.id} className={`colis-card ${colis.status}`}>
              <div className="card-top">
                <span className={`status-tag ${colis.status === "livré" ? "green" : "blue"}`}>
                  {colis.status === "livré" ? "LIVRÉ" : "EN COURS"}
                </span>
                {colis.status === "livré" && (
                  <button className="rating-star-btn" onClick={(e) => { e.stopPropagation(); setColisToRate(colis); }}>
                    <Star size={36} color="#e9ecef" strokeWidth={2} />
                  </button>
                )}
              </div>

              <div className="tracking-id">N° de suivi <strong>{colis.number}</strong></div>
              <div className="address-item"><MapPin size={18} /> <div>{colis.address}</div></div>
              <div className="eta-time">{colis.eta}</div>

              {colis.status === "en-cours" && colis.isNear && (
                <button className="track-btn confirm-btn" onClick={(e) => { e.stopPropagation(); setColisToConfirm(colis); }}>
                  <Check size={24} /> Confirmer la réception
                </button>
              )}

              {colis.status === "en-cours" && !colis.isNear && (
                <button className="track-btn" onClick={(e) => { e.stopPropagation(); handleFollowMap(colis); }}>
                  Suivre sur la carte
                </button>

              )}

              {colis.status === "livré" && (
                <button className="track-btn purple" onClick={(e) => { e.stopPropagation(); setColisDetails(colis); }}>
                  Voir les détails
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Suivi GPS */}
{selectedColis && (
  <div className="live-tracking-modal">
    <div className="modal-overlay" onClick={() => setSelectedColis(null)}></div>
    <div className="modal-content-new">
      <div className="modal-header-new">
        <div>
          <h2>Suivi en temps réel</h2>
          <div className="tracking-number-new">{selectedColis.number}</div>
        </div>
        <button className="close-btn-new" onClick={() => setSelectedColis(null)}>
          <X size={28} />
        </button>
      </div>

      <div className="driver-section-new">
        <div className="driver-avatar-new"><User size={32} /></div>
        <div className="driver-info-new">
          <strong>{selectedColis.driver}</strong>
          <div>Votre livreur</div>
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card distance">
          <Truck size={20} />
          <div>
            <div>Distance restante</div>
            <strong>{selectedColis.distance ? `${Math.round(selectedColis.distance)} m` : "–"}</strong>
          </div>
        </div>
        <div className="info-card time">
          <Truck size={20} />
          <div>
            <div>Temps estimé</div>
            <strong>{selectedColis.eta || "–"}</strong>
          </div>
        </div>
      </div>
    
    <div className="real-map-container" style={{ height: "400px", width: "100%" }}>
  <MapContainer
    center={selectedColis?.position || [36.8065, 10.1815]}
    zoom={13}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    
    
    {selectedColis?.position && (
      <CircleMarker
        center={selectedColis.position}
        radius={15}
        color="#8b5cf6"
        fillColor="#8b5cf6"
        fillOpacity={0.9}
        weight={4}
      >
        <Popup>🚚 Livreur ici ({selectedColis.position.join(', ')})</Popup>
      </CircleMarker>
    )}
    
    
    {selectedColis?.positionDest && (
      <CircleMarker
        center={selectedColis.positionDest}
        radius={12}
        color="#ef4444"
        fillColor="#ef4444"
        fillOpacity={0.9}
        weight={3}
      >
        <Popup>🏠 Destination ({selectedColis.positionDest.join(', ')})</Popup>
      </CircleMarker>
    )}
  </MapContainer>
</div>


      {/*<div className="real-map-container" style={{ height: "400px", width: "100%" }}>
  <MapContainer
    key={mapKey}
    center={selectedColis.position || [36.8065, 10.1815]}
    zoom={12}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    
    // LIVREUR - SIMPLE ICON ROUGE 
    {selectedColis.position && (
      <Marker 
        position={selectedColis.position}
        title="Livreur"
      />
    )}
    
    //CLIENT - SIMPLE ICON BLEU 
    {selectedColis.positionDest && (
      <Marker 
        position={selectedColis.positionDest}
        title="Destination"
      />
    )}
  </MapContainer>
</div>*/}

    </div>
  </div>
)}


      {/* Modal Confirmation + Signature */}
      {colisToConfirm && (
        <div className="live-tracking-modal">
          <div className="modal-overlay" onClick={() => setColisToConfirm(null)}></div>
          <div className="signature-modal-content">
            <div className="signature-header">
              <Check size={28} color="white" />
              <div>
                <h3>Confirmer la réception</h3>
                <p>{colisToConfirm.number} • {colisToConfirm.address}</p>
              </div>
              <button className="close-btn-new" onClick={() => setColisToConfirm(null)}><X size={28} /></button>
            </div>
            <div className="signature-body">
              <div className="driver-info">
                <div className="driver-avatar"><User size={40} /></div>
                <div><strong>{colisToConfirm.driver}</strong><div>votre livreur</div></div>
              </div>
              <div className="signature-section">
                <h4><PenTool size={20} /> Signez pour confirmer la réception</h4>
                <canvas ref={canvasRef} width={380} height={180} className="signature-canvas"
                  onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                />
                <div className="signature-actions">
                  <button onClick={clearSignature}>Effacer</button>
                  <span>{signature ? "Signature validée" : "Signez dans le cadre"}</span>
                </div>
              </div>
              <div className="confirmation-buttons">
                <button onClick={() => setColisToConfirm(null)} className="cancel-btn">Annuler</button>
                <button onClick={confirmDelivery} className="confirm-final-btn" disabled={!signature}>
                  Confirmer la livraison
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     {showEvaluation && (
        <div className="live-tracking-modal">
          <div className="modal-overlay" onClick={() => setShowEvaluation(false)}></div>
          <div className="rating-modal-content">
            <Confirmation 
              livraisonId={colisToConfirm?.id || 0} 
              onClose={() => setShowEvaluation(false)}
            />
          </div>
        </div>
      )}


      {/* Modal Détails Livraison */}
      {colisDetails && (
        <div className="live-tracking-modal">
          <div className="modal-overlay" onClick={() => setColisDetails(null)}></div>
          <div className="details-modal-content">
            <div className="details-header">
              <Check size={32} color="white" />
              <div>
                <h2>Livraison effectuée</h2>
                <p>{colisDetails.number}</p>
              </div>
              <button className="close-btn-new" onClick={() => setColisDetails(null)}><X size={28} /></button>
            </div>
            <div className="details-body">
              <div className="detail-item">
                <Calendar size={20} color="#10b981" />
                <div>
                  <strong>Date de livraison</strong>
                  <p>{colisDetails.deliveredAt || "Non disponible"}</p>
                </div>
              </div>
              <div className="detail-item">
                <Clock size={20} color="#8b5cf6" />
                <div>
                  <strong>Heure</strong>
                  <p>{colisDetails.deliveredAt?.split("à")[1] || "-"}</p>
                </div>
              </div>
              <div className="detail-item">
                <MapPin size={20} color="#8b5cf6" />
                <div>
                  <strong>Adresse</strong>
                  <p>{colisDetails.address}</p>
                </div>
              </div>
              <div className="detail-item">
                <User size={20} color="#7c3aed" />
                <div>
                  <strong>Livreur</strong>
                  <p>{colisDetails.driver}</p>
                </div>
              </div>
              <div className="detail-item signature-item">
                <PenTool size={20} color="#1e293b" />
                <div>
                  <strong>Signature du client</strong>
                  {colisDetails.signature ? (
                    <img src={colisDetails.signature} alt="Signature" className="signature-preview" />
                  ) : (
                    <div className="no-signature">Aucune signature enregistrée</div>
                  )}
                </div>
              </div>
              <div className="details-footer">
                <button className="rate-again-btn" onClick={() => { setColisToRate(colisDetails); setColisDetails(null); }}>
                  <Star size={20} /> Noter le livreur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardSuivi;