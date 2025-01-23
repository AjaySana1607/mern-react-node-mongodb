import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      // Add your registration logic here, similar to the login component
      // Send a POST request to your registration endpoint
   
      const response = await fetch("http://localhost:1000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      // Customize the registration logic based on your backend implementation
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }
      // Registration successful
      setError(null);
      console.log("Registration successful!");

      // Redirect to login page after successful registration
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Internal Server Error");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username:
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
                <p className="mt-3 text-center">
                  Already have an account? <Link to="/">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
