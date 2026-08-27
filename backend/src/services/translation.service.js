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
2. Devolver ambas versiones del texto (espanol e ingles), traduciendo de ser necesario.

Reglas estrictas:
- Mantener nombres propios y nombres de empresas sin traducir (ej. Cotecmar).
- Mantener terminos tecnicos especializados.
- No agregar informacion extra ni explicaciones.
- No eliminar informacion.
- No agregar comillas a menos que esten en el original.
- No modificar numeros ni unidades.
- Mantener un tono corporativo y profesional.

Devuelve UNICAMENTE un objeto JSON valido con este formato exacto (sin bloques de codigo markdown, solo el JSON puro):
{
  "detectedLanguage": "es",
  "titleEs": "titulo en espanol aqui",
  "titleEn": "titulo en ingles aqui",
  "descriptionEs": "descripcion en espanol aqui",
  "descriptionEn": "descripcion en ingles aqui"
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
