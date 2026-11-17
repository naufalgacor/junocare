// ============================================================
// DATA SIMULASI LAPIS 2 — JUNOCARE
// Label: DATA SIMULASI — Bukan penilaian klinis pasien nyata
// ============================================================

export const SIMULASI_SESI_REKAMAN = [
  {
    id: 'sim-001',
    pasien: 'Sutinah (Fiktif)',
    bahasa: 'Bahasa Jawa',
    variasi: 'Jawa Ngoko (sehari-hari)',
    ujaranAsli: 'Lara nang weteng mburi, wis rong dino.',
    terjemahanLiteral: '[Padanan Bahasa Indonesia — Simulasi] Sakit di perut belakang, sudah selama dua hari.',

    // Interpretasi terstruktur — 4 kategori JUNOCARE
    interpretasiTerstruktur: {
      jawabanKonfirmasi: {
        nilai: null,
        status: 'tidak-disebutkan',
        catatan: 'Tidak diperoleh dari pernyataan ini — pasien menyampaikan keluhan, bukan menjawab ya/tidak.'
      },
      lokasiKeluhan: {
        nilai: 'Belum dapat dipastikan — perlu klarifikasi',
        status: 'perlu-klarifikasi',
        catatan: 'Makna frasa yang digunakan pasien belum dapat dipastikan sebagai lokasi anatomi secara klinis. Perawat perlu mengonfirmasi langsung.'
      },
      waktuDurasi: {
        nilai: 'Pasien menyebutkan keluhan sudah berlangsung selama dua hari.',
        status: 'teridentifikasi',
        catatan: 'Durasi disebutkan pasien. Namun waktu mulai pasti tidak dapat disimpulkan hanya dari keterangan durasi.'
      },
      statusKeluhan: {
        nilai: null,
        status: 'belum-diketahui',
        catatan: 'Pasien tidak menyebutkan apakah keluhan membaik, memburuk, atau tetap.'
      }
    },

    catatanSistem: 'Lokasi keluhan perlu dikonfirmasi karena makna frasa yang digunakan pasien belum dapat dipastikan secara klinis. Interpretasi ini adalah hasil simulasi — bukan penilaian klinis terhadap pasien nyata.',
    safetyGate: null // null = tidak ada peringatan khusus
  },
  {
    id: 'sim-002',
    pasien: 'Mbok Darmi (Fiktif)',
    bahasa: 'Bahasa Jawa',
    variasi: 'Jawa Ngoko (sehari-hari)',
    ujaranAsli: 'Ora enak mangan, banjur mual, sirahku mumet.',
    terjemahanLiteral: '[Terjemahan literal — Simulasi] Tidak nafsu makan, lalu mual, kepala saya pusing.',

    interpretasiTerstruktur: {
      jawabanKonfirmasi: {
        nilai: null,
        status: 'tidak-disebutkan',
        catatan: 'Pasien menyampaikan beberapa keluhan sekaligus, bukan menjawab ya/tidak.'
      },
      lokasiKeluhan: {
        nilai: 'Kepala (disebutkan pasien)',
        status: 'teridentifikasi',
        catatan: 'Pasien menyebutkan kepala. Konfirmasi tetap diperlukan untuk memastikan pemahaman yang tepat.'
      },
      waktuDurasi: {
        nilai: null,
        status: 'tidak-disebutkan',
        catatan: 'Pasien tidak menyebutkan durasi atau waktu mulai keluhan.'
      },
      statusKeluhan: {
        nilai: null,
        status: 'belum-diketahui',
        catatan: 'Pasien tidak menyebutkan apakah keluhan membaik atau memburuk.'
      }
    },

    catatanSistem: 'Pasien menyebutkan lebih dari satu keluhan. Perawat perlu mengkaji setiap keluhan secara terpisah untuk mendapatkan informasi yang lengkap.',
    safetyGate: {
      tipe: 'warning',
      pesan: 'Pasien menyebutkan lebih dari satu keluhan sekaligus.',
      saran: 'Lakukan pengkajian satu per satu untuk setiap keluhan agar informasi lebih terstruktur.'
    }
  },
  {
    id: 'sim-003',
    pasien: 'Pak Suroso (Fiktif)',
    bahasa: 'Bahasa Sunda',
    variasi: 'Sunda Lemes (halus)',
    ujaranAsli: '[Audio tidak dapat dikenali dengan baik]',
    terjemahanLiteral: null,

    interpretasiTerstruktur: null, // Gagal — safety gate aktif

    catatanSistem: null,
    safetyGate: {
      tipe: 'danger',
      pesan: 'Suara tidak dapat dikenali oleh sistem.',
      saran: 'Coba rekam ulang di lingkungan yang lebih tenang, atau gunakan komunikasi manual / bantuan penerjemah.'
    }
  }
]

export const STATUS_LABEL = {
  'teridentifikasi':      { label: 'Teridentifikasi',        warna: '#176B61', bg: '#EAF4F2' },
  'perlu-klarifikasi':    { label: 'Perlu Klarifikasi',      warna: '#D69A36', bg: '#FFF8EC' },
  'tidak-disebutkan':     { label: 'Tidak Disebutkan',       warna: '#94A3B8', bg: '#F1F5F9' },
  'belum-diketahui':      { label: 'Belum Diketahui',        warna: '#94A3B8', bg: '#F1F5F9' },
  'ambigu':               { label: 'Ambigu — Perlu Periksa', warna: '#C0392B', bg: '#FDECEA' },
  'terkonfirmasi-perawat':{ label: 'Terkonfirmasi Perawat',  warna: '#176B61', bg: '#D1FAE5' },
  'memerlukan-klarifikasi':{ label: 'Memerlukan Klarifikasi',warna: '#2563EB', bg: '#EEF2FF' },
  'belum-jelas':          { label: 'Belum Jelas',            warna: '#D69A36', bg: '#FFF8EC' },
  'dikoreksi-perawat':    { label: 'Dikoreksi Perawat',      warna: '#7C3AED', bg: '#F5F3FF' },
}

