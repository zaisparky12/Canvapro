import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

function LandingPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
    const interval = setInterval(fetchMembers, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMembers() {
    try {
      const res = await api.get('/stats/latest');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col justify-center items-center p-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-center"
        >
          Canva Pro ID – Tim Canva Pro Murah!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 max-w-xl text-center text-lg"
        >
          Bergabunglah dengan tim Canva Pro kami secara Gratis atau Upgrade ke VIP untuk benefit lebih.
        </motion.p>
        <div className="flex gap-4">
          <Link to="/teams" className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-semibold shadow hover:shadow-lg transition">
            Gabung Tim Gratis
          </Link>
          <Link to="/vip" className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold shadow hover:shadow-lg transition">
            Join VIP
          </Link>
        </div>
      </section>

      {/* Latest members */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-center">Member Terbaru</h2>
        <div className="max-w-lg mx-auto grid grid-cols-1 gap-2">
          {members.map((m) => (
            <div key={m.id} className="bg-white p-3 rounded shadow flex justify-between">
              <span>{m.email}</span>
              <span className="text-sm text-gray-500">{new Date(m.joined_at).toLocaleDateString()}</span>
            </div>
          ))}
          {members.length === 0 && <p className="text-center text-sm text-gray-500">Belum ada data.</p>}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;