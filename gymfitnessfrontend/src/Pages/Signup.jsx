import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // Go to login
  const goToLogin = () => navigate("/");

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.country ||
      !formData.password ||
      !formData.password2
    ) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
      } else {
        alert("Signup successful!");
        navigate("/"); // redirect to login
      }

    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='LoginMainDiv'>
      <div className='InnerDiv'>
        <div className='LeftSide'>
          <img alt="Pic here" />
        </div>

        <div className="RightSide">
          <img alt="Logo Here" />
          <h1>Sign Up</h1>

          {error && (
            <p style={{ color: "red", fontSize: 14, marginBottom: 10 }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="InputFeilds">

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="country"
              placeholder="Enter Country"
              value={formData.country}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password2"
              placeholder="Re Enter Password"
              value={formData.password2}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className='SignUpText'>
            <h4>
              Already have an Account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); goToLogin(); }}>Login</a>
            </h4>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;