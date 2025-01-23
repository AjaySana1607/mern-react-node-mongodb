import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const [form, setForm] = useState({
    title: "",
    info: "",
    userid: "",
  });

  const navigate = useNavigate();

  // This function will handle the submission.
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the user ID from your authentication token or component state
      const userId = localStorage.getItem("userid"); // Update with your actual storage key

      // When a post request is sent to the create URL, we'll add a new record to the database.
      const response = await fetch("http://localhost:1000/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the authorization token
        },
        body: JSON.stringify({ ...form, userid: userId }), // Include the user ID in the request body
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.statusText}`;
        window.alert(errorMessage);
        return;
      }

      setForm({ title: "", info: "", userid: "" });
      navigate("/dashboard"); // Redirect to the dashboard upon successful record creation
    } catch (error) {
      console.error("Error during record creation:", error);
    }
  };

  // These methods will update the state properties.
  const updateForm = (value) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  // This following section will display the form that takes input from the user.
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="mb-4">Create New Record</h3>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="info" className="form-label">
                Info
              </label>
              <input
                type="text"
                className="form-control"
                id="info"
                value={form.info}
                onChange={(e) => updateForm({ info: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <button type="submit" className="btn btn-primary">
                Create Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
