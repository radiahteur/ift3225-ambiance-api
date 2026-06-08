const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté !");
  })
  .catch((err) => {
    console.error("Erreur MongoDB :", err);
  });

app.get("/", (req, res) => {
  res.send("API fonctionne !");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Serveur lancé sur le port ${process.env.PORT || 3000}`);
});