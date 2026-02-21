import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    birthday: "",
    gender: ""
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        if (data.session?.token) {
          localStorage.setItem("sessionToken", data.session.token);
        }
        router.push("/");
      } else {
        setErrors(data.errors || [{ message: data.message || "Signup failed" }]);
      }
    } catch (error) {
      setErrors([{ message: "Network error. Check if API is running." }]);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <Head>
        <title>Sign Up - ECS</title>
      </Head>

      <h1>Create Account</h1>
      
      {errors.length > 0 && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          {errors.map((error, index) => (
            <div key={index}>{error.message || error}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Birthday *</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
          <small>You must be at least 13 years old</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Gender (Optional)</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Prefer not to say</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            background: "#007bff", 
            color: "white", 
            border: "none",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <a href="/login" style={{ color: "#007bff" }}>
          Already have an account? Login
        </a>
      </div>
    </div>
  );
}