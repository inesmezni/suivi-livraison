// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages publiques (sans navbar)
import Bienvenue from "./pages/Bienvenue";
import ChoixAuth from "./pages/ChoixAuth";
import ChoixRole from "./pages/ChoixRole";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LoginAdmin from "./dashboardAdmin/pages/LoginAdmin/LoginAdmin";
import Admin from "./dashboardAdmin/pages/Admin";


// Pages protégées (avec navbar via Layout)
import SuiviColis from "./pages/SuiviColis";
import Notifications from "./pages/Notifications";
import Historique from "./pages/Historique";

import Confirmation from "./pages/Confirmation";
import Profil from "./pages/Profil";          // ✅ AJOUT ICI

// Layout commun (navbar + footer)
import Layout from "./components/Layout";



function App() {
  return (
    <Router>
      <Routes>

        {/* ==== Pages publiques ==== */}
        <Route path="/" element={<Bienvenue />} />
        <Route path="/choix-auth" element={<ChoixAuth />} />
        <Route path="/choix-role" element={<ChoixRole />} />

        {/* ==== Auth ==== */}
        <Route path="/inscription" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />


         {/* DASHBOARD ADMIN (routes imbriquées) */}
         <Route path="/admin/*" element={<Admin />} />
        

        {/* ==== Pages protégées (avec Layout) ==== */}
        <Route path="/suivi" element={<Layout><SuiviColis /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/historique" element={<Layout><Historique /></Layout>} />
        
        <Route path="/confirmation" element={<Layout><Confirmation /></Layout>} />

        {/* === Profil (nouvelle page) === */}
        <Route path="/profil" element={<Layout><Profil /></Layout>} />   {/* ✅ AJOUT */}

        {/* ==== 404 ==== */}
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
