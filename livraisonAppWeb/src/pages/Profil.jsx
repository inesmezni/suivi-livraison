import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Package, TrendingUp, Award, Bell, ChevronRight, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Profil.css";

const Profil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    dateCreation: null,
    avatar: null,
  });
  const [stats, setStats] = useState({
    totalLivraisons: 0,
    enCours: 0,
    points: 1250 // Mock pour l'instant
  });

  const clientId = localStorage.getItem("userId");

// ✅ STATS REELLES avec TON API
useEffect(() => {
  if (!clientId) return;
  
  const fetchProfileAndStats = async () => {
    try {
      setLoading(true);
      
      // 1. Profil
      const profileRes = await api.get(`/api/clients/${clientId}`);
      const profileData = profileRes.data;
      setProfile({
        nom: profileData.nom || "",
        prenom: profileData.prenom || "",
        email: profileData.email || "",
        telephone: profileData.telephone || "",
        adresse: profileData.adresse || "",
        dateCreation: profileData.dateCreation,
        avatar: null
      });
      
      // 2. ✅ STATS LIVRAISONS (TON API !)
      const livraisonsRes = await api.get(`/api/livraisons/client/${clientId}`);
      const livraisons = livraisonsRes.data;
      
      const totalLivraisons = livraisons.length;
      const enCours = livraisons.filter(l => 
        l.statut === "EN_COURS" || l.statut === "en-cours"
      ).length;
      
      setStats({
        totalLivraisons,
        enCours,
        points: 1250 // Mock (ajoute table fidélité plus tard)
      });
      
      console.log("📊 Stats calculées:", { totalLivraisons, enCours });
      
    } catch (error) {
      console.error("❌ Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfileAndStats();
}, [clientId]);


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // ✅ Prépare data pour ton backend
      const updateData = {
        id: parseInt(clientId),
        nom: profile.nom,
        prenom: profile.prenom,
        email: profile.email,
        telephone: profile.telephone,
        adresse: profile.adresse,
        // motDePasse inchangé
        
      };

      console.log("📤 UPDATE:", updateData);
      
      // ✅ Utilise PUT si dispo, sinon PATCH ou POST
      await api.post(`/api/clients`, updateData);
      
      alert("✅ Profil mis à jour !");
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Erreur save:", error);
      alert("❌ Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ padding: "50px", textAlign: "center" }}>
          Chargement du profil...
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      {/* HEADER */}
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <div>
          <h1 className="profile-title">Mon Profil</h1>
          <p className="profile-subtitle">Gérez vos informations personnelles</p>
        </div>
      </header>

      {/* CARD PRINCIPALE + STATS */}
      <div className="main-container">
        <section className="profile-card">
          <div className="profile-left">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="avatar-img" />
              ) : (
                <User size={60} color="white" />
              )}
            </div>

            <div className="profile-info">
              <h2>{profile.prenom} {profile.nom}</h2>
              <p className="member-since">
                Membre depuis {profile.dateCreation ? 
                  new Date(profile.dateCreation).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 
                  "2024"
                }
              </p>
              <span className="badge-premium">Client Premium</span>

              <button 
                className="edit-btn" 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={saving}
              >
                <Edit3 size={18} />
                {saving ? "Sauvegarde..." : (isEditing ? "Enregistrer" : "Modifier")}
              </button>
            </div>
          </div>
        </section>

        <div className="stats-sidebar">
          <div className="stat-item">
            <div className="stat-icon blue"><Package size={24} /></div>
            <div><p>Total livraisons</p><h3>{stats.totalLivraisons}</h3></div>
          </div>
          <div className="stat-item">
            <div className="stat-icon purple"><TrendingUp size={24} /></div>
            <div><p>En cours</p><h3>{stats.enCours}</h3></div>
          </div>
          <div className="stat-item">
            <div className="stat-icon orange"><Award size={24} /></div>
            <div><p>Points fidélité</p><h3>{stats.points}</h3></div>
          </div>
        </div>
      </div>

      {/* Infos modifiables */}
      <section className="info-section">
        <div className="info-card">
          <Mail size={20} className="info-icon pink" />
          <div className="info-content">
            <p className="info-label">Email</p>
            {isEditing ? (
              <input 
                type="email" 
                name="email" 
                value={profile.email} 
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p className="info-value">{profile.email}</p>
            )}
          </div>
        </div>

        <div className="info-card">
          <Phone size={20} className="info-icon blue" />
          <div className="info-content">
            <p className="info-label">Téléphone</p>
            {isEditing ? (
              <input 
                type="tel" 
                name="telephone" 
                value={profile.telephone} 
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p className="info-value">{profile.telephone}</p>
            )}
          </div>
        </div>

        <div className="info-card full">
          <MapPin size={20} className="info-icon green" />
          <div className="info-content">
            <p className="info-label">Adresse principale</p>
            {isEditing ? (
              <input 
                type="text" 
                name="adresse" 
                value={profile.adresse} 
                onChange={handleChange}
                className="edit-input full"
              />
            ) : (
              <p className="info-value">{profile.adresse}</p>
            )}
          </div>
        </div>

        {/*{isEditing && (
          <div className="avatar-upload">
            <label>Changer la photo de profil</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        )}*/}
      </section>

      {/* Paramètres */}
      <section className="settings-section">
        <h2 className="section-title">Paramètres</h2>
        <div className="settings-item">
          <Bell size={22} className="settings-icon purple2" />
          <span>Notifications</span>
          <ChevronRight size={22} className="arrow" />
        </div>
      </section>
    </div>
  );
};

export default Profil;
