import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SIMULASI_SESI_REKAMAN, STATUS_LABEL } from '../data/dataLapis2'
import HeaderHalaman from '../components/HeaderHalaman'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import './ScreenResponsPasien.css'

// ─── Fase alur Lapis 2 ─────────────────────────────────────
const FASE = {
  PERSETUJUAN:   'persetujuan',
  SIAP:          'siap',
  MEREKAM:       'merekam',
  MEMPROSES:     'memproses',
  TRANSKRIPSI:   'transkripsi',
  INTERPRETASI:  'interpretasi',
  PEMERIKSAAN:   'pemeriksaan',
  TERKONFIRMASI: 'terkonfirmasi',
  KLARIFIKASI:   'klarifikasi',
  MANUAL:        'manual',
}

// Sub-fase dalam PEMERIKSAAN
const SUB = {
  DEFAULT:    null,
  KOREKSI:    'koreksi',
  KLARIF_DETAIL: 'klarif-detail',
}

// Pertanyaan klarifikasi per kategori
const PERTANYAAN_KLARIFIKASI = {
  jawabanKonfirmasi: [
    'Apakah Anda merasakan nyeri? (tunjuk dengan anggukan atau gelengan)',
    'Apakah keluhan ini sudah ada sebelumnya?',
  ],
  lokasiKeluhan: [
    'Bisakah Anda menunjuk bagian tubuh yang terasa tidak nyaman?',
    'Apakah rasa tidak nyaman ada di satu tempat atau menyebar?',
  ],
  waktuDurasi: [
    'Sudah berapa lama Anda merasakan keluhan ini?',
    'Apakah keluhan muncul tiba-tiba atau bertahap?',
  ],
  statusKeluhan: [
    'Apakah saat ini terasa lebih baik, sama, atau lebih buruk dari tadi?',
    'Apakah ada yang membuat keluhan memburuk atau membaik?',
  ],
}

// Label nama kategori
const NAMA_KATEGORI = {
  jawabanKonfirmasi: 'Jawaban Konfirmasi',
  lokasiKeluhan:     'Lokasi Keluhan',
  waktuDurasi:       'Waktu / Durasi Keluhan',
  statusKeluhan:     'Status Keluhan',
}

const IKON_KATEGORI = {
  jawabanKonfirmasi: '💬',
  lokasiKeluhan:     '📍',
  waktuDurasi:       '⏱️',
  statusKeluhan:     '📊',
}

// ─── Komponen Ikon SVG ─────────────────────────────────────
const IkonMic = ({ ukuran = 24, warna = 'currentColor' }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none"
    stroke={warna} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
)

