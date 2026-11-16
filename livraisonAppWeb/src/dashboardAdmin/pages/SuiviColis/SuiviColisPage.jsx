import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import api from "../../../api/api"; 
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SuiviColis.css";

/* FIX icônes Leaflet */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Icônes */
const livreurIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
  iconSize: [30, 30],
});

const colisIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3179/3179068.png",
  iconSize: [30, 30],
});

/* Bouton Recentrer */
function RecenterButton({ center }) {
  const map = useMap();
  return (
    <button className="map-btn" onClick={() => map.setView(center, 13)}>
      Recentrer
    </button>
  );
}

const SuiviColisPage = () => {
  const center = [36.8065, 10.1815];

  const [livreurs, setLivreurs] = useState([]);
  const [colis, setColis] = useState([]);

useEffect(() => {
  let mounted = true;
  const fetchPositions = async () => {
    try {
      const { data } = await api.get("/api/positions/all-latest");
      if (!mounted) return;

      const livreursMapped = data
        .filter(lp => lp.latitude != null && lp.longitude != null) // garder seulement ceux avec coords
        .map(lp => ({
          id: lp.livreurId,
          name: lp.nom,
          lat: lp.latitude,
          lng: lp.longitude,
          date: lp.dateHeure
        }));

      // option : gérer livreurs sans position si vous voulez les afficher comme "offline"
      const offline = data
        .filter(lp => lp.latitude == null || lp.longitude == null)
        .map(lp => ({ id: lp.livreurId, name: lp.nom, offline: true }));

      setLivreurs(livreursMapped);
      // si vous voulez afficher offline séparément : setOfflineLivreurs(offline);
    } catch (err) {
      console.error("Erreur récupération positions:", err);
      // fallback local si nécessaire (déjà présent dans votre code)
    }
  };

  fetchPositions();                           // fetch initial
  const iv = setInterval(fetchPositions, 5000); // refresh toutes les 5s

  return () => {
    mounted = false;
    clearInterval(iv);
  };
}, []); // ou ajouter des dépendances si nécessaire

  return (
    <div className="suivi-colis-page">
      <h1 className="page-title">Suivi des colis</h1>

      <div className="map-container">
        <MapContainer center={center} zoom={13}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {livreurs.map((l, i) => (
            <Marker key={i} position={[l.lat, l.lng]} icon={livreurIcon}>
              <Popup>{l.name}</Popup>
            </Marker>
          ))}

          {colis.map((c, i) => (
            <Marker key={i} position={[c.lat, c.lng]} icon={colisIcon}>
              <Popup>{c.description}</Popup>
            </Marker>
          ))}

          <RecenterButton center={center} />
        </MapContainer>
      </div>
    </div>
  );
};

export default SuiviColisPage;
