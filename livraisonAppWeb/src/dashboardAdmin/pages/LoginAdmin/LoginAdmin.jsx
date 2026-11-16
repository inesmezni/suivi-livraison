import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";  // ✅ Import ton axios

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ BACKEND LOGIN
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  console.log("🔍 ENVOI:", { email, password: password });

  try {
    const response = await api.post("/api/auth/login", 
      { 
        email: email,
        password: password 
      },
      { 
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("✅ RESPONSE:", response.data);

    // ✅ SAUVEGARDE token ET user
    const { token, nom, prenom, email: userEmail } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
      nom: nom || response.data.nomComplet,
      prenom: prenom,
      email: userEmail || email
    }));

    console.log("✅ SAVED localStorage:", {
      token: token.substring(0, 20) + "...",
      user: JSON.parse(localStorage.getItem("user"))
    });

    navigate("/Admin");
  } catch (err) {
    console.error("❌ DÉTAIL:", err.response?.status, err.response?.data);
    setError("Email ou mot de passe incorrect");
  } finally {
    setLoading(false);
  }
};



  // Garde tout le JSX identique...
  return (
    <div className="login-page">
      {/* Ton JSX existant sans changement */}
      <div className="login-card">
        <div className="logo">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>

        <h1>DeliveryPro</h1>
        <p className="subtitle">Accédez à l'espace d'administration</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
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

export default LoginAdmin;
