import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getKalimatByKategori, KATEGORI_MATERI } from '../data/dataJunocare'
import HeaderHalaman from '../components/HeaderHalaman'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import './ScreenDaftarKalimat.css'

const FILTER_CHIPS = ['Semua', 'Nyeri', 'Lokasi', 'Durasi', 'Skala', 'Sifat']

export default function ScreenDaftarKalimat() {
  const navigate = useNavigate()
  const { kategori } = useParams()
  const { bahasaPasien } = useApp()
  const [filterAktif, setFilterAktif] = useState('Semua')
  const [audioPlaying, setAudioPlaying] = useState(null)

  const infoKategori = KATEGORI_MATERI.find(k => k.id === kategori)
  const daftarKalimat = getKalimatByKategori(kategori)

  const kalimatTerfilter = filterAktif === 'Semua'
    ? daftarKalimat
    : daftarKalimat.filter(k => k.tag?.includes(filterAktif))

  const handlePlay = (id) => {
    if (audioPlaying === id) {
      setAudioPlaying(null)
    } else {
      setAudioPlaying(id)
      setTimeout(() => setAudioPlaying(null), 3000) // simulasi
    }
  }

  const getTranslation = (item) => {
    if (bahasaPasien.bahasa === 'Bahasa Jawa') return item.jawaText
    if (bahasaPasien.bahasa === 'Bahasa Sunda') return item.sundasText
    return item.indonesiaText
  }

  return (
    <div className="daftar-container fade-in">
      <HeaderHalaman
        judul={infoKategori?.nama || 'Daftar Kalimat'}
        badge={{ teks: 'Lapis 1' }}
      />

      {infoKategori?.berisiko && (
        <div className="px-4" style={{paddingTop: 12}}>
          <PengamanKeselamatan
            tipe="warning"
            pesan={infoKategori.peringatan}
          />
        </div>
      )}

      {/* Filter Chip */}
      {kategori === 'pengkajian-keluhan' && (
        <div className="filter-chips-wrapper">
          <div className="filter-chips">
            {FILTER_CHIPS.map(chip => (
              <button
                key={chip}
                className={`chip ${filterAktif === chip ? 'chip-active' : 'chip-default'}`}
                onClick={() => setFilterAktif(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Bahasa */}
      <div className="daftar-bahasa-info">
        <span className="text-xs text-gray">Menampilkan: </span>
        <span className="badge badge-secondary text-xs">{bahasaPasien.bahasa}</span>
        {bahasaPasien.variasi && <span className="text-xs text-light">· {bahasaPasien.variasi}</span>}
      </div>

      {/* Daftar */}
      <div className="daftar-list">
        {kalimatTerfilter.length === 0 ? (
          <div className="daftar-kosong">
            <p className="text-gray">Tidak ada materi untuk filter ini.</p>
          </div>
        ) : (
          kalimatTerfilter.map(item => (
            <div key={item.id} className="kalimat-item">
              <div
                className="kalimat-item-isi"
                onClick={() => navigate(`/detail-materi/${item.id}`)}
              >
                <div className="kalimat-info">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="kalimat-judul">{item.judul}</p>
                    {item.validasi?.status === 'tervalidasi' && (
                      <span className="validasi-badge">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Tervalidasi
                      </span>
                    )}
                  </div>
                  <p className="kalimat-preview text-gray">{getTranslation(item)}</p>
                </div>
              </div>
              <button
                className={`btn-play-kalimat ${audioPlaying === item.id ? 'playing' : ''}`}
                onClick={() => handlePlay(item.id)}
                aria-label={audioPlaying === item.id ? 'Hentikan audio' : 'Putar audio'}
              >
                {audioPlaying === item.id ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="daftar-catatan">
        <p className="text-xs text-light text-center">
          ⚠️ Data ilustrasi — Belum tervalidasi secara klinis untuk penggunaan aktual
        </p>
      </div>
    </div>
  )
}

