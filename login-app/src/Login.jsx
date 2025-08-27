import { useState } from "react";
import axios from "axios";

function Login() {
  // Step 1: State for Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 2: Handle form submits
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setSuccess("")

    try {
        // Step 3: Call backend API
        const res = await axios.post("http://localhost:4000/api/auth/login", {
            email, password
        })

        // step 4: save toke in loaclStorage
        localStorage.setItem("token", res.data.accessToken)

        setSuccess("Lgoin Successful")
        console.log("access token", res.data.accessToken);
        
    } catch (err) {
        setError(err.response?.data?.message || "login Failed")
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login to Your Account
        </h2>
        {error && (
            <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
        )}
        {success && (
         <p className="mb-4 text-green-400 text-sm text-center">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
