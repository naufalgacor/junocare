import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import './ScreenPengaturan.css'

export default function ScreenPengaturan() {
  const navigate = useNavigate()
  const { catatanVerifikasi, bahasaPasien } = useApp()

  const menuPanduan = [
    {
      judul: 'Lapis 1 — Komunikasi Klinis Tervalidasi',
      deskripsi: 'Menyampaikan informasi dan pertanyaan klinis kepada pasien menggunakan materi tervalidasi.',
      ikon: '📋', warna: '#176B61'
    },
    {
      judul: 'Lapis 2 — Interpretasi Respons Pasien',
      deskripsi: 'Membantu memahami jawaban pasien yang disampaikan dalam bahasa daerah.',
      ikon: '🎙️', warna: '#2563EB'
    },
    {
      judul: 'Lapis 3 — Verifikasi dan Pemahaman',
      deskripsi: 'Memastikan informasi benar-benar dipahami pasien melalui metode Teach-Back.',
      ikon: '✅', warna: '#D69A36'
    },
    {
      judul: 'Pengaman Keselamatan (Lintas Lapisan)',
      deskripsi: 'Mekanisme peringatan aktif di seluruh proses komunikasi klinis.',
      ikon: '🛡️', warna: '#C0392B'
    }
  ]

  return (
    <div className="pengaturan-container fade-in">
      {/* Header Brand */}
      <div className="pengaturan-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="pengaturan-logo">
            <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.2)"/>
              <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="18" cy="18" r="6" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'white' }}>JUNOCARE</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Sistem Komunikasi Keperawatan Multibahasa</p>
          </div>
        </div>
        <div className="pengaturan-versi-badge">v1.0 · Prototipe Demonstrasi</div>
      </div>

      <div className="section">
        {/* Status Sesi */}
        <p className="section-title">Status Sesi</p>
        <div className="card mb-4">
          <div className="stat-row">
            <div className="stat-item">
              <p className="stat-angka">{catatanVerifikasi.length}</p>
              <p className="stat-label">Sesi Terverifikasi</p>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <p className="stat-angka">{bahasaPasien.bahasa?.split(' ')[1] || 'Jawa'}</p>
              <p className="stat-label">Bahasa Aktif</p>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <p className="stat-angka">3</p>
              <p className="stat-label">Antrean</p>
            </div>
          </div>
        </div>

        {/* Riwayat Verifikasi */}
        {catatanVerifikasi.length > 0 && (
          <>
            <p className="section-title">Riwayat Verifikasi Sesi Ini</p>
            <div className="card mb-4">
              {catatanVerifikasi.slice(-3).reverse().map((c, i) => (
                <div key={c.id} className={`riwayat-item ${i < catatanVerifikasi.length - 1 ? 'riwayat-item--border' : ''}`}>
                  <div>
                    <p className="text-sm font-semibold text-dark">{c.hasilInterpretasi?.interpretasi || 'Sesi Komunikasi'}</p>
                    <p className="text-xs text-light">{c.waktu}</p>
                  </div>
                  <span className={`badge ${c.status === 'Terverifikasi' ? 'badge-secondary' : 'badge-warning'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Panduan Arsitektur */}
        <p className="section-title">Panduan Penggunaan</p>
        <div className="panduan-list">
          {menuPanduan.map((p, i) => (
            <div key={i} className="panduan-item card">
              <div className="panduan-ikon" style={{ backgroundColor: p.warna + '18' }}>
                <span style={{ fontSize: 20 }}>{p.ikon}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-dark">{p.judul}</p>
                <p className="text-xs text-light mt-1">{p.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-4">
          <PengamanKeselamatan
            tipe="warning"
            pesan="JUNOCARE adalah alat bantu komunikasi, bukan alat diagnostik."
            detail="Seluruh keputusan klinis tetap menjadi tanggung jawab penuh tenaga kesehatan berlisensi. Hasil interpretasi AI hanya bersifat sementara dan wajib dikonfirmasi."
          />
        </div>

        {/* Tentang */}
        <div className="card mt-4 mb-4">
          <p className="text-sm font-bold text-dark mb-2">Tentang JUNOCARE</p>
          <p className="text-xs text-gray" style={{ lineHeight: 1.7 }}>
            JUNOCARE adalah inovasi sistem komunikasi keperawatan multibahasa yang dirancang untuk menjembatani kesenjangan komunikasi antara tenaga kesehatan dan pasien yang memiliki hambatan bahasa daerah. Dikembangkan untuk mendukung layanan kesehatan di tingkat Puskesmas dan fasilitas kesehatan primer.
          </p>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid #EDF2F7' }}>
            <p className="text-xs text-light">Versi: 1.0.0 (Prototipe)</p>
            <p className="text-xs text-light">Status: Demonstrasi — Belum untuk penggunaan klinis aktual</p>
            <p className="text-xs text-light">Data: Ilustrasi — Belum tervalidasi secara klinis</p>
          </div>
        </div>
      </div>
    </div>
  )
}

