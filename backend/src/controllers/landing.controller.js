const landingService = require("../services/landing.service");
const translationService = require("../services/translation.service");

class LandingController {
  async getCards(req, res) {
    const cards = await landingService.getAllCards();
    res.json(cards);
  }

  async translateContent(req, res) {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Faltan datos para traducir." });
    }
    try {
      const translated = await translationService.translateText(title, description);
      res.json(translated);
    } catch (error) {
      res.status(500).json({ error: "No se pudo generar la traducción. Inténtalo nuevamente." });
    }
  }

  async createCard(req, res) {
    let imagePath = null;
    if (req.files && req.files.image && req.files.image[0]) {
      imagePath = req.files.image[0].path && req.files.image[0].path.startsWith('http') 
        ? req.files.image[0].path 
        : '/uploads/' + req.files.image[0].filename;
    }

    const { layer, orderIndex, link, titleEs, titleEn, descriptionEs, descriptionEn, title, description } = req.body;
    
    const data = {
      layer: layer,
      title: titleEs || title,
      titleEn: titleEn,
      description: descriptionEs || description,
      descriptionEn: descriptionEn,
      orderIndex: orderIndex ? parseInt(orderIndex) : 0,
      imagePath,
      link: link,
    };

    const newCard = await landingService.createCard(data);
    res.status(201).json(newCard);
  }

  async updateCard(req, res) {
    const { id } = req.params;
    const { layer, orderIndex, link, titleEs, titleEn, descriptionEs, descriptionEn, title, description } = req.body;
    
    const data = {
      layer: layer,
      title: titleEs || title,
      titleEn: titleEn,
      description: descriptionEs || description,
      descriptionEn: descriptionEn,
      orderIndex: orderIndex ? parseInt(orderIndex) : undefined,
      link: link,
    };

    if (req.files && req.files.image && req.files.image[0]) {
      data.imagePath = req.files.image[0].path && req.files.image[0].path.startsWith('http') 
        ? req.files.image[0].path 
        : '/uploads/' + req.files.image[0].filename;
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
