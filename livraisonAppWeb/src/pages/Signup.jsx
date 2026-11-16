import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Check, User, Mail, Lock, Phone, Home, MapPin
} from "lucide-react";
import api from "../api/api";
import "./Signup.css";

export default function SignupClient() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 🔹 Payload envoyé au backend
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motDePasse: formData.password,
        role: "CLIENT",
        telephone: formData.telephone,
        adresse: formData.adresse
      };

      await api.post("/api/auth/register", payload);

      alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err?.response?.data || err?.message);

      const msgBack = err?.response?.data;
      setError(
        typeof msgBack === "string"
          ? msgBack
          : "Erreur lors de la création du compte"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-client-container">
      <div className="signup-client-card">
        <Link to="/" className="back-btn">
          <ArrowLeft size={22} />
          Retour
        </Link>

        <div className="signup-header">
          <h1>Créez votre compte client</h1>
          <p>Suivez vos colis en temps réel, où que vous soyez</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="signup-form">

          {/* Prénom + Nom */}
          <div className="form-row">
            <div className="input-group">
              <User className="icon" />
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <User className="icon" />
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group full">
            <Mail className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          {/* Téléphone */}
          <div className="input-group full">
            <Phone className="icon" />
            <input
              type="tel"
              name="telephone"
              placeholder="Téléphone"
              onChange={handleChange}
              required
            />
          </div>

          {/* Adresse */}
          <div className="input-group full">
            <Home className="icon" />
            <input
              type="text"
              name="adresse"
              placeholder="Adresse complète"
              onChange={handleChange}
              required
            />
          </div>

          {/* Code postal + Ville (UX uniquement) */}
          <div className="form-row">
            <div className="input-group">
              <MapPin className="icon" />
              <input
                type="text"
                name="codePostal"
                placeholder="Code postal"
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <MapPin className="icon" />
              <input
                type="text"
                name="ville"
                placeholder="Ville"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="input-group full password-group">
            <Lock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe (8 caractères min.)"
              onChange={handleChange}
              required
              minLength="8"
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Masquer" : "Voir"}
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : (
              <>
                <Check size={24} />
                Créer mon espace client
              </>
            )}
          </button>
        </form>

        <p className="login-text">
          Déjà client ?{" "}
          <Link to="/login" className="login-link">
            Me connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
