# Canva Pro ID

Full-stack application untuk berbagi **tim Canva Pro murah**. Project terdiri dari:

* **/client** – React, Vite, TailwindCSS, Axios, React-Toastify, React Router
* **/server** – Express.js, Sequelize, MySQL, Nodemailer, Multer

## Fitur Singkat

1. Landing Page modern + animasi scroll
2. Join Tim Gratis (limit 1 klik/user, 100 klik/tim)
3. Join VIP (upload bukti transfer, admin ACC manual)  
   • Email otomatis berisi link tim setelah disetujui
4. Kontak & informasi admin (QRIS / rekening)  
   • Form pesan (dummy)
5. Live list 10 member terakhir (polling 10 detik)
6. Dashboard Admin (API) – CRUD Tim, Order, Setting, Statistik

---

## Prasyarat

* Node.js ≥ 18
* MySQL ≥ 8 (atau compatible)

---

## Konfigurasi Environment

### Backend – `/server/.env`

```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpass
DB_NAME=canva_pro_id
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourpass
ADMIN_PASSWORD=sandiadminmu
```

Contoh tersedia di `.env.example`.

### Frontend – `/client/.env`

```bash
VITE_API_URL=http://localhost:5000/api
```

Contoh tersedia di `.env.example`.

---

## Cara Menjalankan Lokal

### 1. Clone & install
```bash
git clone <repo>
cd canva-pro-id
```

### 2. Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev      # nodemon, port 5000
```
Sequelize akan otomatis `sync()` dan membuat tabel sesuai model.

### 3. Frontend
```bash
cd ../client
cp .env.example .env
npm install
npm run dev      # Vite, port 5173
```
Aplikasi kini bisa diakses di `http://localhost:5173`.

---

## Deploy

### Frontend (Vercel)
1. `vercel init` (atau import repo melalui dashboard) – pilih `/client` sebagai root.  
2. Environment variable `VITE_API_URL` arahkan ke URL backend produksi.  
3. Build command: `npm run build`, Output dir: `dist`.

### Backend (Railway)
1. Buat proyek Railway → **New > From Repo** → pilih folder `/server` sebagai root.  
2. Tambahkan variabel env sama seperti `.env`.  
3. Tambahkan database MySQL plugin atau sambungkan ke database eksternal.  
4. Deploy.

Railway otomatis menjalankan `npm start` (script sudah tersedia).  Jika menggunakan VPS:

```bash
# di server
ssh user@vps
sudo apt install git node npm mysql pm2 -y
git clone <repo>
cd server
cp .env.example .env    # sesuaikan
npm install --production
pm2 start index.js --name canva-pro-id
```
Tambahkan Nginx reverse-proxy port 5000 jika diperlukan.

---

## End-Point Ringkas

| Method | Path | Keterangan |
|--------|------|-----------|
| GET | `/api/teams` | List semua tim |
| POST | `/api/teams/:id/click` | User ambil link tim |
| POST | `/api/orders` | Kirim order VIP + bukti |
| PUT | `/api/orders/:id/approve` | Admin ACC & kirim email |
| ... | ... | Lihat kode untuk lengkapnya |

---

## Lisensi

MIT © 2025 Canva Pro ID

## Deploy dengan Docker

Persiapkan file `.env` di root (digunakan oleh docker-compose untuk MySQL):

```bash
DB_PASS=yourpass
DB_NAME=canva_pro_id
```

Kemudian jalankan:

```bash
docker compose up --build -d
```

• Frontend akan tersedia di port `3000`  
• Backend API di port `5000`  
• MySQL di `localhost:3306` (user: root / pass: `DB_PASS`)

Stop container:
```bash
docker compose down
```