const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json()); // ให้ Express อ่าน JSON ได้
app.use(cors()); // อนุญาตให้ React (หน้าบ้าน) เชื่อมต่อได้

// ตัวแปรสมมติแทน Database (ในงานจริงให้ใช้ MySQL/MongoDB ที่คุยกันก่อนหน้า)
const users = [];
const SECRET_KEY = "my_super_secret_key"; // ใช้สำหรับสร้าง Token

// --- 1. ระบบสมัครสมาชิก (Sign Up) ---
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. เข้ารหัส Password ก่อนเก็บ
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. เก็บลง "Database" (ตัวแปร users)
    users.push({ email, password: hashedPassword });

    res.status(201).send({ message: "สมัครสมาชิกสำเร็จ!" });
  } catch (err) {
    res.status(500).send({ message: "เกิดข้อผิดพลาด" });
  }
});

// --- 2. ระบบเข้าสู่ระบบ (Sign In) ---
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // 1. ค้นหา User จาก Email
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).send({ message: "ไม่พบผู้ใช้งาน" });

  // 2. ตรวจสอบรหัสผ่าน (เทียบรหัสสด กับ รหัสที่ Hash ใน DB)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send({ message: "รหัสผ่านไม่ถูกต้อง" });

  // 3. สร้าง JWT Token ส่งกลับไปให้หน้าบ้าน (React) เก็บไว้
  const token = jwt.sign({ email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ message: "ล็อกอินสำเร็จ", token });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
