import React, { useState, useEffect } from "react";
import api from "../api/api"; // Ton instance axios
import { Star, Truck, User,X,MessageCircle, MapPin  } from "lucide-react";


const Confirmation = ({ livraisonId, onClose }) => {
  const clientId = localStorage.getItem("userId");
  const [note, setNote] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [livraison, setLivraison] = useState(null);

  // 🔍 FETCH livraison pour livreur_id
  useEffect(() => {
    console.log("🔍 Fetch livraison ID:", livraisonId);
    if (livraisonId && livraisonId > 0) {
      api.get(`/api/livraisons/${livraisonId}`)
        .then(res => {
          console.log("📦 Livraison data:", res.data);
          setLivraison(res.data);
        })
        .catch(err => console.error("❌ Livraison fetch error:", err));
    }
  }, [livraisonId]);

  useEffect(() => {
    console.log("🔑 TOKEN Frontend:", localStorage.getItem("token") ? "EXISTS ✅" : "MANQUANT ❌");
    console.log("👤 userId:", clientId);
  }, []);

  const handleSubmit = async () => {
    console.log("🚀 SUBMIT FINAL !", { clientId, livreur_id: livraison?.livreur_id, note });

    const evaluationData = {
      idClient: parseInt(clientId),
      idLivreur: livraison?.livreur_id || 1, // Fallback
      note: parseInt(note),
      commentaire: comment || null,
      dateEvaluation: new Date().toISOString()
    };

    console.log("📤 POST data:", evaluationData);

    setLoading(true);
    try {
      const response = await api.post("/api/evaluation", evaluationData);
      console.log("✅ BDD OK:", response.data);
      alert("⭐ Évaluation enregistrée ! Merci !");
      onClose();
    } catch (error) {
      console.error("❌ POST ERROR:", {
        status: error.response?.status,
        data: error.response?.data
      });
      alert("❌ Erreur: " + (error.response?.data?.message || "Vérifiez la connexion"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rating-modal-content">
            <div className="rating-modal-header">
              <MapPin size={20} color="white" />
               <div>{livraison?.adresse || "Livraison"}</div>
            </div>
            <div style={{ padding: "30px 24px", textAlign: "center" }}>
              <h3 style={{ marginBottom: "20px", fontSize: "1.4rem" }}>Quelle note donneriez-vous à votre livreur ?</h3>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={48} fill={star <= note ? "#facc15" : "none"} color={star <= note ? "#facc15" : "#e5e7eb"} style={{ cursor: "pointer" }} onClick={() => setNote(star)} />
                ))}
              </div>
              <div style={{ marginTop: "40px" }}>
                <p style={{ textAlign: "left", fontWeight: "600", marginBottom: "10px" }}>Partagez votre expérience (anonyme)</p>
                <textarea placeholder="Décrivez votre expérience : ponctualité, professionnalisme, état du colis..." value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} style={{ width: "100%", minHeight: "120px", padding: "12px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "15px", resize: "none" }} />
                <div className="char-counter">{comment.length}/500 caractères</div>
              </div>
              <div className="anonymity-banner">
                <MessageCircle size={18} />
                <span><strong>Votre avis est 100% anonyme</strong><br />Le livreur ne pourra pas savoir qui a laissé cet avis.</span>
              </div>
              <div className="buttons">
                <button onClick={onClose}>Annuler</button>
                <button onClick={handleSubmit} disabled={!note || loading}>
                  {loading ? "Envoi..." : "Envoyer l'avis"}
                </button>
              </div>
            </div>
          </div>
  );
};

export default Confirmation;

