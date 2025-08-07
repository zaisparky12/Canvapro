import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      toast.error('Gagal memuat data tim');
    }
  }

  function hasClicked(id) {
    const arr = JSON.parse(localStorage.getItem('clickedTeams') || '[]');
    return arr.includes(id);
  }

  function storeClicked(id) {
    const arr = JSON.parse(localStorage.getItem('clickedTeams') || '[]');
    if (!arr.includes(id)) {
      arr.push(id);
      localStorage.setItem('clickedTeams', JSON.stringify(arr));
    }
  }

  async function handleClick(team) {
    if (!email) {
      toast.error('Masukkan email terlebih dahulu');
      return;
    }
    if (hasClicked(team.id)) {
      toast.info('Anda sudah mengklik tim ini');
      return;
    }
    if (team.status === 'penuh' || team.click_count >= 100) {
      toast.error('Tim penuh');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post(`/teams/${team.id}/click`, null, { headers: { 'X-User-Email': email } });
      toast.success(res.data.message || 'Berhasil bergabung tim');
      storeClicked(team.id);
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Tim Gratis</h1>
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            localStorage.setItem('email', e.target.value);
          }}
          placeholder="Email anda (wajib)"
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div className="space-y-3">
        {teams.map((team) => {
          const disabled = hasClicked(team.id) || team.status === 'penuh' || team.click_count >= 100;
          return (
            <button
              key={team.id}
              onClick={() => handleClick(team)}
              disabled={loading || disabled}
              className={`w-full flex justify-between items-center px-4 py-3 rounded border ${disabled ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              <span>{team.name}</span>
              <span className="text-sm">{team.click_count}/100 {team.status === 'penuh' && '(Penuh)'}</span>
            </button>
          );
        })}
        {teams.length === 0 && <p className="text-center text-sm">Belum ada data.</p>}
      </div>
    </div>
  );
}

export default TeamsPage;