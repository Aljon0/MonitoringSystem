import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path as needed
import { notifyError } from "../general/CustomToast";
import "./UserTable.css"; // Optional: For styling the table

export const UserTable = () => {
  const [change, setChange] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setChange(false);
    setLoading(true);
    try {
      const usersCollection = collection(db, "Users");
      const userSnapshot = await getDocs(usersCollection);

      console.log("Fetched documents:", userSnapshot.docs); // Debugging log

      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch user data.");
      notifyError("Failed to fetch user data.");
      setLoading(false);
    }
  };
  // Fetch users from Firestore
  useEffect(() => {
    fetchUsers();
  }, [change]);
 
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-table-container">
      <h2>Registered Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.middleName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;