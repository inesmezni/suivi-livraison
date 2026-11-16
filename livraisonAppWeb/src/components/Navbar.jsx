import { NavLink, useNavigate } from "react-router-dom";
import { Package, Bell, History, User, Search } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.clear(); // décommente si besoin
    alert("Déconnexion réussie !");
    navigate("/login");
  };

  return (
    <nav className="navbar-final">
      <div className="navbar-container-final">

        {/* LOGO */}
        <div className="logo-final">
          <div className="logo-icon-final">
            <Package size={36} />
          </div>
          <div className="logo-text-final">
            <span className="title">DeliveryPro</span>
            
          </div>
        </div>

        {/* BARRE DE RECHERCHE CENTRÉE */}
        <div className="search-bar-final">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Rechercher un colis..." />
        </div>

        {/* ICÔNES À DROITE – avec tes vrais liens */}
        <div className="nav-icons-final">

          <NavLink to="/suivi" className="icon-btn-final">
            {/* Optionnel : tu peux remettre MapPinned ici si tu veux */}
            {/* <MapPinned size={24} /> */}
          </NavLink>

          <NavLink to="/notifications" className="icon-btn-final">
            <Bell size={24} />
            <span className="badge-final">3</span>
          </NavLink>

          <NavLink to="/historique" className="icon-btn-final">
            <History size={24} />
          </NavLink>

          <NavLink to="/Profil" className="icon-btn-final">
            <User size={24} />
          </NavLink>

          <button onClick={handleLogout} className="icon-btn-final menu-btn-final">
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;