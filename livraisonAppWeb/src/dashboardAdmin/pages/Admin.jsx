// dashboardAdmin/pages/Admin.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../components/SidebarAdmin";
import NavbarAdmin from "../components/NavbarAdmin";

import LivreursPage from "../pages/Livreurs/LivreursPage";
import ClientsPage from "../pages/Clients/ClientsPage";
import LivraisonPage from "../pages/Livraisons/LivraisonPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import SuiviColisPage from "../pages/SuiviColis/SuiviColisPage";
import HistoriqueLivraisons from "../pages/HistoriqueLivraisons/HistoriqueLivraisons";
import DashboardAdmin from "../pages/DashboardAdmin/DashboardAdmin"

import "./Admin.css"
const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar isOpen={sidebarOpen} />

      <div className="main-content">
        <NavbarAdmin onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="content-wrapper">
          <Routes>
           <Route path="/" element={<DashboardAdmin />} />
            <Route path="livreurs" element={<LivreursPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="livraisons" element={<LivraisonPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="historique" element={<HistoriqueLivraisons />} />
           <Route path="SuiviColis" element={<SuiviColisPage />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
