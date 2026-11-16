// BienvenuePro.jsx
import { useNavigate } from "react-router-dom";
import "./Bienvenue.css";

export default function BienvenuePro() {
  const navigate = useNavigate();

  const goToChoixRole = () => {
    navigate("/choix-role");
  };

  return (
    <div className="bienvenue-pro">
      {/* Hero + Stats */}
      <div className="hero-section">
        <div className="hero-container">
          {/* Badge Nouveau */}
          <div className="badge-new">
            <span className="sparkle"></span> • Suivi GPS avancé
          </div>

          {/* Texte principal gauche */}
          <div className="hero-content">
            <h1>
              Delivery <span className="highlight">Pro</span>
            </h1>
            <p className="tagline">Suivi de Livraison en Temps Réel</p>
            <p className="description">
              Suivez vos colis avec précision, recevez des notifications
              instantanées et profitez d’une expérience fluide, rapide et
              sécurisée. La livraison nouvelle génération est là.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={goToChoixRole}>
                Commencer maintenant
              </button>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <span className="check">✓</span> Sans engagement
              </div>
              <div className="feature-item">
                <span className="check">✓</span> Support 24/7
              </div>
            </div>
          </div>

          {/* Image + Stats droite */}
          <div className="hero-image-side">
            <div className="stats-bar">
              <div className="stat-item active">
                <span className="arrow">↑</span> Livraisons actives
                <strong>+2,547 aujourd’hui</strong>
              </div>
            </div>

            <div className="delivery-info">
              <h2>
                Delivery <span>Pro</span>
              </h2>
              <p>en Temps Réel</p>
              <div className="delivery-time">
                <span className="clock">⏱</span>
                <div>
                  <div>Temps moyen</div>
                  <strong>32 minutes</strong>
                </div>
              </div>
            </div>

            <img
              src="/images/livraison910.jpg"
              alt="Livreur DeliveryPro"
              className="delivery-man"
            />
          </div>
        </div>
      </div>

      {/* Section Stats */}
      <div className="stats-section">
        <div className="stat-card">
          50K+
          <br />
          <span>Livraisons réussies</span>
        </div>
        <div className="stat-card">
          98%
          <br />
          <span>Clients satisfaits</span>
        </div>
        <div className="stat-card">
          24/7
          <br />
          <span>Support disponible</span>
        </div>
        <div className="stat-card">
          100+
          <br />
          <span>Villes couvertes</span>
        </div>
      </div>

      {/* Fonctionnalités Premium */}
      <section className="features-section">
        <div className="section-header">
          <h2>Fonctionnalités Premium</h2>
          <p>
            Découvrez une nouvelle façon de suivre vos livraisons avec nos
            outils innovants
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon"></div>
            <h3>Suivi GPS en temps réel</h3>
            <p>Visualisez la position exacte de votre livreur à tout moment</p>
          </div>

          <div className="feature-card">
            <div className="icon"></div>
            <h3>Notifications instantanées</h3>
            <p>Soyez alerté à chaque étape de la livraison</p>
          </div>

          <div className="feature-card">
            <div className="icon"></div>
            <h3>Estimation précise</h3>
            <p>Connaissez le temps d’arrivée estimé avec une grande précision</p>
          </div>

          <div className="feature-card">
            <div className="icon"></div>
            <h3>Livraison sécurisée</h3>
            <p>Vos colis sont protégés et assurés durant tout le trajet</p>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Ce que disent nos clients</h2>
          <p>Des milliers de clients satisfaits utilisent DeliveryPro chaque jour</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p className="quote">
              « Service exceptionnel ! Je peux suivre mes colis en temps réel et
              le livreur est toujours à l’heure. »
            </p>
            <div className="author">
              <div className="avatar">M</div>
              <div>
                <strong>Marie Dubois</strong>
                <br />
                <span>Cliente régulière</span>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p className="quote">
              « DeliveryPro a transformé notre logistique. L’interface est
              intuitive et le suivi précis. »
            </p>
            <div className="author">
              <div className="avatar purple">T</div>
              <div>
                <strong>Thomas Martin</strong>
                <br />
                <span>Entrepreneur</span>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p className="quote">
              « Enfin une application de livraison moderne ! Les notifications
              sont très utiles. »
            </p>
            <div className="author">
              <div className="avatar pink">S</div>
              <div>
                <strong>Sophie Laurent</strong>
                <br />
                <span>Particulier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Prêt à commencer ?</h2>
          <p>
            Rejoignez des milliers d’utilisateurs satisfaits et suivez vos
            livraisons en temps réel dès maintenant
          </p>

          <button className="btn-cta-final" onClick={goToChoixRole}>
            Commencer gratuitement →
          </button>
        </div>
      </section>
    </div>
  );
}
