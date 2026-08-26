const landingService = require("../services/landing.service");
const translationService = require("../services/translation.service");

class LandingController {
  async getCards(req, res) {
    const cards = await landingService.getAllCards();
    res.json(cards);
  }

  async translateContent(req, res) {
    const { language, title, description } = req.body;
    if (!language || !title || !description) {
      return res.status(400).json({ error: "Faltan datos para traducir." });
    }
    try {
      const translated = await translationService.translateText(title, description, language);
      res.json(translated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCard(req, res) {
    let imagePath = null;
    if (req.files && req.files.image && req.files.image[0]) {
      imagePath = req.files.image[0].path && req.files.image[0].path.startsWith('http') 
        ? req.files.image[0].path 
        : /uploads/ + req.files.image[0].filename;
    }

    const { language, title, description, layer, orderIndex, link } = req.body;
    let finalTitle = title;
    let finalTitleEn = req.body.titleEn;
    let finalDesc = description;
    let finalDescEn = req.body.descriptionEn;
    const translateNow = req.body.translate_now === 'true' || req.body.translate_now === true;

    if (translateNow && language && title && description) {
      try {
        const translated = await translationService.translateText(title, description, language);
        if (language === 'es') {
          finalTitleEn = translated.title;
          finalDescEn = translated.description;
        } else {
          finalTitle = translated.title;
          finalDesc = translated.description;
        }
      } catch (err) {
        console.error("Translation error on create:", err);
        return res.status(500).json({ error: "No fue posible generar la traducción automática." });
      }
    }

    const data = {
      layer: layer,
      title: finalTitle,
      titleEn: finalTitleEn,
      description: finalDesc,
      descriptionEn: finalDescEn,
      orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      imagePath,
      link: link,
    };

    const newCard = await landingService.createCard(data);
    res.status(201).json(newCard);
  }

  async updateCard(req, res) {
    const { id } = req.params;
    const { language, title, description, layer, orderIndex, link } = req.body;
    const translateNow = req.body.translate_now === 'true' || req.body.translate_now === true;
    
    let finalTitle = title || req.body.title;
    let finalTitleEn = req.body.titleEn;
    let finalDesc = description || req.body.description;
    let finalDescEn = req.body.descriptionEn;

    if (translateNow && language && title && description) {
      try {
        const translated = await translationService.translateText(title, description, language);
        if (language === 'es') {
          finalTitleEn = translated.title;
          finalDescEn = translated.description;
        } else {
          finalTitle = translated.title;
          finalDesc = translated.description;
        }
      } catch (err) {
        console.error("Translation error on update:", err);
        return res.status(500).json({ error: "No fue posible generar la traducción automática." });
      }
    }

    const data = {
      layer: layer,
      title: finalTitle,
      titleEn: finalTitleEn,
      description: finalDesc,
      descriptionEn: finalDescEn,
      orderIndex: orderIndex ? parseInt(orderIndex) : undefined,
      link: link,
    };

    if (req.files && req.files.image && req.files.image[0]) {
      data.imagePath = req.files.image[0].path && req.files.image[0].path.startsWith('http') 
        ? req.files.image[0].path 
        : /uploads/ + req.files.image[0].filename;
    }

    const updated = await landingService.updateCard(id, data);
    res.json(updated);
  }

  async deleteCard(req, res) {
    const { id } = req.params;
    await landingService.deleteCard(id);
    res.json({ message: "Card deleted successfully" });
  }
}

module.exports = new LandingController();
