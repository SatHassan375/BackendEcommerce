// src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  changeUserPasswordById,
  deleteUserById,
  getUserAddressesById,
  getUserAddresses,
  deleteAddressById,
  editUserAddressesById,
  addUserAddressesById,
} = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const AllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ rows: [...users.rows], count: users.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "No User Found" });
    res.json({ rows: [...user.rows], count: user.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const ChangePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await changeUserPasswordById(user.id, hashedPassword);

    res.status(200).json({
      message: "Password updated successfully",
      rowCount: updatedUser.rowCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const DeleteAccount = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (user.rows.length === 0)
      return res.status(404).json({ message: "user not found" });
    const userDel = await deleteUserById(req.params.id);
    res.json({ message: "user deleted", userDel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllUsersAdresses = async (req, res) => {
  try {
    const addresses = await getUserAddresses();
    res.json({ message: "Addresses Fetched", addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUsersAdressesById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user.rows.length === 0)
      return res.status(404).json({ message: "user not found" });
    const addresses = await getUserAddressesById(req.params.id);
    res.json({ message: "Addresses Fetched", addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const DeleteAdressesById = async (req, res) => {
  try {
    const address = await getUserAddressesById(req.params.id);
    if (address.rows.length === 0)
      return res.status(404).json({ message: "user not found" });
    const deladdress = await deleteAddressById(req.params.id);
    res.json({ message: "Address deleted", deladdress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const UpdateAdressesById = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      is_default,
    } = req.body;

    // Only include non-null/defined fields
    const fields = {};
    if (full_name !== undefined) fields.full_name = full_name;
    if (phone !== undefined) fields.phone = phone;
    if (address_line1 !== undefined) fields.address_line1 = address_line1;
    if (address_line2 !== undefined) fields.address_line2 = address_line2;
    if (city !== undefined) fields.city = city;
    if (state !== undefined) fields.state = state;
    if (postal_code !== undefined) fields.postal_code = postal_code;
    if (is_default !== undefined) fields.is_default = is_default;

    const updatedAddress = await editUserAddressesById(req.params.id, fields);

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addAdressesById = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      country,
      city,
      state,
      postal_code,
      is_default,
    } = req.body;

    // Only include non-null/defined fields
    const fields = {};
    if (full_name !== undefined) fields.full_name = full_name;
    if (phone !== undefined) fields.phone = phone;
    if (address_line1 !== undefined) fields.address_line1 = address_line1;
    if (address_line2 !== undefined) fields.address_line2 = address_line2;
    if (country !== undefined) fields.country = country;
    if (city !== undefined) fields.city = city;
    if (state !== undefined) fields.state = state;
    if (postal_code !== undefined) fields.postal_code = postal_code;
    if (is_default !== undefined) fields.is_default = is_default;
    // res.json({
    //   message: "Address Added successfully",
    //   data: fields,
    // });
    // if (req.params.id) return;
    const updatedAddress = await addUserAddressesById(req.params.id, fields);

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
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
};
