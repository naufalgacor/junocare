// Data dummy realistis untuk demonstrasi JUNOCARE
// Label: Data Ilustrasi — belum tervalidasi secara klinis

export const BAHASA_TERSEDIA = [
  {
    id: 'id',
    nama: 'Bahasa Indonesia',
    icon: '🇮🇩',
    variasi: [],
    tersedia: true
  },
  {
    id: 'jv',
    nama: 'Bahasa Jawa',
    icon: '🏛️',
    variasi: [
      { id: 'jv-ngoko', nama: 'Jawa Ngoko (sehari-hari)' },
      { id: 'jv-kromo', nama: 'Jawa Kromo (halus)' },
      { id: 'jv-kromo-inggil', nama: 'Jawa Kromo Inggil (sangat halus)' }
    ],
    tersedia: true
  },
  {
    id: 'su',
    nama: 'Bahasa Sunda',
    icon: '🌋',
    variasi: [
      { id: 'su-lemes', nama: 'Sunda Lemes (halus)' },
      { id: 'su-kasar', nama: 'Sunda Kasép/Loma (sehari-hari)' }
    ],
    tersedia: true
  },
  {
    id: 'mad',
    nama: 'Bahasa Madura',
    icon: '🏝️',
    variasi: [],
    tersedia: false,
    keterangan: 'Dalam pengembangan'
  },
  {
    id: 'min',
    nama: 'Bahasa Minangkabau',
    icon: '🏔️',
    variasi: [],
    tersedia: false,
    keterangan: 'Dalam pengembangan'
  }
]

export const KATEGORI_MATERI = [
  {
    id: 'pengkajian-keluhan',
    nama: 'Pengkajian Keluhan',
    deskripsi: 'Pertanyaan untuk mengkaji keluhan pasien',
    icon: 'complaint',
    warna: '#176B61',
    jumlahMateri: 12
  },
  {
    id: 'pemeriksaan',
    nama: 'Pemeriksaan',
    deskripsi: 'Instruksi untuk prosedur pemeriksaan fisik',
    icon: 'exam',
    warna: '#2563EB',
    jumlahMateri: 8
  },
  {
    id: 'informasi-obat',
    nama: 'Informasi Obat',
    deskripsi: 'Penjelasan mengenai penggunaan obat',
    icon: 'medicine',
    warna: '#7C3AED',
    jumlahMateri: 10
  },
  {
    id: 'edukasi-kesehatan',
    nama: 'Edukasi Kesehatan',
    deskripsi: 'Informasi dan edukasi kesehatan pasien',
    icon: 'education',
    warna: '#059669',
    jumlahMateri: 9
  },
  {
    id: 'persetujuan-tindakan',
    nama: 'Persetujuan Tindakan',
    deskripsi: 'Penjelasan dan persetujuan tindakan medis',
    icon: 'consent',
    warna: '#D69A36',
    jumlahMateri: 5,
    berisiko: true,
    peringatan: 'Materi ini berkaitan dengan tindakan berisiko tinggi. Keterlibatan tenaga kesehatan atau penerjemah kompeten tetap diperlukan.'
  }
]

