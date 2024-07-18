const express = require("express");


const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const analysisRouter = require("./src/routes/analysis");
app.use(express.json());
app.use(cors());

app.use("/api", analysisRouter);

app.get("/api", (req, res) => {
  console.log("GET /api hit");
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
