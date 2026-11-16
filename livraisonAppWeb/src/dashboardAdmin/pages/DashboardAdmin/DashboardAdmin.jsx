import React, { useState, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import api from "../../../api/api";  // ✅ API
import "./DashboardAdmin.css";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalLivraisons: 0,
    enCours: 0,
    livrees: 0,
    echouees: 0,
    livreursActifs: 0,
  });
  const [livraisonsParJour, setLivraisonsParJour] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH Dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // API calls parallèles
      const [livraisonsRes, livreursRes] = await Promise.all([
        api.get("/api/livraisons"),
        api.get("/api/livreurs")
      ]);

      const livraisons = livraisonsRes.data;
      
      // ✅ Stats calculées
      const totalLivraisons = livraisons.length;
      const enCours = livraisons.filter(l => 
        l.statut === "EN_COURS" || l.statutLivraison === "EN_COURS"
      ).length;
      const livrees = livraisons.filter(l => 
        l.statut === "LIVREE" || l.statutLivraison === "LIVREE"
      ).length;
      const echouees = livraisons.filter(l => 
        l.statut === "ANNULEE" || l.statutLivraison === "ANNULEE"
      ).length;
      const livreursActifs = livreursRes.data.filter(l => l.actif === true || l.actif === 1).length;

      setStats({
        totalLivraisons,
        enCours,
        livrees,
        echouees,
        livreursActifs
      });

      // ✅ Remplace la partie graphique dans fetchDashboardData
console.log("🔍 Livraisons sample:", livraisons.slice(0, 3)); // DEBUG

// ✅ Graphique par jour (7 derniers jours) - ROBUSTE
const today = new Date();
const jours = [];
for (let i = 6; i >= 0; i--) {
  const date = new Date(today);
  date.setDate(today.getDate() - i);
  const jour = date.toLocaleDateString('fr-TN', { weekday: 'short' });
  
  // ✅ TEST MULTIPLES champs date + fallback
  const count = livraisons.filter(liv => {
    // Champs possibles
    const dateLivraison = liv.dateCreation || 
                         liv.createdAt || 
                         liv.dateLivraison || 
                         liv.date || 
                         liv.updatedAt;
    
    if (!dateLivraison) return false;
    
    const livDate = new Date(dateLivraison);
    console.log(`📅 ${jour}: ${dateLivraison} → ${livDate.toDateString()} vs ${date.toDateString()}`);
    
    return livDate.toDateString() === date.toDateString();
  }).length;
  
  console.log(`📊 ${jour}: ${count} livraisons`);
  jours.push({ jour, total: count });
}
setLivraisonsParJour(jours);


    } catch (error) {
      console.error("❌ Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-admin">
        <h1 className="dashboard-title">Chargement du tableau de bord...</h1>
      </div>
    );
  }

  return (
    <div className="dashboard-admin">
      {/* 🔹 TITRE */}
      <h1 className="dashboard-title">
        Tableau de bord administrateur
      </h1>

      {/* 🔹 STATISTIQUES */}
      <div className="stats-grid">
        <StatCard 
          title="Total livraisons" 
          value={stats.totalLivraisons.toLocaleString()} 
          icon={<Truck />} 
          color="blue"
        />
        <StatCard 
          title="En cours" 
          value={stats.enCours.toLocaleString()} 
          icon={<Clock />} 
          color="yellow"
        />
        <StatCard 
          title="Livrées" 
          value={stats.livrees.toLocaleString()} 
          icon={<CheckCircle />} 
          color="green" 
        />
        <StatCard 
          title="Échouées" 
          value={stats.echouees.toLocaleString()} 
          icon={<XCircle />} 
          color="red" 
        />
        <StatCard 
          title="Livreurs actifs" 
          value={stats.livreursActifs.toLocaleString()} 
          icon={<Users />} 
          color="purple" 
        />
      </div>

      {/* 🔹 GRAPHIQUE */}
      <div className="chart-card">
        <h2>Livraisons par jour (7 derniers jours)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={livraisonsParJour}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={32}>
              {livraisonsParJour.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#3b82f6", "#8b5cf6", "#10b981", "#f97316", 
                         "#ef4444", "#6366f1", "#14b8a6"][index % 7]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// StatCard component (inchangé)
const StatCard = ({ title, value, icon, color = "gray" }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
    <div className="stat-icon">{icon}</div>
  </div>
);

export default DashboardAdmin;