export const DAFTAR_KALIMAT = {
  'pengkajian-keluhan': [
    {
      id: 'pk-001',
      kategori: 'pengkajian-keluhan',
      judul: 'Menanyakan lokasi nyeri',
      indonesiaText: 'Di bagian tubuh mana Anda merasakan nyeri?',
      jawaText: 'Ing bagean awak endi sing krasa lara?',
      sundasText: 'Di bagian awak mana nu karasa nyeri?',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Nyeri', 'Lokasi']
    },
    {
      id: 'pk-002',
      kategori: 'pengkajian-keluhan',
      judul: 'Menanyakan skala nyeri',
      indonesiaText: 'Seberapa kuat rasa nyeri yang Anda rasakan? Angka 1 berarti sedikit nyeri, angka 10 berarti sangat nyeri.',
      jawaText: 'Pira kuwate rasa lara sing sampeyan rasakake? Angka 1 tegese sithik lara, angka 10 tegese banget lara.',
      sundasText: 'Sabaraha kuatna nyeri nu karasakeun? Angka 1 hartina rada nyeri, angka 10 hartina pisan nyeri.',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Nyeri', 'Skala']
    },
    {
      id: 'pk-003',
      kategori: 'pengkajian-keluhan',
      judul: 'Menanyakan durasi nyeri',
      indonesiaText: 'Sudah berapa lama Anda merasakan nyeri ini?',
      jawaText: 'Wis pira suwe sampeyan ngrasakake lara iki?',
      sundasText: 'Geus sabaraha lila anjeun ngarasakeun nyeri ieu?',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Nyeri', 'Durasi']
    },
    {
      id: 'pk-004',
      kategori: 'pengkajian-keluhan',
      judul: 'Menanyakan sifat nyeri',
      indonesiaText: 'Bagaimana sifat nyerinya? Apakah terasa seperti ditusuk, ditekan, atau berdenyut?',
      jawaText: 'Kepriye sipate larane? Apa kaya dicucuk, diuntu, utawa glayoran?',
      sundasText: 'Kumaha sipat nyerina? Naha karasana siga ditusuk, ditekan, atanapi ngadenyut?',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Nyeri', 'Sifat']
    },
    {
      id: 'pk-005',
      kategori: 'pengkajian-keluhan',
      judul: 'Menanyakan faktor pemicu',
      indonesiaText: 'Apakah ada yang membuat nyeri semakin parah atau berkurang?',
      jawaText: 'Apa ana sing gawe larane tambah parah utawa suda?',
      sundasText: 'Naha aya nu ngajantenkeun nyeri beuki parah atanapi ngirangan?',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '15 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Nyeri', 'Faktor Pemicu']
    },
    {
      id: 'pk-006',
      kategori: 'pengkajian-keluhan',
      judul: 'Menanyakan keluhan utama',
      indonesiaText: 'Apa yang membuat Anda datang ke fasilitas kesehatan hari ini?',
      jawaText: 'Apa sing gawe sampeyan mara nang kene dina iki?',
      sundasText: 'Naon anu ngajantenkeun anjeun sumping ka tempat kasehatan dinten ieu?',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '15 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Keluhan', 'Utama']
    }
  ],
  'pemeriksaan': [
    {
      id: 'pm-001',
      kategori: 'pemeriksaan',
      judul: 'Instruksi buka mulut',
      indonesiaText: 'Silakan buka mulut Anda lebar-lebar dan katakan "aah".',
      jawaText: 'Mangga mbukak cangkem sampeyan amba-amba lan ucapake "aah".',
      sundasText: 'Mangga buka sungut anjeun lega-lega teras ucapkeun "aah".',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Pemeriksaan', 'Mulut']
    },
    {
      id: 'pm-002',
      kategori: 'pemeriksaan',
      judul: 'Instruksi tarik napas',
      indonesiaText: 'Tolong tarik napas dalam-dalam, lalu tahan sebentar, kemudian hembuskan perlahan.',
      jawaText: 'Mangga narik ambegan jero-jero, banjur tahan sedhela, terus kecolekake alon-alon.',
      sundasText: 'Punten narik napas jero-jero, teras tahan sakedap, teras eler-elerkeun.',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Pemeriksaan', 'Napas']
    }
  ],
  'informasi-obat': [
    {
      id: 'io-001',
      kategori: 'informasi-obat',
      judul: 'Cara minum obat',
      indonesiaText: 'Obat ini diminum tiga kali sehari, sesudah makan.',
      jawaText: 'Obat iki diunum telu kali sehari, sak wise mangan.',
      sundasText: 'Obat ieu dileueut tilu kali sadinten, saatos tuang.',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Obat', 'Dosis']
    },
    {
      id: 'io-002',
      kategori: 'informasi-obat',
      judul: 'Efek samping obat',
      indonesiaText: 'Obat ini mungkin menyebabkan rasa kantuk. Jangan mengemudi setelah meminum obat ini.',
      jawaText: 'Obat iki bisa nggawe ngantuk. Aja nyetir sawise ngombé obat iki.',
      sundasText: 'Obat ieu tiasa ngajantenkeun seubeuh. Ulah nyetir saatos ngaleueut obat ieu.',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Obat', 'Efek Samping']
    }
  ],
  'edukasi-kesehatan': [
    {
      id: 'ek-001',
      kategori: 'edukasi-kesehatan',
      judul: 'Anjuran minum air',
      indonesiaText: 'Minumlah air putih minimal 8 gelas sehari untuk menjaga kesehatan tubuh Anda.',
      jawaText: 'Ngombea banyu putih minimal 8 gelas sedina kanggo njaga kesehatan awakmu.',
      sundasText: 'Leueut cai bodas minimal 8 gelas sadinten pikeun ngajaga kasehatan awak anjeun.',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'tervalidasi', tanggal: '12 Mar 2028', oleh: 'Tim Klinis RSUD' },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      tag: ['Edukasi', 'Hidrasi']
    }
  ],
  'persetujuan-tindakan': [
    {
      id: 'pt-001',
      kategori: 'persetujuan-tindakan',
      judul: 'Penjelasan prosedur pengambilan darah',
      indonesiaText: 'Kami perlu mengambil sampel darah Anda untuk pemeriksaan laboratorium. Prosedur ini membutuhkan waktu sekitar 5 menit.',
      jawaText: 'Kita kudu njupuk conto getih sampeyan kanggo pemeriksaan laboratorium. Prosedur iki butuh waktu kira-kira 5 menit.',
      sundasText: 'Kami kedah nyandak conto getih anjeun pikeun pamariksaan laboratorium. Prosedur ieu peryogi waktos kira-kira 5 menit.',
      audioInfo: 'Penutur asli: Perawat bersertifikat bahasa Jawa',
      validasi: { status: 'perlu-tinjauan', tanggal: null, oleh: null },
      catatan: 'Kalimat ilustrasi — belum divalidasi secara klinis',
      berisiko: true,
      peringatan: 'Keterlibatan tenaga kesehatan atau penerjemah kompeten tetap diperlukan untuk tindakan ini.',
      tag: ['Persetujuan', 'Lab', 'Darah']
    }
  ]
}

