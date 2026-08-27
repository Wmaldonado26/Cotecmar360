const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

class TranslationService {
  async translateText(title, description, sourceLanguage) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY no configurada. Las traducciones fallarán.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const targetLanguage = sourceLanguage === 'es' ? 'en' : 'es';
    const sourceLangName = sourceLanguage === 'es' ? 'Español' : 'Inglés';
    const targetLangName = targetLanguage === 'es' ? 'Español' : 'Inglés';

    const prompt = `Actúa como un traductor profesional de contenido corporativo, naval e industrial.
Traduce el siguiente título y descripción de ${sourceLangName} a ${targetLangName}.

Reglas estrictas:
- Mantener nombres propios y nombres de empresas sin traducir (ej. Cotecmar).
- Mantener términos técnicos especializados.
- No agregar información extra ni explicaciones.
- No eliminar información.
- No agregar comillas a menos que estén en el original.
- No modificar números ni unidades.
- Mantener un tono corporativo y profesional, con aproximadamente la misma longitud.

Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "traducción del título aquí",
  "description": "traducción de la descripción aquí"
}

Texto a traducir:
Título: ${title}
Descripción: ${description}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const translated = JSON.parse(text);
      return {
        title: translated.title,
        description: translated.description
      };
    } catch (error) {
      console.error("Error en TranslationService:", error);
      throw new Error("No fue posible generar la traducción automática.");
    }
  }
}

module.exports = new TranslationService();
