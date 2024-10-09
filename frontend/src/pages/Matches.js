import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [mutualMatches, setMutualMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/matches/${user._id}`
        );
        setMatches(response.data);

        // Prepare mutual match statuses
        const mutualMatchStatus = {};
        await Promise.all(
          response.data.map(async (match) => {
            const isMutual = await checkMutualMatch(match._id);
            mutualMatchStatus[match._id] = isMutual;
          })
        );
        setMutualMatches(mutualMatchStatus);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchMatches();
  }, [user]);

  const checkMutualMatch = async (otherUserId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/matches/check",
        {
          uid1: user._id,
          uid2: otherUserId,
        }
      );
      if (response.data.match === false) return response.data.match;
      else return true;
    } catch (err) {
      console.error(err);
      return false; // Return false if there's an error
    }
  };

  const handleChat = (chatid) => {
    window.location.href = `/chat/${chatid}`; // Redirect to the chat page
  };

  // Show loading state while fetching matches
  if (loading) {
    return <div>Loading...</div>; // You can style this as needed
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div key={match._id} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold">{match.username}</h2>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() =>
                mutualMatches[match._id] ? handleChat(match._id) : null
              }
            >
              {mutualMatches[match._id] ? "Chat" : "Pending"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
