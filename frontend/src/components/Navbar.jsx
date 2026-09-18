import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchScore = async () => {
      try {
        const { data } = await api.get("/tasks/stats");
        setScore(data.score);
      } catch {
        // Non-critical - silently skip if the score can't be loaded.
      }
    };
    fetchScore();
    // Refresh whenever the route changes (e.g. coming back from the
    // dashboard after completing a task) so the score stays current.
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-brand-dark text-white">
      <span className="font-semibold text-lg">Task Manager</span>
      {user && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/stats")}
            className="flex items-center gap-2 text-sm text-brand-mint hover:text-white transition"
          >
            <span className="underline underline-offset-2">{user.name}</span>
            {score !== null && (
              <span className="bg-brand-teal text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {score} pts
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-brand-teal hover:bg-brand-green px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
