import React, { useState, useEffect } from "react";
import { Plus, Bell } from "lucide-react";
import api from "../../../api/api";
import NotificationForm from "../../components/Notifications/NotificationForm";
import NotificationsTable from "../../components/Notifications/NotificationsTable";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [clients, setClients] = useState([]);   
  const [livreurs, setLivreurs] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const [notifRes, clientRes, livreurRes] = await Promise.all([
        api.get("/api/notifications"),
        api.get("/api/clients").catch(() => ({ data: [] })),
        api.get("/api/livreurs").catch(() => ({ data: [] }))
      ]);
      setClients(clientRes.data.map(c => ({
        id: c.id,
        nom: `${c.prenom} ${c.nom}`.trim()
      })));
      
      setLivreurs(livreurRes.data.map(l => ({
        id: l.id,
        nom: `${l.prenom} ${l.nom}`.trim()
      })));
      
      // Format pour frontend
      const formatted = notifRes.data.map(n => ({
        id: n.id,
        cible: n.destinataire === "LIVREUR" ? "Livreur" : "Client",
        titre: n.titre || "Notification",
        message: n.message,
        date: new Date(n.dateEnvoi).toLocaleString('fr-TN'),
        type: n.type,
        rawData: n
      }));
      
      setNotifications(formatted);
    } catch (error) {
      console.error("❌ Fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ENVOYER notification
 const handleSend = async (notification) => {
  try {
    const userId = notification.livreurId || notification.clientId;
    console.log("🔍 USER ID:", userId); // DEBUG
    
    const payload = {
      destinataire: notification.cible === "Livreur" ? "LIVREUR" : "CLIENT",
      titre: notification.titre,
      message: notification.message,
      userId: userId ? parseInt(userId) : null,  
      type: notification.cible.toUpperCase()
    };
    
    console.log("📤 FINAL:", payload);
    const response = await api.post("/api/notifications", payload);
    console.log("✅ OK:", response.data);
    
    fetchNotifications();
    setShowForm(false);
  } catch (error) {
    console.error("❌ ERROR:", error.response?.data);
  }
};


  if (loading) {
    return <div className="notifications-page"><h1>Chargement...</h1></div>;
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1><Bell size={24} /> Gestion des Notifications ({notifications.length})</h1>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          <Plus size={20} /> Nouvelle notification
        </button>
      </div>

      <NotificationsTable notifications={notifications} />

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <NotificationForm onSend={handleSend}
            clients={clients}      
            livreurs={livreurs} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
