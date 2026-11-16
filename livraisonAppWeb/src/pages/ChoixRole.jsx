// src/pages/ChoixRole.jsx
import { Link } from "react-router-dom";
import "./ChoixRole.css";

export default function ChoixRole() {
  return (
    <div className="choix-role-page">
      <h1 className="main-title">
        Choisissez votre profil pour continuer vers une expérience sur mesure
      </h1>

      <div className="cards-container">

        {/* ==================== CLIENT ==================== */}
        <div className="role-card">
          <div className="card-image">
            <img
              src="https://www.shutterstock.com/image-photo/happy-woman-delivery-man-package-260nw-2304125563.jpg"
              alt="Cliente recevant un colis"
            />
          </div>

          <div className="card-content">
            <h2>Client</h2>
            <p className="subtitle">Suivre mes commandes et gérer mon compte</p>

            <ul className="features">
              <li><span className="icon"></span> Suivre mes colis en temps réel</li>
              <li><span className="icon"></span> Recevoir des notifications</li>
              <li><span className="icon"></span> Consulter mon historique</li>
            </ul>

            <Link to="/choix-auth">
              <button className="btn client-btn">
                Accéder <span className="arrow"></span>
              </button>
            </Link>
          </div>
        </div>

        {/* ==================== ADMINISTRATEUR ==================== */}
        <div className="role-card">
          <div className="card-image">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?fm=jpg&q=60&w=3000"
              alt="Administrateur"
            />
          </div>

          <div className="card-content">
            <h2>Administrateur</h2>
            <p className="subtitle">Gérer l’équipe et analyser les performances</p>

            <ul className="features">
              <li><span className="icon"></span> Gérer les livraisons et équipes</li>
              <li><span className="icon"></span> Accéder aux statistiques</li>
              <li><span className="icon"></span> Configurer les paramètres</li>
            </ul>

            <Link to="/LoginAdmin">
              <button className="btn admin-btn">
                Accéder <span className="arrow"></span>
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}