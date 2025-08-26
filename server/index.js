const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://loaclhost:5173",
    Credential: true
}))

// test route
app.get("/", (req,res) => {
    res.send("Server is running ✅")
})

app.listen(4000, () => console.log("Server running on http://localhost:4000"))

// server setup finished *************************************************


const jwt = require("jsonwebtoken")

// secret keys jo normally env file me hota hai.
const ACCESS_SECRET = "my_access_secret" // short expiry token ke liye
const REFRESH_SECRET = "my_refresh_secret" // long expiry toke ke liye

// dummy user (abhi DB nahi use kar rahe , bas demo ke liye)
const USER = {
    id:1,
    email: "user@test.com",
    password: "Test@123" // real project me hashed password use hota hai (bcrypt)
}
