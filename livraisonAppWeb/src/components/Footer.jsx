import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* COLONNE 1 */}
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">📦</div>
            <h2>DeliveryPro</h2>
          </div>

          <p className="footer-text">
            La solution de suivi de livraison en temps réel pour tous vos colis.
          </p>

          <div className="footer-socials">
            <div className="social-icon">f</div>
            <div className="social-icon">t</div>
            <div className="social-icon">i</div>
            <div className="social-icon">in</div>
          </div>
        </div>

        {/* COLONNE 2 */}
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li>Suivi de colis</li>
            <li>Livraison express</li>
            <li>Livraison internationale</li>
            <li>Points relais</li>
            <li>Assurance colis</li>
          </ul>
        </div>

        {/* COLONNE 3 */}
        <div className="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li>À propos</li>
            <li>FAQ</li>
            <li>Support client</li>
            <li>Conditions d'utilisation</li>
            <li>Politique de confidentialité</li>
          </ul>
        </div>

        {/* COLONNE 4 */}
        <div className="footer-section">
          <h3>Contact</h3>

          <p className="contact-line">
            📧 contact@deliverypro.fr
          </p>

          <p className="contact-line">
            📞 +33 1 23 45 67 89
          </p>

          <p className="contact-line">
            📍 12 Avenue des Champs-Élysées<br />
            75008 Paris, France
          </p>
        </div>
      </div>

      {/* BAS DU FOOTER */}
      <div className="footer-bottom">
        © 2025 DeliveryPro. Tous droits réservés.
      </div>

      <div className="footer-made">
        
      </div>
    </footer>
  );
}
