const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");

// GET /pokemon - return a page with favorited Pokemon
router.get("/", function (req, res) {
  // TODO: Get all records from the DB and render to view
  db.pokemon.findAll().then((favoritePokemon) => {
    console.log(favoritePokemon);
    res.render("favorites.ejs", { favorites: favoritePokemon });
  });
  //res.send("Render a page of favorites here");
});

router.get("/:id", (req, res) => {
  const pokemonUrl = `http://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  axios.get(pokemonUrl).then(function (apiResponse) {
    console.log(apiResponse.data);
    res.render("show.ejs", { data: apiResponse.data });
  });
  //res.send("Test");
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post("/", function (req, res) {
  let pokemonName = req.body.name;
  console.log(pokemonName);
  db.pokemon
    .findOrCreate({
      where: {
        name: pokemonName,
      },
      defaults: {
        name: pokemonName,
      },
    })
    .then(([createdPokemon, hasBeenCreated]) => {
      console.log("Pokemon added:", createdPokemon);
      console.log("Was added?:", hasBeenCreated);
      res.redirect("/pokemon");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
