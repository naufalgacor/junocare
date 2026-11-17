import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { KATEGORI_MATERI } from '../data/dataJunocare'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import './ScreenMateriKomunikasi.css'

const IkonKategori = ({ nama, warna }) => {
  const icons = {
    complaint: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    exam: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    medicine: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 2H5a2 2 0 00-2 2v18l4-2 4 2 4-2 4 2V4a2 2 0 00-2-2z"/>
        <line x1="12" y1="8" x2="12" y2="14"/>
        <line x1="9" y1="11" x2="15" y2="11"/>
      </svg>
    ),
    education: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
      </svg>
    ),
    consent: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={warna} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  }
  return icons[nama] || null
}

export default function ScreenMateriKomunikasi() {
  const navigate = useNavigate()
  const { bahasaPasien } = useApp()
  const [cariTeks, setCariTeks] = useState('')

  const kategoriFiter = KATEGORI_MATERI.filter(k =>
    k.nama.toLowerCase().includes(cariTeks.toLowerCase()) ||
    k.deskripsi.toLowerCase().includes(cariTeks.toLowerCase())
  )

  return (
    <div className="materi-container fade-in">
      {/* Header Khusus */}
      <div className="materi-header">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-dark">Materi Komunikasi Klinis</h1>
              <span className="badge-layer">Lapis 1</span>
            </div>
            <p className="text-sm text-gray mt-1">Bahasa aktif: <strong>{bahasaPasien.bahasa}</strong></p>
          </div>
          <button
            className="btn-atur-bahasa"
            onClick={() => navigate('/pemilihan-bahasa')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            Bahasa
          </button>
        </div>

        {/* Search */}
        <div className="search-wrapper mt-3">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="search-input"
            type="text"
            placeholder="Cari materi komunikasi..."
            value={cariTeks}
            onChange={e => setCariTeks(e.target.value)}
          />
        </div>
      </div>

      <div className="section" style={{paddingTop: 16}}>
        {/* Grid Kategori */}
        <div className="kategori-grid">
          {kategoriFiter.filter(k => !k.berisiko).map(kategori => (
            <button
              key={kategori.id}
              className="kategori-card"
              onClick={() => navigate(`/daftar-kalimat/${kategori.id}`)}
            >
              <div className="kategori-ikon-wrapper" style={{ backgroundColor: kategori.warna + '18' }}>
                <IkonKategori nama={kategori.icon} warna={kategori.warna} />
              </div>
              <p className="kategori-nama">{kategori.nama}</p>
              <p className="kategori-jumlah">{kategori.jumlahMateri} materi</p>
            </button>
          ))}
        </div>

        {/* Persetujuan Tindakan — Khusus */}
        {kategoriFiter.filter(k => k.berisiko).map(kategori => (
          <div key={kategori.id} className="persetujuan-card" onClick={() => navigate(`/daftar-kalimat/${kategori.id}`)}>
            <div className="flex items-center gap-3 mb-2">
              <div className="kategori-ikon-wrapper" style={{ backgroundColor: '#D69A3618' }}>
                <IkonKategori nama={kategori.icon} warna="#D69A36" />
              </div>
              <div>
                <p className="font-semibold text-base text-dark">{kategori.nama}</p>
                <p className="text-xs text-light">{kategori.jumlahMateri} materi</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'auto'}}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
            <PengamanKeselamatan
              tipe="warning"
              pesan={kategori.peringatan}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

