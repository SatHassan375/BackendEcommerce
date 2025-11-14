// src/routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  AllUsers,
  getUser,
  ChangePassword,
  DeleteAccount,
  getAllUsersAdresses,
  getUsersAdressesById,
  DeleteAdressesById,
  UpdateAdressesById,
  addAdressesById,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/allusers", AllUsers);
router.get("/user/:id", getUser);
router.post("/changePassword/:id", ChangePassword);
router.delete("/deleteAccount/:id", DeleteAccount);
router.get("/usersAddresses/", getAllUsersAdresses);
router.get("/usersAddresses/:id", getUsersAdressesById);
router.delete("/deleteAddresses/:id", DeleteAdressesById);
router.post("/addUserAddress/:id", addAdressesById);
router.patch("/updateUserAddress/:id", UpdateAdressesById);

module.exports = router;
