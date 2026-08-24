import { API_BASE_URL, API_HOST } from "./apiConfig";
import authService from "./AuthService";

// Fallback hardcodeado SIEMPRE se muestra si el endpoint /landing no responde
// (backend down / sin internet / sin cards en BD / error auth).
// Así la landing NUNCA se ve "vacía" tras el hero.
const DEFAULT_COTECMAR_CARDS = [
  {
    id: "cotecmar-default-1",
    title: "Astillero & Construcción Naval",
    titleEn: "Shipyard & Naval Construction",
    description:
      "Diseño, construcción y modernización de buques de superficie, plataformas marítimas y unidades de apoyo logístico con estándares de defensa.",
    descriptionEn:
      "Design, construction and modernization of surface vessels, maritime platforms and logistics support units with defense standards.",
    link: "/gallery",
    image: null,
  },
  {
    id: "cotecmar-default-2",
    title: "Mantenimiento & Reparación",
    titleEn: "Maintenance & Repair",
    description:
      "Ciclos de mantenimiento industrial, reparación de motores, sistemas de propulsión, electrónica naval y modernización de plataformas.",
    descriptionEn:
      "Industrial maintenance cycles, engine repair, propulsion systems, naval electronics and platform modernization.",
    link: "/gallery",
    image: null,
  },
  {
    id: "cotecmar-default-3",
    title: "Simulación & Entrenamiento XR",
    titleEn: "XR Simulation & Training",
    description:
      "Entornos inmersivos 360° y entrenamiento operacional en realidad extendida para tripulaciones, maniobras y procesos de seguridad.",
    descriptionEn:
      "Immersive 360 environments and operational XR training for crews, maneuvers and safety processes.",
    link: "/gallery",
    image: null,
  },
];

class LandingService {
  async getCards() {
    try {
      const response = await fetch(`${API_BASE_URL}/landing`);
      if (!response.ok) throw new Error("Failed to fetch landing cards");
      const cards = await response.json();
      
      const normalized = cards.map(c => {
        let finalImage = null;
        if (c.imagePath) {
          if (c.imagePath.startsWith('http')) {
            finalImage = c.imagePath;
          } else {
            const cleanPath = c.imagePath.replace(/\\/g, "/");
            const filename = cleanPath.split("/").pop();
            finalImage = `${API_HOST}/uploads/${filename}`;
          }
        }
        return {
          ...c,
          image: finalImage
        };
      });

      if (normalized && normalized.length > 0) return normalized;
      return DEFAULT_COTECMAR_CARDS;
    } catch (error) {
      console.warn("Landing cards fetch failed → usando tarjetas default COTECMAR:", error);
      return DEFAULT_COTECMAR_CARDS;
    }
  }

  async createCard(formData) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/landing`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error("Failed to create landing card");
    return response.json();
  }

  async updateCard(id, formData) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/landing/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error("Failed to update landing card");
    return response.json();
  }

  async deleteCard(id) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/landing/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error("Failed to delete landing card");
    return response.json();
  }
}

const landingService = new LandingService();
export default landingService;
