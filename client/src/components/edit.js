import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
  const [form, setForm] = useState({
    title: "",
    info: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const id = params.id.toString();
        const response = await fetch(`http://localhost:1000/records/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          setError(`An error has occurred: ${response.statusText}`);
          setLoading(false);
          return;
        }

        const record = await response.json();
        if (!record) {
          setError(`Record with id ${id} not found`);
          setLoading(false);
          return;
        }

        setForm(record);
        setLoading(false);
      } catch (error) {
        setError("Error fetching record");
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedPerson = {
      title: form.title,
      info: form.info,
    };

    try {
      await fetch(`http://localhost:1000/records/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(editedPerson),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/dashboard");
    } catch (error) {
      setError("Error updating record");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Update Record</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="info" className="form-label">Info:</label>
          <input
            type="text"
            className="form-control"
            id="info"
            value={form.info}
            onChange={(e) => updateForm({ info: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Record</button>
      </form>
    </div>
  );
}
