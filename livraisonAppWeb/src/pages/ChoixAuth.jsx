import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react"; // Icônes pro
import "./ChoixAuth.css";

export default function ChoixAuth() {
  return (
    <div className="choix-auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>Bienvenue !</h1>
          <p>Choisissez une option pour continuer</p>
        </div>

        <div className="auth-options">
          <Link to="/login" className="auth-option">
            <LogIn size={48} strokeWidth={1.8} />
            <h2>Connexion</h2>
            <p>Accéder à votre compte existant</p>
          </Link>

          <Link to="/signup" className="auth-option">
            <UserPlus size={48} strokeWidth={1.8} />
            <h2>Inscription</h2>
            <p>Créer un nouveau compte gratuitement</p>
          </Link>
        </div>
      </div>
    </div>
  );
}