export const ANTREAN_PASIEN = [
  { id: 'P001', nama: 'Sutinah', usia: 68, nomorAntrean: 'A-01', keluhan: 'Nyeri lutut', bahasa: 'Jawa', status: 'menunggu' },
  { id: 'P002', nama: 'Mbok Darmi', usia: 72, nomorAntrean: 'A-02', keluhan: 'Sesak napas', bahasa: 'Jawa', status: 'menunggu' },
  { id: 'P003', nama: 'Pak Suroso', usia: 55, nomorAntrean: 'A-03', keluhan: 'Pusing', bahasa: 'Sunda', status: 'menunggu' }
]

export const CONTOH_HASIL_TRANSKRIPSI = [
  {
    id: 'tr-001',
    teksTranskripsi: 'Lara nang weteng mburi, wis rong dino',
    interpretasi: 'Nyeri di bagian perut belakang, sudah dua hari',
    kategoriMaksud: 'Lokasi dan Durasi Nyeri',
    skorKeyakinan: 87,
    statusHasil: 'perlu-konfirmasi'
  },
  {
    id: 'tr-002',
    teksTranskripsi: 'Ora enak mangan, banjur mual',
    interpretasi: 'Tidak nafsu makan dan mual',
    kategoriMaksud: 'Keluhan Pencernaan',
    skorKeyakinan: 92,
    statusHasil: 'perlu-konfirmasi'
  }
]

export const getMateriById = (id) => {
  for (const kategori of Object.values(DAFTAR_KALIMAT)) {
    const item = kategori.find(k => k.id === id)
    if (item) return item
  }
  return null
}

export const getKalimatByKategori = (kategoriId) => {
  return DAFTAR_KALIMAT[kategoriId] || []
}

