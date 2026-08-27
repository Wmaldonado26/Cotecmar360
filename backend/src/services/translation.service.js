const { GoogleGenerativeAI } = require("@google/generative-ai");

class TranslationService {
  async translateText(title, description) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY no configurada. Usando traduccion simulada para desarrollo local.");
      return {
        detectedLanguage: 'es',
        titleEs: title,
        titleEn: title + " (Translated)",
        descriptionEs: description,
        descriptionEn: description + " (Translated)"
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Actua como un traductor profesional de contenido corporativo, naval e industrial.
Recibiras un titulo y una descripcion.
Tu tarea es:
1. Detectar si el texto esta principalmente en espanol (es) o en ingles (en).
2. Devolver ambas versiones del texto: los campos "Es" SIEMPRE en espanol y los campos "En" SIEMPRE en ingles.

Reglas MUY estrictas:
- SI EL TEXTO ORIGINAL ESTA EN ESPANOL: Debes copiarlo en los campos "Es" y TRADUCIRLO AL INGLES en los campos "En".
- SI EL TEXTO ORIGINAL ESTA EN INGLES: Debes copiarlo en los campos "En" y TRADUCIRLO AL ESPANOL en los campos "Es".
- BAJO NINGUNA CIRCUNSTANCIA los campos "Es" y "En" deben contener el mismo texto, a menos que sea un nombre propio inmodificable (como "Cotecmar"). Debes traducir los conceptos. "Actividades Cientificas y Tecnologicas" se traduce como "Scientific and Technological Activities".
- Mantener nombres propios de empresas sin traducir.
- No agregar comillas a menos que esten en el original.

Devuelve UNICAMENTE un objeto JSON valido con este formato exacto (sin bloques de codigo markdown, solo el JSON puro):
{
  "detectedLanguage": "es",
  "titleEs": "titulo en espanol aqui",
  "titleEn": "titulo en ingles aqui (TRADUCIDO)",
  "descriptionEs": "descripcion en espanol aqui",
  "descriptionEn": "descripcion en ingles aqui (TRADUCIDO)"
}

Texto:
Titulo: ${title}
Descripcion: ${description}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log("Raw Gemini response:", text);

      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const translated = JSON.parse(text);
      return {
        detectedLanguage: translated.detectedLanguage === 'en' ? 'en' : 'es',
        titleEs: translated.titleEs || title,
        titleEn: translated.titleEn || title,
        descriptionEs: translated.descriptionEs || description,
        descriptionEn: translated.descriptionEn || description
      };
    } catch (error) {
      console.error("Error en TranslationService:", error);
      throw new Error("No fue posible generar la traduccion automatica.");
    }
  }
}

module.exports = new TranslationService();
