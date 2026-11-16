import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Notifications.css";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const clientId = localStorage.getItem("userId");

  // ✅ FETCH NOTIFICATIONS CLIENT
  const fetchNotifications = async () => {
    if (!clientId) return;
    
    try {
      setLoading(true);
    
      const response = await api.get(`/api/notifications/client/${clientId}`);
      const data = response.data || [];
      
      console.log("🔔 Notifications BDD:", data);
      
      const formatted = data.map(n => ({
        id: n.id,
        type: n.type || "info",
        title: n.message.split('.')[0], // 1ère phrase = titre
        text: n.message,
        time: formatTimeAgo(new Date(n.dateEnvoi)),
        read: n.lue,
        destinataire: n.destinataire
      }));
      
      setNotifications(formatted);
    } catch (error) {
      console.error("❌ Notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Format temps relatif
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    return `Il y a ${Math.floor(diffH/24)}j`;
  };

  useEffect(() => {
    fetchNotifications();
  }, [clientId]);

  // ✅ MARQUER LU
  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/lire`); // Si existe
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      // Fallback frontend
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  // ✅ DELETE BACKEND
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("❌ Delete:", error);
    }
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    unreadIds.forEach(id => handleMarkAsRead(id));
  };

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  const renderIcon = (type) => {
    const icons = {
      truck: "🚚", parcel: "📦", check: "✅", 
      info: "ℹ️", warning: "⚠️"
    };
    return icons[type] || "🔔";
  };

  const Card = ({ note }) => (
    <div className={`notif-card ${!note.read ? "notif-card-unread" : ""}`}>
      <div className="notif-icon-wrapper">
        <span className={`notif-icon notif-icon-${note.type}`}>
          {renderIcon(note.type)}
        </span>
      </div>
      <div className="notif-content">
        <h3 className="notif-title">{note.title}</h3>
        <p className="notif-text">{note.text}</p>
        <span className="notif-time">{note.time}</span>
      </div>
      <div className="notif-actions">
        {!note.read && (
          <button
            className="notif-mark-read"
            onClick={() => handleMarkAsRead(note.id)}
          >
            Marquer comme lu
          </button>
        )}
        <button
          className="notif-trash"
          onClick={() => handleDelete(note.id)}
          aria-label="Supprimer"
        >
          🗑
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="notif-page">
        <header className="notif-header">
          <button className="notif-back" onClick={() => navigate(-1)}>&larr;</button>
          <div>
            <h1 className="notif-title-main">Notifications</h1>
            <span className="notif-subtitle">Chargement...</span>
          </div>
        </header>
        <div style={{ padding: "50px", textAlign: "center" }}>
          Chargement des notifications...
        </div>
      </div>
    );
  }
return (
  <div className="notif-page">
    <header className="notif-header">
      <button className="notif-back" onClick={() => navigate(-1)}>
        &larr;
      </button>
      <div>
        <h1 className="notif-title-main">Notifications</h1>
        <span className="notif-subtitle">
          {notifications.length} total ({unread.length} non lu{unread.length !== 1 ? 'es' : 'e'})
        </span>
      </div>
      {unread.length > 0 && (
        <button className="notif-mark-all" onClick={handleMarkAllAsRead}>
          Tout marquer comme lu
        </button>
      )}
    </header>

    {/* ✅ TOUTES LES NOTIFICATIONS (lues + non lues) */}
    <section className="notif-section">
      <div className="notif-tabs">
        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveTab('all')}>
          Toutes ({notifications.length})
        </button>
        <button className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`} 
                onClick={() => setActiveTab('unread')}>
          Non lues ({unread.length})
        </button>
        <button className={`tab-btn ${activeTab === 'read' ? 'active' : ''}`} 
                onClick={() => setActiveTab('read')}>
          Lues ({read.length})
        </button>
      </div>

      {/* ✅ AFFICHAGE SELON ONGLETS */}
      {activeTab === 'all' && notifications.map(n => <Card key={n.id} note={n} />)}
      {activeTab === 'unread' && unread.length > 0 ? (
        unread.map(n => <Card key={n.id} note={n} />)
      ) : activeTab === 'unread' ? (
        <p className="notif-empty">Aucune notification non lue.</p>
      ) : null}
      
      {activeTab === 'read' && read.length > 0 ? (
        read.map(n => <Card key={n.id} note={n} />)
      ) : activeTab === 'read' ? (
        <p className="notif-empty">Aucune notification lue.</p>
      ) : null}
    </section>
  </div>
);

};

export default Notifications;
