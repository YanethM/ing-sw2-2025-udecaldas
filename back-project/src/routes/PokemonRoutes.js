const express = require("express");
const router = express.Router();

const {
  getAllPokemonsWithAbilities,
} = require("../controllers/PokemonController");

router.get("/abilities", getAllPokemonsWithAbilities);

module.exports = router;
