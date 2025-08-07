import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

function ContactPage() {
  const [setting, setSetting] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    api.get('/settings').then((res) => setSetting(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    toast.success('Pesan terkirim (simulasi)');
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Kontak Kami</h1>
      {setting && (
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <p>Admin: {setting.admin_contact || '-'}</p>
          {setting.qris_url && <img src={setting.qris_url} alt="QRIS" className="w-40 mt-2" />}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nama"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Pesan"
          rows="4"
          value={form.message}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded">Kirim</button>
      </form>
    </div>
  );
}

export default ContactPage;