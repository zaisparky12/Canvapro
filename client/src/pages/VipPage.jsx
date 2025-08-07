import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

function VipPage() {
  const [email, setEmail] = useState('');
  const [paket, setPaket] = useState('bulanan');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !file) {
      toast.error('Lengkapi data!');
      return;
    }
    const formData = new FormData();
    formData.append('email', email);
    formData.append('paket', paket);
    formData.append('bukti', file);
    try {
      setLoading(true);
      await api.post('/orders', formData);
      toast.success('Submit berhasil, tunggu ACC admin');
      setEmail('');
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal submit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded p-8 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Join VIP</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="bulanan"
              checked={paket === 'bulanan'}
              onChange={() => setPaket('bulanan')}
            />
            Bulanan (Rp5.000)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="tahunan"
              checked={paket === 'tahunan'}
              onChange={() => setPaket('tahunan')}
            />
            Tahunan (Rp20.000)
          </label>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          {loading ? 'Loading...' : 'Kirim'}
        </button>
      </form>
    </div>
  );
}

export default VipPage;