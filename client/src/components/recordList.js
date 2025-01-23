import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Record = (props) => (
  <tr>
    <td>{props.record.title}</td>
    <td>{props.record.info}</td>
    <td>
      <Link className="btn btn-info me-2" to={`/edit/${props.record._id}`}>
        Edit
      </Link>
      <button
        className="btn btn-danger"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getRecords() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token Received in Dashboard page:", token);

        const userid = localStorage.getItem("userid");

        const response = await fetch(`http://localhost:1000/recordsbyuserid/${userid}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);

          if (response.status === 401) {
            navigate("/login");
          }

          return;
        }

        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    }

    getRecords();
  }, [navigate]);

  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:1000/records/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }

  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    ));
  }

  return (
    <div className="container mt-4">
      <h3>Record List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Info</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );
};

export default RecordList;
