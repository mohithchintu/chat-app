import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const filteredUsers = response.data.filter((u) => u._id !== user._id);
        setUsers(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [user]);

  const handleMatch = async (otherUserId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/add-match/${user._id}`,
        {
          uid: otherUserId,
        }
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.uid} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p>Description: {user.description}</p>
            <p>Skills: {user.skills.join(", ")}</p>
            <p>Interests: {user.interests.join(", ")}</p>

            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => handleMatch(user._id)}
            >
              Match
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
