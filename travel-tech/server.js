const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let favorites = [];

// GET - veure favorites
app.get("/favorites", (req, res) => {
    res.status(200).json(favorites);
});

// POST - afegir favorit
app.post("/favorites", (req, res) => {
    const { country, capital, region, population, flag } = req.body;

    if (!country) {
        return res.status(400).json({
            error: "El camp country és obligatori"
        });
    }

    const exists = favorites.find(
        f => f.country.toLowerCase() === country.toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            error: "Aquesta destinació ja està guardada"
        });
    }

    const newFavorite = {
        id: Date.now(),
        country,
        capital: capital || "No disponible",
        region: region || "No disponible",
        population: population || 0,
        flag: flag || ""
    };

    favorites.push(newFavorite);
    res.status(201).json(newFavorite);
});

// DELETE - eliminar favorit
app.delete("/favorites/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const exists = favorites.find(f => f.id === id);

    if (!exists) {
        return res.status(404).json({
            error: "Destinació no trobada"
        });
    }

    favorites = favorites.filter(f => f.id !== id);

    res.status(200).json({
        message: "Destinació eliminada correctament"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor executant-se a http://localhost:${PORT}`);
});