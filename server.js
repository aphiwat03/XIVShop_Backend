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

    // 1. ค้นหา User จาก Email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งานนี้ในระบบ" });
    }

    // 2. ตรวจสอบรหัสผ่าน (ถ้าตอนสมัครใช้ bcrypt.hash ตอนเช็คต้องใช้ bcrypt.compare)
    // สมมติว่าตอนนี้ใน SQL คุณยังเป็นรหัสผ่านตัวธรรมดา ให้เช็คแบบตรงๆ ไปก่อน
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // 3. ถ้าผ่านหมด
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
