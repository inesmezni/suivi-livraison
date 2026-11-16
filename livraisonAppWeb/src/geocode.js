// geocode.js
export const geocodeAddress = async (adresse) => {
  const API_KEY = "320fadbcdbf34fd6ab4df4103d0a83c1";
  
  // Ajoute "Tunis, Tunisie" pour meilleures résultats
  const formattedAddress = `${adresse}, Tunis, Tunisie`;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(formattedAddress)}&key=${API_KEY}&language=fr&limit=1&countrycode=TN`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    console.log("OpenCage response:", data); // DEBUG

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      console.log(`✅ Géocodé "${adresse}" -> [${lat}, ${lng}]`);
      return [parseFloat(lat), parseFloat(lng)]; // IMPORTANT: Leaflet = [lat, lng]
    } 
    
    console.warn("❌ Adresse non trouvée:", adresse);
    // Fallback Tunis centre
    return [36.8065, 10.1815];
    
  } catch (err) {
    console.error("❌ Erreur OpenCage:", err);
    // Fallback Tunis centre
    return [36.8065, 10.1815];
  }
};
