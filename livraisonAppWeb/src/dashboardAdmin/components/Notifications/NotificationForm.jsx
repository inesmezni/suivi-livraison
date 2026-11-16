import React, { useState } from "react";
import { Send } from "lucide-react";
import "./NotificationForm.css";
const NotificationForm = ({ onSend , clients = [], livreurs = []}) => {
  const [form, setForm] = useState({
    cible: "Livreur",
    titre: "",
    message: "",
    livreurId: "",
    clientId: "",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "cible" && { livreurId: "", clientId: "" }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.message.trim()) return;
    onSend(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {/* Destinataire */}
      <div>
        <label>Destinataire</label>
        <select name="cible" value={form.cible} onChange={handleChange}>
          <option value="Livreur">Livreur ({livreurs.length})</option>
          <option value="Client">Client ({clients.length})</option>
        </select>
      </div>

      {/* ✅ LIVREURS depuis props */}
      {form.cible === "Livreur" && (
        <div>
          <label>Livreur</label>
          <select name="livreurId" value={form.livreurId} onChange={handleChange} required>
            <option value="">-- Sélectionner ({livreurs.length}) --</option>
            {livreurs.map((l) => (                    // ✅ livreurs props
              <option key={l.id} value={l.id}>
                {l.nom}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ✅ CLIENTS depuis props */}
      {form.cible === "Client" && (
        <div>
          <label>Client</label>
          <select name="clientId" value={form.clientId} onChange={handleChange} required>
            <option value="">-- Sélectionner ({clients.length}) --</option>
            {clients.map((c) => (                      // ✅ clients props
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
      )}


      {/* Titre */}
      <div>
        <label>Titre</label>
        <input
          name="titre"
          value={form.titre}
          onChange={handleChange}
          required
        />
      </div>

      {/* Message */}
      <div className="col-span-2">
        <label>Message</label>
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      {/* Bouton */}
      <div className="form-actions">
        <button className="btn-save">
          <Send size={18} /> Envoyer
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;
