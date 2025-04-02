const express = require("express");
const router = express.Router();
const authRoutes = require("./AuthRoutes");
const usersRoutes = require("./UsersRoutes");

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

module.exports = router;
