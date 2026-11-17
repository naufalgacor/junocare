import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { getMateriById } from '../data/dataJunocare'
import HeaderHalaman from '../components/HeaderHalaman'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import './ScreenDetailMateri.css'

export default function ScreenDetailMateri() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { bahasaPasien } = useApp()
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)

  const materi = getMateriById(id)

  if (!materi) {
    return (
      <div className="detail-container">
        <HeaderHalaman judul="Detail Materi" />
        <div className="section"><p className="text-gray">Materi tidak ditemukan.</p></div>
      </div>
    )
  }

  const getTranslation = () => {
    if (bahasaPasien.bahasa === 'Bahasa Jawa') return { teks: materi.jawaText, label: 'Bahasa Jawa' }
    if (bahasaPasien.bahasa === 'Bahasa Sunda') return { teks: materi.sundasText, label: 'Bahasa Sunda' }
    return { teks: materi.indonesiaText, label: 'Bahasa Indonesia' }
  }

  const terjemahan = getTranslation()

  const handlePlay = () => {
    if (audioPlaying) {
      setAudioPlaying(false)
      setAudioProgress(0)
      return
    }
    setAudioPlaying(true)
    // Simulasi progress
    let prog = 0
    const interval = setInterval(() => {
      prog += 2
      setAudioProgress(prog)
      if (prog >= 100) {
        clearInterval(interval)
        setAudioPlaying(false)
        setAudioProgress(0)
      }
    }, 60)
  }

  return (
    <div className="detail-container fade-in">
      <HeaderHalaman
        judul="Detail Materi"
        badge={{ teks: 'Lapis 1' }}
      />

      <div className="section">
        {/* Judul & Status Validasi */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray">{materi.judul}</p>
            {materi.validasi?.status === 'tervalidasi' ? (
              <span className="validasi-status tervalidasi">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Telah Divalidasi
              </span>
            ) : (
              <span className="validasi-status belum">
                ⚠️ Perlu Tinjauan
              </span>
            )}
          </div>
          <p className="text-xs text-light">
            {materi.catatan}
          </p>
        </div>

        {/* Bahasa Indonesia */}
        <div className="bahasa-blok card mb-3">
          <p className="bahasa-blok-label">Bahasa Indonesia</p>
          <p className="bahasa-blok-teks">{materi.indonesiaText}</p>
        </div>

        {/* Bahasa Daerah */}
        <div className="bahasa-blok card bahasa-blok--daerah mb-4">
          <p className="bahasa-blok-label">{terjemahan.label}</p>
          <p className="bahasa-blok-teks">{terjemahan.teks}</p>
        </div>

        {/* Audio Player */}
        <div className="audio-player card mb-4">
          <div className="flex items-center gap-3 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
            <div>
              <p className="text-sm font-semibold">Audio Penutur Asli</p>
              <p className="text-xs text-light">{materi.audioInfo}</p>
            </div>
          </div>

          <div className="audio-controls">
            <button className="audio-btn-main" onClick={handlePlay}>
              {audioPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>

            <div className="audio-waveform">
              <div className="progress-bar" style={{marginBottom: 6}}>
                <div className="progress-fill" style={{width: `${audioProgress}%`}}/>
              </div>
              <div className="audio-waveform-visual">
                {Array.from({length: 20}, (_, i) => (
                  <div
                    key={i}
                    className={`waveform-bar ${audioPlaying ? 'waveform-bar--playing' : ''}`}
                    style={{
                      height: `${Math.random() * 20 + 8}px`,
                      animationDelay: `${i * 0.07}s`,
                      backgroundColor: audioProgress / 100 > i / 20 ? '#176B61' : '#CBD5E0'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-light">0:00</span>
                <span className="text-xs text-light">0:06</span>
              </div>
            </div>

            <button
              className="btn-icon"
              style={{ backgroundColor: '#EAF4F2', color: '#176B61' }}
              onClick={() => { setAudioProgress(0); setAudioPlaying(false) }}
              title="Ulangi"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Info validasi */}
        {materi.validasi?.tanggal && (
          <div className="validasi-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-xs text-light">
              Validasi: {materi.validasi.tanggal} · {materi.validasi.oleh}
            </span>
          </div>
        )}

        {materi.berisiko && (
          <PengamanKeselamatan
            tipe="warning"
            pesan={materi.peringatan}
          />
        )}
      </div>

      {/* Tombol Tampilkan ke Pasien */}
      <div className="detail-footer">
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={() => navigate(`/tampilan-pasien/${materi.id}`)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          Tampilkan kepada Pasien
        </button>
      </div>
    </div>
  )
}

