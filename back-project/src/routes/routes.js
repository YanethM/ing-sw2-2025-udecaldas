const express = require("express");
const router = express.Router();
const authRoutes = require("./AuthRoutes");
const usersRoutes = require("./UsersRoutes");
const pokemonRoutes = require("./PokemonRoutes");

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/pokemons", pokemonRoutes);

module.exports = router;
