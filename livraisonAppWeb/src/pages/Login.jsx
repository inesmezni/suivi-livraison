import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, role, userId, nom, prenom } = res.data;

      if (!token) {
        setError("Token manquant dans la réponse");
        return;
      }

      if (!role || role.toUpperCase() !== "ROLE_CLIENT") {
        setError("Accès refusé : compte non client");
        return;
      }

      // Stockage WEB
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      if (nom) localStorage.setItem("nom", nom);
      if (prenom) localStorage.setItem("prenom", prenom);

      navigate("/suivi");
    } catch (err) {
      console.error("Login error:", err?.response?.data || err?.message);

      const msgBack = err?.response?.data;
      setError(
        typeof msgBack === "string"
          ? msgBack
          : "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          {/* SVG inchangé */}
        </div>

        <h1>DeliveryPro</h1>
        <p className="subtitle">
          Entrez vos informations pour suivre votre livraison en temps réel
        </p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Adresse e-mail</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Mot de passe</label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
