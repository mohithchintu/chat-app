import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5002/api/users/register",
        {
          email,
          password,
          username,
          description,
          skills: skills.split(","),
          interests: interests.split(","),
        }
      );
      alert("Registration successful!");
      login(response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error during registration");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Interests (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
