import React, { useState, useEffect } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const NavbarAdmin = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ UNIQUEMENT localStorage (sauvegardé après POST /api/auth/login)
  useEffect(() => {
    const fetchAdminData = () => {
      try {
        console.log("🔍 Vérification localStorage...");
        
        const userData = localStorage.getItem("user");
        console.log("📦 userData:", userData);
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log("✅ Admin trouvé:", user);
          
          setAdminData({
            nom: user.nom || user.nomComplet || "Admin",
            prenom: user.prenom || "Principal",
            email: user.email || "admin.com"
          });
        } else {
          console.log("❌ Pas d'admin dans localStorage");
          // Redirige login si pas connecté
          navigate("/loginAdmin");
        }
      } catch (error) {
        console.error("❌ Erreur localStorage:", error);
        navigate("/loginAdmin");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/loginAdmin");
  };

  if (loading || !adminData) {
    return (
      <header className="logitrack-navbar">
        <div className="nav-left">
          <button className="menu-toggle" onClick={onToggleSidebar}>
            <Menu size={26} strokeWidth={2.4} />
          </button>
          <div className="search-container">
            <Search size={19} className="search-icon" />
            <input placeholder="Chargement..." className="search-input" disabled />
          </div>
        </div>
        <div className="nav-right">
          <div className="profile-wrapper">
            <span className="admin-name">Connexion...</span>
            <div className="admin-avatar avatar-skeleton" />
          </div>
        </div>
      </header>
    );
  }

  const fullName = `${adminData.prenom} ${adminData.nom}`;

  return (
    <header className="logitrack-navbar">
      {/* GAUCHE */}
      <div className="nav-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <Menu size={26} strokeWidth={2.4} />
        </button>

        <div className="search-container">
          <Search size={19} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une livraison, client..."
            className="search-input"
          />
          <kbd className="shortcut">Ctrl K</kbd>
        </div>
      </div>

      {/* DROITE */}
      <div className="nav-right">
        <div className="profile-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className="admin-name">{fullName}</span>
          
          {/* ✅ SEUL avatar principal */}
          <div className="admin-avatar avatar-icon">
            <svg width="20" height="20" margin="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-header">
                {/* ✅ CORRIGÉ - Avatar icon dans dropdown */}
                <div className="dropdown-avatar avatar-icon">
                  <svg width="24" height="24" margin="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <p className="name">{fullName}</p>
                  <p className="email">{adminData.email}</p>
                </div>
              </div>

              <div className="divider" />
              <div className="dropdown-item logout" onClick={handleLogout}>
                Déconnexion
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default NavbarAdmin;
