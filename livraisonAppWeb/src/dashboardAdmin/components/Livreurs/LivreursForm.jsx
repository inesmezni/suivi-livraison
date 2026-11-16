import React, { useState, useEffect } from "react";
import { User, Phone, Truck, Check ,Mail,Lock} from "lucide-react";

const LivreursForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    prenom: "", 
    nom: "", 
    email: "",        // ✅ NOUVEAU
    motDePasse: "",   
    telephone: "", 
    typeVehicule: "",
    vehicleInfo: "",  // ✅ Matricule texte
    statut: "Actif"
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        prenom: initialData.prenom || "",
        nom: initialData.nom || "",
        email: initialData.email || "",
        telephone: initialData.telephone || "",
        vehicleInfo: initialData.vehicleInfo || "", 
        typeVehicule: initialData.typeVehicule || "",  // ✅ Backend field
        statut: initialData.statut || "Actif"
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onSave(form); 
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div>
        <label><User size={16} /> Prénom</label>
        <input 
          name="prenom" 
          value={form.prenom} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div>
        <label><User size={16} /> Nom</label>
        <input 
          name="nom" 
          value={form.nom} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
  <label><Mail size={16} /> Email</label>
  <input name="email" value={form.email} onChange={handleChange} required />
</div>

<div>
  <label><Lock size={16} /> Mot de passe</label>
  <input 
    name="motDePasse" 
    type="password" 
    value={form.motDePasse} 
    onChange={handleChange} 
    placeholder={initialData ? "Laisser vide pour garder ancien" : "Nouveau mot de passe"}
    required={!initialData}  // Obligatoire création seulement
  />
</div>
      <div>
        <label><Phone size={16} /> Téléphone</label>
        <input 
          name="telephone" 
          value={form.telephone} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      {/* ✅ CHAMP TEXTE MATRICULE */}
      <div>
        <label><Truck size={16} /> Matricule véhicule</label>
        <input 
          name="vehicleInfo" 
          value={form.vehicleInfo} 
          onChange={handleChange} 
          placeholder="Ex: 1145-TUN-789"
          required 
        />
      </div>
      {/* ✅ TYPE VÉHICULE NOUVEAU */}
      <div>
        <label><Truck size={16} /> Type véhicule</label>
        <input 
          name="typeVehicule" 
          value={form.typeVehicule} 
          onChange={handleChange} 
          placeholder="Ex: POLO 6, caddy"
          required 
        />
      </div>
      
      <div className="col-span-2">
        <label>Statut</label>
        <div className="radio-group">
          {["Actif", "Inactif"].map(s => (
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
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Annuler
        </button>
        <button type="submit" className="btn-save">
          <Check size={18} />
          {initialData ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </form>
  );
};

export default LivreursForm;
