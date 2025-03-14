const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
};

const signIn = async (req, res) => {};

module.exports = {
  signUp,
  signIn,
};
