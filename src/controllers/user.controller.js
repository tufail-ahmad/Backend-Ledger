const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/user.service");

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await userService.register(username, email, password);
  res.status(201).json({ message: "User registered successfully", data: user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await userService.login(
    email,
    password,
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res
    .status(200)
    .json({ message: "Login successful", accessToken, data: user });
});
