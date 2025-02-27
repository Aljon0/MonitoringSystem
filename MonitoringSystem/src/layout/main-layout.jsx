import { useState } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path as needed
import { UserTable } from "../components/UserTable";
import RequirementManagement from "../components/RequirementMAnagement";
import { LoginForm } from "../components/LoginForm";
import { notifyError } from "../general/CustomToast";

export const MainLayout = () => {
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
  },[change]);

  return (
    <>
      <div className="main-layout">
        <div className="main-layout__content">
          <div className="main-layout__content--left">
            <UserTable users={users} loading={loading} error={error} />
          </div>
          <div className="main-layout__content--right">
            <RegisterForm fetchUsers={fetchUsers} setChange={setChange} />
          </div>
          <div>
            <LoginForm />
          </div>
          <div>
            <RequirementManagement />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
