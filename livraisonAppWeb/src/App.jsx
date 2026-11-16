// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages publiques (sans navbar)
import Bienvenue from "./pages/Bienvenue";
import ChoixAuth from "./pages/ChoixAuth";        // Ton écran de choix Connexion / Inscription
import ChoixRole from "./pages/ChoixRole";
import Signup from "./pages/Signup";              // Formulaire d'inscription (le beau !)
import Login from "./pages/Login";                // Tu peux le créer après, ou je te le fais

// Pages protégées (avec navbar via Layout)
import SuiviColis from "./pages/SuiviColis";
import Notifications from "./pages/Notifications";
import Historique from "./pages/Historique";
import Signature from "./pages/Signature";
import Confirmation from "./pages/Confirmation";

// Layout commun (navbar + footer)
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>

        {/* ==== Pages publiques (plein écran, sans Layout) ==== */}
        <Route path="/" element={<Bienvenue />} />
        <Route path="/choix-auth" element={<ChoixAuth />} />
        <Route path="/choix-role" element={<ChoixRole />} />

        {/* ==== Authentification ==== */}
        <Route path="/inscription" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />        {/* Alias anglais */}

        <Route path="/connexion" element={<Login />} />
        <Route path="/login" element={<Login />} />          {/* Alias anglais */}

        {/* ==== Pages protégées (avec navbar + footer) ==== */}
        <Route path="/suivi" element={<Layout><SuiviColis /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/historique" element={<Layout><Historique /></Layout>} />
        <Route path="/signature" element={<Layout><Signature /></Layout>} />
        <Route path="/confirmation" element={<Layout><Confirmation /></Layout>} />

        {/* ==== Page 404 ==== */}
        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #f8f9ff, #eef2ff)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "4.5rem", fontWeight: 900, color: "#4f46e5", margin: 0 }}>
                  404
                </h1>
                <p style={{ fontSize: "1.5rem", color: "#64748b", marginTop: "1rem" }}>
                  Oups ! Cette page n'existe pas.
                </p>
                <a
                  href="/"
                  style={{
                    marginTop: "2rem",
                    display: "inline-block",
                    padding: "0.75rem 1.5rem",
                    background: "#4f46e5",
                    color: "white",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;