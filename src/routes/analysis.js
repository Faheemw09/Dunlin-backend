const express = require("express");
const multer = require("multer");

const client = require("../config/googleClouds");

const router = express.Router();
const upload = multer();

router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = req.file.buffer.toString("utf-8");

    const document = {
      content: text,
      type: "PLAIN_TEXT",
    };

    const [sentimentResponse] = await client.analyzeSentiment({ document });
    const sentiment = sentimentResponse.documentSentiment;

    const [entitiesResponse] = await client.analyzeEntities({ document });
    const entities = entitiesResponse.entities;

    const [syntaxResponse] = await client.analyzeSyntax({ document });
    const tokens = syntaxResponse.tokens;

    const [classificationResponse] = await client.classifyText({
      document: document,
      threshold: 0.5,
    });
    const classifications = classificationResponse.categories.map(
      (category) => ({
        name: category.name.split("/").pop(),
        confidence: category.confidence,
      })
    );

    const [keywordsResponse] = await client.analyzeEntities({
      document: document,
      extractEntities: false,
      extractDocumentSentiment: false,
      extractSyntax: false,
      analyzeEntitiesRequest: {
        features: {
          extractSyntax: false,
          extractEntities: true,
          extractDocumentSentiment: false,
          classifyText: false,
        },
      },
    });
    const keywords = keywordsResponse.entities.map((entity) => entity.name);

    const analysisResult = {
      sentiment: sentiment,
      entities: entities,
      tokens: tokens,
      classifications: classifications,
      keywords: keywords,
      //   summary: summary,
    };

    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Error analyzing text:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
