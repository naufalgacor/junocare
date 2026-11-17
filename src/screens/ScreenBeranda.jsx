import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ANTREAN_PASIEN } from '../data/dataJunocare'
import './ScreenBeranda.css'

export default function ScreenBeranda() {
  const navigate = useNavigate()
  const { bahasaPasien } = useApp()
  const [sesiDimulai, setSesiDimulai] = useState(false)

  const handleMulaiSesi = () => {
    setSesiDimulai(true)
    navigate('/pemilihan-bahasa')
  }

  return (
    <div className="beranda-container fade-in">
      {/* Header Brand */}
      <div className="beranda-header">
        <div className="beranda-brand">
          <div className="beranda-logo">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#176B61"/>
              <path d="M18 8v20M8 18h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="18" cy="18" r="6" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h1 className="beranda-nama-app">JUNOCARE</h1>
            <p className="beranda-deskripsi">Sistem Komunikasi Keperawatan Multibahasa</p>
          </div>
        </div>

        {/* Profil Perawat */}
        <div className="beranda-profil">
          <div className="profil-info">
            <p className="profil-nama">Ns. Sari Dewi, S.Kep</p>
            <p className="profil-unit">Poli Umum · Puskesmas Harapan</p>
          </div>
          <div className="avatar">SD</div>
        </div>
      </div>

      {/* Ilustrasi & Banner */}
      <div className="beranda-banner">
        <div className="banner-wave">
          <div className="wave-bar" style={{animationDelay:'0s'}}/>
          <div className="wave-bar" style={{animationDelay:'0.1s'}}/>
          <div className="wave-bar" style={{animationDelay:'0.2s'}}/>
          <div className="wave-bar" style={{animationDelay:'0.1s'}}/>
          <div className="wave-bar" style={{animationDelay:'0s'}}/>
        </div>
        <div className="banner-text">
          <p className="banner-judul">Selamat Datang!</p>
          <p className="banner-sub">Jembatan komunikasi antara Anda dan pasien</p>
        </div>
      </div>

      {/* Pemilihan Bahasa Pasien */}
      <div className="section">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray">Bahasa Pasien Saat Ini</p>
            <button className="btn-ubah-bahasa" onClick={() => navigate('/pemilihan-bahasa')}>
              Ubah
            </button>
          </div>
          <div className="bahasa-aktif">
            <div className="bahasa-ikon">🗣️</div>
            <div>
              <p className="font-semibold text-base">{bahasaPasien.bahasa}</p>
              <p className="text-sm text-light">{bahasaPasien.variasi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Antrean Pasien */}
      <div className="section" style={{paddingTop: 0}}>
        <div className="flex items-center justify-between mb-3">
          <p className="section-title" style={{margin:0}}>Antrean Hari Ini</p>
          <span className="badge badge-primary">{ANTREAN_PASIEN.length} Pasien</span>
        </div>
        <div className="antrean-list">
          {ANTREAN_PASIEN.map((pasien, idx) => (
            <div className="antrean-item card" key={pasien.id}>
              <div className="antrean-nomor">{pasien.nomorAntrean}</div>
              <div className="antrean-info">
                <p className="font-semibold text-base" style={{marginBottom: 2}}>{pasien.nama}</p>
                <p className="text-sm text-gray">{pasien.usia} th · {pasien.keluhan}</p>
              </div>
              <span className="badge badge-secondary">{pasien.bahasa}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Utama */}
      <div className="beranda-cta">
        <button className="btn btn-primary btn-full btn-lg" onClick={handleMulaiSesi}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Mulai Sesi Pelayanan
        </button>
        <button className="btn btn-secondary btn-full" onClick={() => navigate('/pengaturan')} style={{marginTop: 10}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Panduan Penggunaan
        </button>
      </div>

      {/* Versi Info */}
      <p className="beranda-versi">JUNOCARE v1.0 · Prototipe Demonstrasi · Belum untuk penggunaan klinis</p>
    </div>
  )
}

