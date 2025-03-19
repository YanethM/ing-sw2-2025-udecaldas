const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signUp = async (req, res) => {
  let { fullname, email, current_password } = req.body;
  console.log(req.body);

  if (email) {
    email = email.toLowerCase().trim();
  }

  // Validate null/empty field
  if (!fullname || !email || !current_password) {
    return res.status(400).json({
      message: "All required fields: fullname, email and password",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  if (current_password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characteres long",
    });
  }

  try {
    const existinguser = await prisma.users.findUnique({
      where: { email },
    });

    // En caso de que encuentre el correo electrónico en la BD
    // El usuario ya existe
    if (existinguser) {
      return res.status(400).json({
        message: "Email allready registered",
      });
    }

    const hashedPassword = await bcrypt.hash(current_password, 10);
    console.log(hashedPassword);

    const user = await prisma.users.create({
      data: {
        fullname,
        email,
        current_password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfull",
      user,
    });
  } catch (error) {
    console.log("Error details:", error);

    res.status(500).json({
      message: "User was not created",
      error,
    });
  }
};

const signIn = async (req, res) => {
  let { email, current_password } = req.body;
  console.log(req.body);

  if (email) {
    email = email.toLowerCase().trim();
  }

  // Validate null/empty field
  if (!email || !current_password) {
    return res.status(400).json({
      message: "Both fields are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  try {
    const findUser = await prisma.users.findUnique({
      where: { email },
    });

    // Verify user exists
    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validatePassword = await bcrypt.compare(
      current_password,
      findUser.current_password
    );

    if (!validatePassword) {
      return res.status(400).json({
        message: "Password doesn't match",
      });
    }

    const token = jwt.sign(
      {
        id: findUser.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(200).json({
      message: "Login successfull",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};

module.exports = {
  signUp,
  signIn,
};
