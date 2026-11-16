// src/components/LivraisonForm.jsx
import React, { useState, useEffect } from "react";
import { X, Package, User, MapPin, Truck, Barcode } from "lucide-react";

const LivraisonForm = ({ clients = [], livreurs = [], onSave, onClose, initialData = null }) => {
  const [form, setForm] = useState({
    codeBarres: "",
    clientId: "",
    adresse: "",
    livreurId: "",
    statut: "En attente"
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        codeBarres: initialData.code || "",
        clientId: initialData.clientId || "",
        adresse: initialData.adresse || "",
        livreurId: initialData.livreurId || "",
        statut: initialData.statut || "En attente"
      });
    } else {
      setForm({
        codeBarres: `BAR-${Math.floor(100000 + Math.random() * 900000)}`,
        clientId: "",
        adresse: "",
        livreurId: "",
        statut: "En attente"
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  await onSave(form); 
  };

  const livreursDisponibles = livreurs.filter(l => l.statut === "Disponible");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        <h2 style={{ margin: "0 0 30px", fontSize: "1.8rem", fontWeight: "800", color: "#1e293b" }}>
          <Package size={28} style={{ marginRight: "12px", color: "#3b82f6" }} />
          {initialData ? "Modifier la livraison" : "Nouvelle livraison"}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">

          {/* Code-barres */}
          <div>
            <label><Barcode size={16} /> Code-barres</label>
            <input
              name="codeBarres"
              value={form.codeBarres}
              readOnly
              style={{ background: "#f1f5f9", color: "#475569" }}
            />
            <small style={{ color: "#64748b", fontSize: "0.8rem" }}></small>
          </div>

          {/* Client */}
          <div>
            <label><User size={16} /> Client</label>
            <select name="clientId" value={form.clientId} onChange={handleChange} required>
              <option value="">Sélectionner un client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Adresse */}
          <div>
            <label><MapPin size={16} /> Adresse de livraison</label>
            <input
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              
             
            />
          </div>

          {/* Livreur */}
          <div>
            <label><Truck size={16} /> Livreur assigné</label>
            <select name="livreurId" value={form.livreurId} onChange={handleChange}>
              <option value="">Aucun </option>
              {livreursDisponibles.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} (Disponible)
                </option>
              ))}
            </select>
          </div>

          {/* Statut (seulement en modification) */}
          {initialData && (
            <div className="col-span-2">
              <label>Statut</label>
              <div className="radio-group">
                {["En attente", "En cours", "Livrée", "Annulée"].map(s => (
                  <label key={s}>
                    <input
                      type="radio"
                      name="statut"
                      value={s}
                      checked={form.statut === s}
                      onChange={handleChange}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-save">
              {initialData ? "Enregistrer" : "Créer la livraison"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivraisonForm;