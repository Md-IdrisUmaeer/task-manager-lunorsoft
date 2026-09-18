import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const StatCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-lg shadow p-5 text-center">
    <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
  </div>
);

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/tasks/stats");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Your Stats</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading stats...</p>
      ) : stats ? (
        <>
          <div className="bg-brand-dark text-white rounded-xl shadow p-6 text-center mb-6">
            <p className="text-sm uppercase tracking-wide text-brand-mint">Overall Score</p>
            <p className="text-4xl font-bold mt-1">{stats.score}</p>
            <p className="text-xs text-brand-mint mt-2">+5 per completed task, -3 per not completed task</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total Tasks" value={stats.total} accent="text-brand-dark" />
            <StatCard label="Completed" value={stats.completed} accent="text-brand-green" />
            <StatCard label="Due" value={stats.due} accent="text-brand-teal" />
            <StatCard label="Not Completed" value={stats.notCompleted} accent="text-red-600" />
          </div>
        </>
      ) : null}

      <button
        onClick={() => navigate("/")}
        className="w-full mt-8 bg-brand-dark text-white py-2 rounded-md hover:bg-brand-teal transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default UserStats;
