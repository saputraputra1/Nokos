import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const app = express();
app.use(express.json());

const API_KEY = process.env.GOGETSMS_API_KEY;
const PORT = 3000;

// Ambil harga dari file lokal (markup kamu)
app.get('/api/harga', (req, res) => {
  try {
    const data = fs.readFileSync('harga.json', 'utf-8');
    const json = JSON.parse(data);
    res.json({ success: true, harga: json });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal baca harga.json' });
  }
});

// Ambil harga asli dari GoGetSMS
app.get('/api/gogetsms/prices', async (req, res) => {
  try {
    const { data } = await axios.get(`https://www.gogetsms.com/handler_api.php`, {
      params: {
        api_key: API_KEY,
        action: 'getPrices'
      }
    });

    res.send(data); // format teks mentah: SERVICE:COUNTRY:PRICE
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal ambil harga dari GoGetSMS' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server Nokos jalan di http://localhost:${PORT}`);
});
