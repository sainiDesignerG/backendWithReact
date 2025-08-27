const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    Credential: true,
  })
);

// test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));

// server setup finished *************************************************

const jwt = require("jsonwebtoken");

// secret keys jo normally env file me hota hai.
const ACCESS_SECRET = "my_access_secret"; // short expiry token ke liye
const REFRESH_SECRET = "my_refresh_secret"; // long expiry toke ke liye

// dummy user (abhi DB nahi use kar rahe , bas demo ke liye)
const USER = {
  id: 1,
  email: "user@test.com",
  password: "password123", // real project me hashed password use hota hai (bcrypt)
};

// 🟢 LOGIN ROUTE

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body; // user se aaya data

  // step 1: check karo ki email/password shi hai ya nahi
  if (email !== USER.email || password !== USER.password) {
    return res.status(401).json({ message: "Invalid credentials ❌" });
  }

  // step 2: Agar sahi hai to Access Token banate hain
  const accessToken = jwt.sign(
    { id: USER.id, email: USER.email }, // payload
    ACCESS_SECRET, // secret key
    { expiresIn: "15m" } // access token short expiry
  );
  // step 3: refresh Token banate hain
  const refreshToken = jwt.sign(
    { id: USER.id, email: USER.email },
    REFRESH_SECRET,
    { expiresIn: "7d" } // refresh token lamba expire hota hai
  );

  // step 4: Refresh token ko cookie me bhejna (httponly for security)
  res.cookie("refreshTOken", refreshToken, {
    httpOnly: true, // JS se accessible nahi hoga (XSS safe)
    secure: false, // dev ke liye false (prod me true with HTTPS)
    sameSite: "lax", // CSRF attack se bachne ke liye
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });

  // step 5: Access toke ko response me bhejna (frontend isko store karega)
  res.json({
    message: "Login successful ✅",
    accessToken,
  });
});

// 🟢 Middleware to verify Access Token
function authenticateAccessToken(req, res, next) {
  // Header se token nikalna (frontend "Authorization: Bearer <token>" bhejta hai)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access token missing ❌" });
  }

  // Token verify karna
  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expird token ❌" });
    }
    req.user = user; // decoded payload ko request me save karte hain
    next(); // agle step me jao
  });
}

// 🟢 Protected Route (sirf token sahi hone par chalega)
app.get("/api/profile", authenticateAccessToken, (req, res) => {
  res.json({
    message: "Welcome to Your Profile 🎉",
    user: req.user, // yaha user info milega (id, email)
  });
});