const IkonCek = ({ ukuran = 16 }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IkonPanah = ({ ukuran = 14 }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

// ─── Kartu Status Kategori Interpretasi ────────────────────
function KartuKategori({ judul, ikon, nilai, status, catatan, bisa_edit, onEdit, onKlarifikasi }) {
  const cfg = STATUS_LABEL[status] || STATUS_LABEL['belum-diketahui']
  return (
    <div className="kartu-kategori">
      <div className="kartu-kategori-header">
        <div className="kartu-kategori-judul-row">
          <span className="kartu-kategori-ikon">{ikon}</span>
          <span className="kartu-kategori-judul">{judul}</span>
        </div>
        <span className="kartu-kategori-status" style={{ color: cfg.warna, backgroundColor: cfg.bg }}>
          {cfg.label}
        </span>
      </div>
      <div className="kartu-kategori-isi">
        {nilai
          ? <p className="kartu-nilai">{nilai}</p>
          : <p className="kartu-nilai kartu-nilai--kosong">— Tidak disebutkan pasien</p>
        }
        {catatan && <p className="kartu-catatan">{catatan}</p>}
      </div>
      {(bisa_edit || onKlarifikasi) && (
        <div className="kartu-aksi-row">
          {bisa_edit && (
            <button className="kartu-edit-btn" onClick={onEdit}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Koreksi
            </button>
          )}
          {onKlarifikasi && (
            <button className="kartu-klarif-btn" onClick={onKlarifikasi}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Klarifikasi
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── KOMPONEN UTAMA ────────────────────────────────────────
export default function ScreenResponsPasien() {
  const navigate = useNavigate()
  const { bahasaPasien, setHasilInterpretasi } = useApp()

  const [fase,         setFase]         = useState(FASE.PERSETUJUAN)
  const [subFase,      setSubFase]      = useState(SUB.DEFAULT)
  const [detikRekam,   setDetikRekam]   = useState(0)
  const [simIndex,     setSimIndex]     = useState(0)
  const [alasanKlarif, setAlasanKlarif] = useState('')

  // State untuk koreksi inline
  const [kategoriEdit,  setKategoriEdit]  = useState(null)  // key kategori yang diedit
  const [editNilai,     setEditNilai]     = useState('')
  const [editStatus,    setEditStatus]    = useState('teridentifikasi')
  const [overrides,     setOverrides]     = useState({})    // { 'lokasiKeluhan': { nilai, status } }

  // State untuk kategori yang diminta klarifikasi
  const [klarifKategori, setKlarifKategori] = useState([])

  // Waktu konfirmasi
  const [waktuKonfirmasi, setWaktuKonfirmasi] = useState('')

  const intervalRef = useRef(null)

  const dataSim    = SIMULASI_SESI_REKAMAN[simIndex]
  const gagalRekam = dataSim.interpretasiTerstruktur === null

  // Dapatkan nilai efektif kategori (dengan override jika ada)
  const getNilaiKategori = (key) => {
    if (overrides[key]) return overrides[key]
    return dataSim.interpretasiTerstruktur
      ? dataSim.interpretasiTerstruktur[key]
      : null
  }

  // Timer rekaman
  useEffect(() => {
    if (fase === FASE.MEREKAM) {
      setDetikRekam(0)
      intervalRef.current = setInterval(() => setDetikRekam(d => d + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [fase])

  const fmt = (d) => `${String(Math.floor(d/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`

  // ─── Handler navigasi antar fase ────────────────────────
  const setuju     = () => setFase(FASE.SIAP)
  const tolak      = () => setFase(FASE.MANUAL)
  const mulaiRekam = () => setFase(FASE.MEREKAM)

  const berhentiRekam = () => {
    setFase(FASE.MEMPROSES)
    setTimeout(() => {
      setFase(gagalRekam ? FASE.KLARIFIKASI : FASE.TRANSKRIPSI)
    }, 2400)
  }

  const lanjutInterpretasi = () => setFase(FASE.INTERPRETASI)
  const lanjutPemeriksaan  = () => {
    setSubFase(SUB.DEFAULT)
    setKategoriEdit(null)
    setKlarifKategori([])
    setFase(FASE.PEMERIKSAAN)
  }

  const konfirmasi = () => {
    const finalInterpretasi = {}
    if (dataSim.interpretasiTerstruktur) {
      Object.keys(dataSim.interpretasiTerstruktur).forEach(key => {
        const ov = overrides[key]
        const src = dataSim.interpretasiTerstruktur[key]
        finalInterpretasi[key] = ov
          ? { nilai: ov.nilai, status: ov.status, catatan: src.catatan }
          : { ...src, status: klarifKategori.includes(key) ? src.status : 'terkonfirmasi-perawat' }
      })
    }
    setWaktuKonfirmasi(new Date().toLocaleString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }))
    setHasilInterpretasi({
      sesiId:        dataSim.id,
      pasien:        dataSim.pasien,
      bahasa:        dataSim.bahasa,
      ujaran:        dataSim.ujaranAsli,
      interpretasi:  finalInterpretasi,
      catatanSistem: dataSim.catatanSistem,
      status:        'Terkonfirmasi Perawat'
    })
    setFase(FASE.TERKONFIRMASI)
  }

  const mintaKlarifikasi = () => {
    setAlasanKlarif('')
    setSubFase(SUB.DEFAULT)
    setFase(FASE.KLARIFIKASI)
  }

  const rekamUlang = () => {
    setSimIndex(i => (i + 1) % SIMULASI_SESI_REKAMAN.length)
    setOverrides({})
    setKategoriEdit(null)
    setKlarifKategori([])
    setSubFase(SUB.DEFAULT)
    setFase(FASE.PERSETUJUAN)
  }

  const lanjutLapis3 = () => navigate('/verifikasi')

  // ─── Handler Koreksi ───────────────────────────────────
  const bukaKoreksi = (key) => {
    setKategoriEdit(key)
    const src = overrides[key] || (dataSim.interpretasiTerstruktur ? dataSim.interpretasiTerstruktur[key] : {})
    setEditNilai(src.nilai || '')
    setEditStatus(src.status || 'teridentifikasi')
    setSubFase(SUB.KOREKSI)
  }

  const simpanKoreksi = () => {
    if (kategoriEdit) {
      setOverrides(prev => ({
        ...prev,
        [kategoriEdit]: { nilai: editNilai.trim() || null, status: 'dikoreksi-perawat' }
      }))
    }
    setSubFase(SUB.DEFAULT)
    setKategoriEdit(null)
  }

  const batalKoreksi = () => {
    setSubFase(SUB.DEFAULT)
    setKategoriEdit(null)
  }

  // ─── Handler Klarifikasi Kategori ──────────────────────
  const bukaKlarifKategori = (key) => {
    setKlarifKategori(prev =>
      prev.includes(key) ? prev : [...prev, key]
    )
    setKategoriEdit(key)
    setSubFase(SUB.KLARIF_DETAIL)
  }

  const tutupKlarifDetail = () => {
    setSubFase(SUB.DEFAULT)
    setKategoriEdit(null)
  }

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div className="respons-container fade-in">

      {/* ── Header utama ── */}
      {fase !== FASE.PERSETUJUAN && (
        <HeaderHalaman
          judul="Respons Pasien"
          badge={{ teks: 'Lapis 2', style: { backgroundColor: '#2563EB' } }}
          kembali={() => {
            if (subFase !== SUB.DEFAULT) { setSubFase(SUB.DEFAULT); return }
            const urutan = [FASE.SIAP, FASE.MEREKAM, FASE.TRANSKRIPSI,
              FASE.INTERPRETASI, FASE.PEMERIKSAAN, FASE.TERKONFIRMASI,
              FASE.KLARIFIKASI, FASE.MANUAL]
            const idx = urutan.indexOf(fase)
            if (idx > 0) setFase(urutan[idx - 1])
            else setFase(FASE.PERSETUJUAN)
          }}
        />
      )}

      {/* ── Chip progress ── */}
      {![FASE.PERSETUJUAN, FASE.MANUAL].includes(fase) && (
        <div className="progress-chips">
          {[
            {f: FASE.SIAP,         l:'Rekam'},
            {f: FASE.TRANSKRIPSI,  l:'Transkripsi'},
            {f: FASE.INTERPRETASI, l:'Interpretasi'},
            {f: FASE.PEMERIKSAAN,  l:'Periksa'},
          ].map(({ f, l }) => {
            const urutan = [FASE.SIAP, FASE.MEREKAM, FASE.MEMPROSES,
              FASE.TRANSKRIPSI, FASE.INTERPRETASI, FASE.PEMERIKSAAN,
              FASE.TERKONFIRMASI, FASE.KLARIFIKASI]
            const aktif = urutan.indexOf(fase) >= urutan.indexOf(f)
            return (
              <div key={f} className={`progress-chip ${aktif ? 'progress-chip--aktif' : ''}`}>
                {l}
              </div>
            )
          })}
        </div>
      )}

      <div className="section">

        {/* ════════════════════════════════════════
            SCREEN 1 — Persetujuan Perekaman Suara
            ════════════════════════════════════════ */}
        {fase === FASE.PERSETUJUAN && (
          <div className="persetujuan-wrapper slide-up">
            <div className="persetujuan-brand">
              <div className="persetujuan-brand-logo">
                <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                  <path d="M18 6v24M6 18h24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
                  <circle cx="18" cy="18" r="8" fill="none" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <span className="font-bold text-primary" style={{fontSize:15}}>JUNOCARE</span>
              <span className="badge-layer" style={{backgroundColor:'#2563EB',fontSize:10}}>Lapis 2</span>
            </div>

            <h2 className="persetujuan-judul">Persetujuan Perekaman Suara</h2>

            <div className="persetujuan-isi">
              <p className="persetujuan-teks">
                Suara Anda akan direkam untuk membantu perawat memahami jawaban
                yang Anda sampaikan dalam bahasa yang Anda gunakan. Hasil pengenalan
                dan interpretasi akan diperiksa oleh perawat sebelum digunakan dalam
                proses pelayanan.
              </p>

              <div className="persetujuan-info-list">
                {[
                  { ikon:'🎯', judul:'Tujuan Perekaman',
                    isi:'Membantu sistem mengenali ujaran pasien dalam bahasa daerah dan menghasilkan transkripsi untuk diperiksa perawat.' },
                  { ikon:'📋', judul:'Penggunaan Transkripsi',
                    isi:'Transkripsi hanya digunakan sebagai bahan interpretasi sementara yang wajib dikonfirmasi oleh perawat — bukan sebagai catatan medis final.' },
                  { ikon:'🔒', judul:'Pengelolaan Data Suara',
                    isi:'Pengelolaan data suara mengikuti kebijakan privasi fasilitas kesehatan. Tanyakan kepada petugas mengenai kebijakan penyimpanan yang berlaku.' },
                  { ikon:'🚫', judul:'Hak untuk Menolak',
                    isi:'Anda berhak untuk tidak memberikan persetujuan. Perawat dapat tetap memberikan pelayanan melalui komunikasi manual.' },
                ].map((item, i) => (
                  <div key={i} className="persetujuan-info-item">
                    <span className="persetujuan-info-ikon">{item.ikon}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{color:'#1A2332',marginBottom:2}}>{item.judul}</p>
                      <p className="text-xs text-gray" style={{lineHeight:1.5}}>{item.isi}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="persetujuan-simulasi-label">
                ⚠️ DATA SIMULASI — Prototipe demonstrasi. Perekaman nyata belum aktif.
              </div>
            </div>

            <div className="persetujuan-aksi">
              <button className="btn btn-primary btn-full btn-lg" onClick={setuju}>
                <IkonMic ukuran={18} warna="white"/>
                Setuju dan Mulai
              </button>
              <button className="btn btn-secondary btn-full" style={{marginTop:10}} onClick={tolak}>
                Tidak Bersedia — Gunakan Komunikasi Manual
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 2 — Siap Merekam
            ════════════════════════════════════════ */}
        {fase === FASE.SIAP && (
          <div className="rekam-siap slide-up">
            <div className="sesi-bahasa-card">
              <div className="sesi-bahasa-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
                <span className="text-sm font-semibold text-dark">
                  {bahasaPasien.bahasa}
                  {bahasaPasien.variasi && <span className="text-light"> · {bahasaPasien.variasi}</span>}
                </span>
              </div>
              <span className="simulasi-chip">Simulasi</span>
            </div>

            <div className="pasien-fiktif-label">
              DATA SIMULASI — Pasien: {dataSim.pasien}
            </div>

            <div className="rekam-ilustrasi">
              <div className="mic-ring mic-ring-1"/>
              <div className="mic-ring mic-ring-2"/>
              <div className="mic-ikon-wrapper">
                <IkonMic ukuran={42} warna="white"/>
              </div>
            </div>

            <p className="rekam-panduan-judul">Siap Merekam Jawaban Pasien</p>
            <p className="rekam-panduan-sub">
              Tekan tombol, lalu arahkan mikrofon ke pasien.
              Rekam hingga pasien selesai berbicara.
            </p>

            <PengamanKeselamatan
              tipe="info"
              pesan="Pastikan ruangan cukup tenang sebelum merekam."
              detail="Suara bising di sekitar dapat mengurangi kualitas transkripsi."
            />

            <button className="btn btn-primary btn-full btn-lg" style={{marginTop:16}} onClick={mulaiRekam}>
              <IkonMic ukuran={20} warna="white"/>
              Mulai Merekam
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 3 — Sedang Merekam
            ════════════════════════════════════════ */}
        {fase === FASE.MEREKAM && (
          <div className="rekam-aktif slide-up">
            <div className="gelombang-wrapper">
              <div className="gelombang-indikator">
                <div className="rekam-dot"/>
                <span className="text-sm font-bold text-danger">Merekam</span>
                <span className="text-sm font-bold text-danger" style={{marginLeft:'auto'}}>{fmt(detikRekam)}</span>
              </div>

              <div className="gelombang-visual">
                {Array.from({length:36}, (_,i) => (
                  <div key={i} className="gelombang-bar" style={{animationDelay:`${i*0.045}s`}}/>
                ))}
              </div>

              <div className="gelombang-bahasa">
                <span className="text-xs text-gray">Bahasa sesi: </span>
                <span className="text-xs font-semibold text-primary">{bahasaPasien.bahasa}</span>
              </div>
            </div>

            <p className="rekam-info-teks text-center text-gray">
              Pasien sedang berbicara — tahan rekaman hingga selesai
            </p>

            <button className="btn-berhenti-rekam" onClick={berhentiRekam}>
              <div className="berhenti-ikon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                </svg>
              </div>
              <span>Berhenti Merekam</span>
            </button>

            <div className="rekam-peringatan">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D69A36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span className="text-xs" style={{color:'#7A5500'}}>
                Simulasi — mikrofon nyata tidak aktif dalam prototipe ini
              </span>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            MEMPROSES (Loading)
            ════════════════════════════════════════ */}
        {fase === FASE.MEMPROSES && (
          <div className="memproses-wrapper slide-up">
            <div className="memproses-ikon">
              <div className="memproses-spinner"/>
            </div>
            <p className="text-lg font-semibold text-dark text-center">Memproses Rekaman...</p>
            <p className="text-sm text-gray text-center mt-2">
              Sistem pengenalan suara sedang menganalisis respons pasien
            </p>
            <div className="memproses-langkah">
              {['Konversi suara ke teks (ASR)', 'Analisis bahasa — {lang}', 'Klasifikasi kategori respons'].map((l, i) => (
                <div className="memproses-item" key={i}>
                  <div className="memproses-item-dot" style={{animationDelay:`${i*0.4}s`}}/>
                  <span className="text-sm text-gray">
                    {l.replace('{lang}', bahasaPasien.bahasa)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-light text-center mt-3">
              ASR = Automatic Speech Recognition (Pengenalan Suara Otomatis)
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 4 — Hasil Transkripsi
            ════════════════════════════════════════ */}
        {fase === FASE.TRANSKRIPSI && (
          <div className="transkripsi-wrapper slide-up">
            <PengamanKeselamatan
              tipe="warning"
              pesan="Ini adalah hasil simulasi — bukan transkripsi nyata dari rekaman suara."
              detail="Pada produk akhir, teks ini akan dihasilkan oleh sistem ASR yang terintegrasi."
            />

            <div className="card mt-3">
              <div className="seksi-judul-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                <span className="seksi-judul">Hasil Transkripsi</span>
              </div>

              <div className="transkripsi-meta">
                <span className="text-xs text-gray">Bahasa sesi:</span>
                <span className="badge badge-secondary text-xs">{dataSim.bahasa} · {dataSim.variasi}</span>
                <span className="transkripsi-status-chip">Simulasi</span>
              </div>

              <div className="transkripsi-blok-asli">
                <p className="transkripsi-label-asli">Ujaran Asli Pasien</p>
                <p className="transkripsi-teks-asli">"{dataSim.ujaranAsli}"</p>
              </div>

              {dataSim.terjemahanLiteral && (
                <div className="transkripsi-blok-terjemahan">
                  <p className="transkripsi-label-terjemahan">Padanan Bahasa Indonesia (Simulasi)</p>
                  <p className="text-sm text-gray" style={{lineHeight:1.5, fontStyle:'italic'}}>
                    {dataSim.terjemahanLiteral}
                  </p>
                </div>
              )}

              <button className="btn-dengarkan-ulang">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Dengarkan Ulang (Simulasi)
              </button>
            </div>

            <PengamanKeselamatan
              tipe="info"
              pesan="Teks asli pasien tidak akan diubah oleh sistem saat membuat interpretasi."
              detail="Perawat dapat membandingkan teks asli dengan hasil interpretasi yang dihasilkan sistem."
            />

            <div className="aksi-row mt-4">
              <button className="btn btn-secondary" style={{flex:1}} onClick={rekamUlang}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                </svg>
                Rekam Ulang
              </button>
              <button className="btn btn-primary" style={{flex:2}} onClick={lanjutInterpretasi}>
                Lihat Interpretasi
                <IkonPanah/>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 5 — Interpretasi Terstruktur (4 Kartu)
            ════════════════════════════════════════ */}
        {fase === FASE.INTERPRETASI && dataSim.interpretasiTerstruktur && (
          <div className="interpretasi-wrapper slide-up">
            <PengamanKeselamatan
              tipe="warning"
              pesan="Interpretasi sementara — belum dikonfirmasi perawat."
              detail="Hasil ini tidak dapat digunakan sebagai dasar tindakan klinis sebelum diperiksa."
            />

            {dataSim.safetyGate && (
              <div className="mt-3">
                <PengamanKeselamatan
                  tipe={dataSim.safetyGate.tipe}
                  pesan={dataSim.safetyGate.pesan}
                  detail={dataSim.safetyGate.saran}
                />
              </div>
            )}

            <div className="seksi-judul-row mt-3 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
              <span className="seksi-judul">Hasil Interpretasi Terstruktur</span>
            </div>

            <div className="ujaran-ringkas">
              <span className="text-xs text-gray">Ujaran: </span>
              <span className="text-xs font-medium" style={{fontStyle:'italic', color:'#1A2332'}}>
                "{dataSim.ujaranAsli}"
              </span>
            </div>

            <div className="kartu-grid">
              {Object.keys(dataSim.interpretasiTerstruktur).map(key => {
                const kat = dataSim.interpretasiTerstruktur[key]
                return (
                  <KartuKategori
                    key={key}
                    judul={NAMA_KATEGORI[key]}
                    ikon={IKON_KATEGORI[key]}
                    nilai={kat.nilai}
                    status={kat.status}
                    catatan={kat.catatan}
                    bisa_edit={false}
                  />
                )
              })}
            </div>

            {dataSim.catatanSistem && (
              <div className="catatan-sistem">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-xs text-gray" style={{lineHeight:1.5}}>
                  <strong>Catatan sistem:</strong> {dataSim.catatanSistem}
                </p>
              </div>
            )}

            <div className="simulasi-disclaimer">
              DATA SIMULASI — Bukan penilaian klinis pasien nyata
            </div>

            <button className="btn btn-primary btn-full btn-lg mt-3" onClick={lanjutPemeriksaan}>
              Lanjut ke Pemeriksaan Perawat
              <IkonPanah ukuran={16}/>
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 6 — Pemeriksaan Perawat
            ════════════════════════════════════════ */}
        {fase === FASE.PEMERIKSAAN && (
          <div className="pemeriksaan-wrapper slide-up">

            {/* ── Sub-view: DEFAULT (4 kartu + 3 tombol) ── */}
            {subFase === SUB.DEFAULT && (
              <>
                {/* Header pemeriksaan */}
                <div className="pemeriksaan-header-blok">
                  <div className="pemeriksaan-judul-utama">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div>
                      <p className="font-bold text-dark" style={{fontSize:14}}>PEMERIKSAAN HASIL RESPONS PASIEN</p>
                      <p className="text-xs text-gray mt-1">Periksa kesesuaian transkripsi dan hasil interpretasi sebelum informasi diteruskan ke tahap berikutnya.</p>
                    </div>
                  </div>
                </div>

                {/* Info pasien + status */}
                <div className="pemeriksaan-info-pasien">
                  <div className="pemeriksaan-info-row">
                    <span className="text-xs text-gray">Pasien:</span>
                    <span className="text-xs font-semibold text-dark">{dataSim.pasien}</span>
                  </div>
                  <div className="pemeriksaan-info-row">
                    <span className="text-xs text-gray">Bahasa sesi:</span>
                    <span className="text-xs font-semibold text-primary">{dataSim.bahasa}</span>
                  </div>
                  <div className="pemeriksaan-info-row">
                    <span className="text-xs text-gray">Ujaran asli:</span>
                    <span className="text-xs font-medium" style={{fontStyle:'italic', color:'#1A2332', flex:1}}>
                      "{dataSim.ujaranAsli}"
                    </span>
                  </div>
                </div>

                <div className="status-bar status-bar--menunggu">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Menunggu Konfirmasi Perawat
                </div>

                {/* 4 Kartu dengan override state */}
                {dataSim.interpretasiTerstruktur && (
                  <div className="kartu-grid">
                    {Object.keys(dataSim.interpretasiTerstruktur).map(key => {
                      const ov  = overrides[key]
                      const src = dataSim.interpretasiTerstruktur[key]
                      const nilaiTampil  = ov ? ov.nilai  : src.nilai
                      const statusTampil = ov ? ov.status : (klarifKategori.includes(key) ? 'memerlukan-klarifikasi' : src.status)
                      const catatanTampil = ov ? null : src.catatan
                      return (
                        <KartuKategori
                          key={key}
                          judul={NAMA_KATEGORI[key]}
                          ikon={IKON_KATEGORI[key]}
                          nilai={nilaiTampil}
                          status={statusTampil}
                          catatan={catatanTampil}
                          bisa_edit={true}
                          onEdit={() => bukaKoreksi(key)}
                          onKlarifikasi={() => bukaKlarifKategori(key)}
                        />
                      )
                    })}
                  </div>
                )}

                {/* Indikator klarifikasi aktif */}
                {klarifKategori.length > 0 && (
                  <div className="klarif-aktif-banner">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span className="text-xs" style={{color:'#2563EB'}}>
                      {klarifKategori.length} kategori memerlukan klarifikasi: {klarifKategori.map(k => NAMA_KATEGORI[k]).join(', ')}
                    </span>
                  </div>
                )}

                <PengamanKeselamatan
                  tipe="info"
                  pesan="Hasil yang belum dikonfirmasi tidak akan diteruskan ke Lapis 3."
                />

                {/* 3 Tombol Aksi Utama */}
                <div className="pemeriksaan-aksi">
                  <button className="aksi-btn aksi-btn--konfirmasi" onClick={konfirmasi}>
                    <div className="aksi-btn-ikon"><IkonCek ukuran={18}/></div>
                    <div>
                      <p className="aksi-btn-judul">Konfirmasi Hasil</p>
                      <p className="aksi-btn-sub">Saya sudah memeriksa dan menyetujui interpretasi ini</p>
                    </div>
                  </button>

                  <button className="aksi-btn aksi-btn--koreksi" onClick={() => {
                    // Buka koreksi kategori pertama yang ada
                    const keys = dataSim.interpretasiTerstruktur ? Object.keys(dataSim.interpretasiTerstruktur) : []
                    if (keys.length > 0) bukaKoreksi(keys[0])
                  }}>
                    <div className="aksi-btn-ikon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="aksi-btn-judul">Koreksi Hasil</p>
                      <p className="aksi-btn-sub">Perbaiki interpretasi yang kurang tepat</p>
                    </div>
                  </button>

                  <button className="aksi-btn aksi-btn--klarifikasi" onClick={mintaKlarifikasi}>
                    <div className="aksi-btn-ikon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div>
                      <p className="aksi-btn-judul">Minta Klarifikasi</p>
                      <p className="aksi-btn-sub">Ada bagian yang perlu dijelaskan ulang oleh pasien</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* ── Sub-view: KOREKSI (form edit inline) ── */}
            {subFase === SUB.KOREKSI && kategoriEdit && (
              <div className="koreksi-form-wrapper slide-up">
                <div className="koreksi-form-header">
                  <div className="koreksi-form-ikon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-dark" style={{fontSize:14}}>Koreksi Kategori</p>
                    <p className="text-xs text-primary font-semibold">{IKON_KATEGORI[kategoriEdit]} {NAMA_KATEGORI[kategoriEdit]}</p>
                  </div>
                </div>

                {/* Nilai asli sistem */}
                <div className="koreksi-nilai-asli">
                  <p className="text-xs text-gray mb-1">Nilai interpretasi sistem:</p>
                  <p className="text-sm font-medium" style={{color:'#1A2332', fontStyle:'italic'}}>
                    {dataSim.interpretasiTerstruktur?.[kategoriEdit]?.nilai || '— Tidak disebutkan'}
                  </p>
                </div>

                {/* Input koreksi */}
                <div className="koreksi-field">
                  <label className="koreksi-label">Koreksi nilai (opsional):</label>
                  <textarea
                    className="koreksi-textarea"
                    placeholder="Tuliskan nilai yang lebih tepat berdasarkan penilaian Anda..."
                    value={editNilai}
                    onChange={e => setEditNilai(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-light mt-1">
                    Kosongkan jika tidak perlu mengubah nilai — hanya status yang akan berubah.
                  </p>
                </div>

                {/* Dropdown status */}
                <div className="koreksi-field mt-3">
                  <label className="koreksi-label">Status setelah dikoreksi:</label>
                  <select
                    className="koreksi-select"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                  >
                    <option value="teridentifikasi">Teridentifikasi</option>
                    <option value="belum-jelas">Belum Jelas</option>
                    <option value="tidak-disebutkan">Tidak Disebutkan</option>
                    <option value="memerlukan-klarifikasi">Memerlukan Klarifikasi</option>
                    <option value="belum-diketahui">Belum Diketahui</option>
                  </select>
                </div>

                <PengamanKeselamatan
                  tipe="info"
                  pesan="Koreksi ini adalah penilaian perawat — bukan hasil otomatis sistem."
                />

                <div className="koreksi-aksi-row">
                  <button className="btn btn-secondary" style={{flex:1}} onClick={batalKoreksi}>
                    Batal
                  </button>
                  <button className="btn btn-primary" style={{flex:2}} onClick={simpanKoreksi}>
                    <IkonCek ukuran={14}/>
                    Simpan Koreksi
                  </button>
                </div>

                {/* Pilih kategori lain */}
                {dataSim.interpretasiTerstruktur && Object.keys(dataSim.interpretasiTerstruktur).length > 1 && (
                  <div className="koreksi-kategori-lain">
                    <p className="text-xs text-gray mb-2">Koreksi kategori lain:</p>
                    <div className="koreksi-kategori-chips">
                      {Object.keys(dataSim.interpretasiTerstruktur)
                        .filter(k => k !== kategoriEdit)
                        .map(k => (
                          <button key={k} className="koreksi-chip" onClick={() => bukaKoreksi(k)}>
                            {IKON_KATEGORI[k]} {NAMA_KATEGORI[k]}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Sub-view: KLARIFIKASI DETAIL per kategori ── */}
            {subFase === SUB.KLARIF_DETAIL && kategoriEdit && (
              <div className="klarif-detail-wrapper slide-up">
                <div className="klarif-detail-header">
                  <div className="klarif-detail-ikon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-dark" style={{fontSize:14}}>Minta Klarifikasi</p>
                    <p className="text-xs text-primary font-semibold">{IKON_KATEGORI[kategoriEdit]} {NAMA_KATEGORI[kategoriEdit]}</p>
                  </div>
                </div>

                <div className="klarif-info-kategori">
                  <p className="text-xs text-gray mb-1">Nilai interpretasi yang perlu klarifikasi:</p>
                  <p className="text-sm font-medium" style={{color:'#1A2332', fontStyle:'italic'}}>
                    {dataSim.interpretasiTerstruktur?.[kategoriEdit]?.nilai || '— Tidak disebutkan'}
                  </p>
                </div>

                <div className="card mt-3 mb-3">
                  <p className="text-sm font-bold text-dark mb-3">Pertanyaan yang Dapat Ditanyakan kepada Pasien</p>
                  <div className="klarif-pertanyaan-list">
                    {(PERTANYAAN_KLARIFIKASI[kategoriEdit] || []).map((q, i) => (
                      <div key={i} className="klarif-pertanyaan-item">
                        <span className="klarif-pertanyaan-no">{i + 1}</span>
                        <span className="text-sm text-dark" style={{lineHeight:1.5}}>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <PengamanKeselamatan
                  tipe="warning"
                  pesan="Ajukan pertanyaan langsung ke pasien menggunakan Materi Klinis (Lapis 1) jika tersedia dalam bahasa pasien."
                />

                <div className="klarif-aksi-row">
                  <button className="btn btn-secondary btn-full" onClick={tutupKlarifDetail}>
                    Kembali ke Pemeriksaan
                  </button>
                  <button className="btn btn-primary btn-full mt-2" onClick={rekamUlang}>
                    <IkonMic ukuran={16} warna="white"/>
                    Rekam Ulang Jawaban
                  </button>
                  <button className="btn btn-outline btn-full mt-2" onClick={() => { setSubFase(SUB.DEFAULT); setFase(FASE.MANUAL) }}>
                    Gunakan Komunikasi Manual
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 7 — Hasil Terkonfirmasi
            ════════════════════════════════════════ */}
        {fase === FASE.TERKONFIRMASI && (
          <div className="terkonfirmasi-wrapper slide-up">
            {/* Banner sukses */}
            <div className="konfirmasi-sukses">
              <div className="konfirmasi-sukses-ikon">
                <IkonCek ukuran={28}/>
              </div>
              <div>
                <p className="font-bold" style={{fontSize:16, color:'#176B61'}}>Terkonfirmasi Perawat</p>
                <p className="text-xs text-light mt-1">{waktuKonfirmasi}</p>
              </div>
            </div>

            {/* Identitas pasien + bahasa */}
            <div className="konfirmasi-identitas-card">
              <div className="konfirmasi-identitas-row">
                <span className="text-xs text-gray">Pasien (fiktif):</span>
                <span className="text-xs font-bold text-dark">{dataSim.pasien}</span>
              </div>
              <div className="konfirmasi-identitas-row">
                <span className="text-xs text-gray">Bahasa:</span>
                <span className="badge badge-secondary text-xs">{dataSim.bahasa} · {dataSim.variasi}</span>
              </div>
              <div className="konfirmasi-identitas-row" style={{alignItems:'flex-start'}}>
                <span className="text-xs text-gray">Ujaran asli:</span>
                <span className="text-xs font-medium" style={{fontStyle:'italic', color:'#1A2332', flex:1, textAlign:'right'}}>
                  "{dataSim.ujaranAsli}"
                </span>
              </div>
            </div>

            {/* 4 kategori final — semua terkonfirmasi perawat */}
            {dataSim.interpretasiTerstruktur && (
              <div className="kartu-grid mt-2">
                {Object.keys(dataSim.interpretasiTerstruktur).map(key => {
                  const ov  = overrides[key]
                  const src = dataSim.interpretasiTerstruktur[key]
                  const perluKlarif = klarifKategori.includes(key)
                  return (
                    <KartuKategori
                      key={key}
                      judul={NAMA_KATEGORI[key]}
                      ikon={IKON_KATEGORI[key]}
                      nilai={ov ? ov.nilai : src.nilai}
                      status={ov ? 'dikoreksi-perawat' : (perluKlarif ? 'memerlukan-klarifikasi' : 'terkonfirmasi-perawat')}
                      catatan={null}
                      bisa_edit={false}
                    />
                  )
                })}
              </div>
            )}

            {/* Ringkasan status */}
            <div className="konfirmasi-ringkasan">
              <div className="konfirmasi-ringkasan-item">
                <IkonCek ukuran={12}/>
                <span className="text-xs text-gray">Status pemeriksaan: <strong>Selesai diperiksa perawat</strong></span>
              </div>
              {Object.keys(overrides).length > 0 && (
                <div className="konfirmasi-ringkasan-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span className="text-xs text-gray">{Object.keys(overrides).length} kategori dikoreksi oleh perawat</span>
                </div>
              )}
              {klarifKategori.length > 0 && (
                <div className="konfirmasi-ringkasan-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span className="text-xs text-gray">{klarifKategori.length} kategori masih memerlukan klarifikasi</span>
                </div>
              )}
            </div>

            <PengamanKeselamatan
              tipe="info"
              pesan="Informasi ini siap diteruskan ke Lapis 3 — Panduan Tindak Lanjut."
              detail="Hanya informasi yang sudah dikonfirmasi perawat yang diteruskan."
            />

            <div className="simulasi-disclaimer">DATA SIMULASI — Bukan penilaian klinis pasien nyata</div>

            <div className="aksi-row mt-4">
              <button className="btn btn-secondary" style={{flex:1}} onClick={rekamUlang}>
                Sesi Baru
              </button>
              <button className="btn btn-primary" style={{flex:2}} onClick={lanjutLapis3}>
                Teruskan ke Panduan Tindak Lanjut
                <IkonPanah/>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN 8 — Klarifikasi & Safety Gate
            ════════════════════════════════════════ */}
        {fase === FASE.KLARIFIKASI && (
          <div className="klarifikasi-wrapper slide-up">
            <div className="safety-gate-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <p className="font-bold" style={{fontSize:14}}>Safety Gate — Pengaman Keselamatan</p>
                <p style={{fontSize:11, opacity:0.85, marginTop:2}}>Aktif lintas lapisan</p>
              </div>
            </div>

            {dataSim.safetyGate ? (
              <div className="mt-3">
                <PengamanKeselamatan
                  tipe={dataSim.safetyGate.tipe}
                  pesan={dataSim.safetyGate.pesan}
                  detail={dataSim.safetyGate.saran}
                />
                {dataSim.safetyGate.tipe === 'danger' && (
                  <div className="safety-gate-instruksi">
                    <p className="text-sm font-bold text-dark mb-2">Instruksi Pengkajian Langsung</p>
                    <p className="text-xs text-gray" style={{lineHeight:1.6}}>
                      Karena sistem tidak dapat mengenali ujaran pasien, perawat perlu melakukan pengkajian secara langsung.
                      Gunakan teknik komunikasi non-verbal, materi klinis bergambar (Lapis 1), atau bantuan penerjemah kompeten.
                    </p>
                    <div className="safety-eskalasi-list mt-2">
                      {[
                        { ikon:'🏥', teks:'Lakukan pengkajian langsung sesuai standar fasilitas' },
                        { ikon:'🌐', teks:'Hubungi penerjemah kompeten bahasa yang digunakan pasien' },
                        { ikon:'📋', teks:'Gunakan materi klinis bergambar dari Lapis 1' },
                        { ikon:'📞', teks:'Eskalasi ke supervisor jika hambatan tidak teratasi' },
                      ].map((item, i) => (
                        <div key={i} className="tindakan-item">
                          <span style={{fontSize:15}}>{item.ikon}</span>
                          <span className="text-sm text-gray" style={{lineHeight:1.5}}>{item.teks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <PengamanKeselamatan
                  tipe="warning"
                  pesan="Perawat meminta klarifikasi tambahan."
                  detail="Ada bagian dari respons pasien yang perlu dijelaskan ulang."
                />
              </div>
            )}

            {/* Alasan klarifikasi — hanya jika bukan gagal total */}
            {!gagalRekam && (
              <div className="card mt-3 mb-3">
                <p className="text-sm font-bold text-dark mb-3">Alasan Klarifikasi (Simulasi)</p>
                <div className="klarifikasi-pilihan">
                  {[
                    'Suara tidak jelas / tidak dapat dikenali',
                    'Transkripsi tidak sesuai ujaran pasien',
                    'Jawaban ambigu atau tidak lengkap',
                    'Respons di luar kategori yang tersedia',
                    'Interpretasi perlu dikonfirmasi ulang',
                    'Situasi memerlukan pengkajian langsung',
                  ].map((alasan, i) => (
                    <button
                      key={i}
                      className={`klarifikasi-opsi ${alasanKlarif === alasan ? 'klarifikasi-opsi--aktif' : ''}`}
                      onClick={() => setAlasanKlarif(alasan)}
                    >
                      <div className={`klarifikasi-radio ${alasanKlarif === alasan ? 'klarifikasi-radio--aktif' : ''}`}>
                        {alasanKlarif === alasan && <div className="klarifikasi-radio-isi"/>}
                      </div>
                      <span className="text-sm">{alasan}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="card mb-3">
              <p className="text-sm font-bold text-dark mb-2">Tindakan yang Dapat Dilakukan</p>
              <div className="tindakan-list">
                {[
                  { ikon:'🔄', teks:'Rekam ulang — minta pasien berbicara lebih pelan dan jelas' },
                  { ikon:'💬', teks:'Tanya langsung kepada pasien menggunakan Materi Klinis (Lapis 1)' },
                  { ikon:'👥', teks:'Hubungi penerjemah kompeten jika hambatan bahasa tidak teratasi' },
                  { ikon:'🏥', teks:'Lakukan pengkajian langsung sesuai prosedur fasilitas kesehatan' },
                ].map((item, i) => (
                  <div key={i} className="tindakan-item">
                    <span style={{fontSize:16}}>{item.ikon}</span>
                    <span className="text-sm text-gray" style={{lineHeight:1.5}}>{item.teks}</span>
                  </div>
                ))}
              </div>
            </div>

            <PengamanKeselamatan
              tipe="danger"
              pesan="Jangan menunda tindakan darurat untuk menunggu hasil sistem."
              detail="Ikuti prosedur gawat darurat fasilitas kesehatan Anda jika diperlukan."
            />

            <div className="aksi-row mt-4">
              <button className="btn btn-secondary" style={{flex:1}}
                onClick={() => gagalRekam ? setFase(FASE.SIAP) : setFase(FASE.PEMERIKSAAN)}>
                Kembali
              </button>
              <button className="btn btn-primary" style={{flex:2}} onClick={rekamUlang}>
                <IkonMic ukuran={16} warna="white"/>
                Rekam Ulang
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            SCREEN MANUAL — Tanpa Perekaman
            ════════════════════════════════════════ */}
        {fase === FASE.MANUAL && (
          <div className="manual-wrapper slide-up">
            <div className="manual-header">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <div>
                <p className="font-bold text-dark" style={{fontSize:15}}>Komunikasi Manual</p>
                <p className="text-xs text-gray mt-1">Tanpa perekaman suara</p>
              </div>
            </div>

            <PengamanKeselamatan
              tipe="info"
              pesan="Pasien memilih tidak memberikan persetujuan perekaman."
              detail="Pelayanan tetap dapat diberikan melalui komunikasi langsung atau materi klinis tervalidasi."
            />

            <div className="card mt-3 mb-3">
              <p className="text-sm font-bold text-dark mb-3">Alternatif Komunikasi</p>
              {[
                { ikon:'📋', judul:'Gunakan Materi Komunikasi Klinis', sub:'Lapis 1 menyediakan kalimat tervalidasi dalam bahasa daerah pasien', aksi:'Buka Lapis 1', path:'/materi-komunikasi' },
                { ikon:'👥', judul:'Minta Bantuan Penerjemah', sub:'Hubungi koordinator untuk menyediakan penerjemah kompeten', aksi:null },
                { ikon:'✍️', judul:'Komunikasi Tertulis', sub:'Gunakan papan tulis atau kertas jika memungkinkan', aksi:null },
              ].map((alt, i) => (
                <div key={i} className="alternatif-item">
                  <span style={{fontSize:20}}>{alt.ikon}</span>
                  <div style={{flex:1}}>
                    <p className="text-sm font-semibold text-dark">{alt.judul}</p>
                    <p className="text-xs text-gray mt-1" style={{lineHeight:1.4}}>{alt.sub}</p>
                  </div>
                  {alt.aksi && (
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(alt.path)}>
                      {alt.aksi}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="btn btn-outline btn-full" onClick={() => setFase(FASE.PERSETUJUAN)}>
              Kembali ke Persetujuan
            </button>
          </div>
        )}

      </div>{/* /section */}
    </div>
  )
}
