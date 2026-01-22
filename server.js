const express = require("express");
const cors = require("cors");
const { User, sequelize } = require("./database.js");

const myapp = express();
const port = 5000;
const bcrypt = require("bcryptjs");
myapp.use(express.json());
myapp.use(cors());

myapp.get("/users", async (req, res) => {
  try {
    const allUsers = await User.findAll();
    res.json(allUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
});

myapp.get("/", (req, res) => {
  res.send("Server is ready! Go to /users to see data.");
});

myapp.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

myapp.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งานนี้ในระบบ" });
    }
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
    res.json({
      message: "เข้าสู่ระบบสำเร็จ!",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดที่ Server", error: err.message });
  }
});

myapp.post("/api/register", async (req, res) => {
  try {
    const { email, username, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      phone,
      role: "user",
    });

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
});
