import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMateriById } from '../data/dataJunocare'
import { useApp } from '../context/AppContext'
import './ScreenTampilanPasien.css'

export default function ScreenTampilanPasien() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { bahasaPasien } = useApp()
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)

  const materi = getMateriById(id)

  if (!materi) {
    return <div className="pasien-container">Materi tidak ditemukan.</div>
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
    <div className="pasien-container fade-in">
      {/* Badge Mode Pasien */}
      <div className="pasien-mode-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        Tampilan Pasien
      </div>

      {/* Konten Utama Pasien */}
      <div className="pasien-konten">
        {/* Label bahasa */}
        <div className="pasien-bahasa-label">
          <span>{terjemahan.label}</span>
        </div>

        {/* Teks Utama Bahasa Daerah — BESAR */}
        <div className="pasien-teks-utama">
          <p>{terjemahan.teks}</p>
        </div>

        {/* Terjemahan pendukung */}
        <div className="pasien-teks-pendukung">
          <p className="pasien-pendukung-label">Bahasa Indonesia:</p>
          <p className="pasien-pendukung-teks">{materi.indonesiaText}</p>
        </div>

        {/* Tombol Audio BESAR */}
        <div className="pasien-audio-wrapper">
          <button
            className={`pasien-audio-btn ${audioPlaying ? 'playing' : ''}`}
            onClick={handlePlay}
            aria-label={audioPlaying ? 'Hentikan audio' : 'Dengarkan pertanyaan'}
          >
            {audioPlaying ? (
              <svg width="52" height="52" viewBox="0 0 24 24" fill="white" stroke="none">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white"/>
                <path d="M19.07 4.93a10 10 0 010 14.14"/>
                <path d="M15.54 8.46a5 5 0 010 7.07"/>
              </svg>
            )}
          </button>
          <p className="pasien-audio-label">
            {audioPlaying ? 'Sedang memutar...' : 'Dengarkan Pertanyaan'}
          </p>

          {/* Progress bar audio */}
          {audioPlaying && (
            <div className="pasien-audio-progress">
              <div className="pasien-progress-fill" style={{width: `${audioProgress}%`}}/>
            </div>
          )}
        </div>

        {/* Instruksi untuk Pasien */}
        <div className="pasien-instruksi">
          <div className="pasien-instruksi-ikon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="pasien-instruksi-teks">
            Silakan jawab dengan bahasa yang nyaman Anda gunakan.
          </p>
        </div>

        {/* Tombol Ulangi */}
        <button
          className="btn btn-secondary btn-full"
          onClick={handlePlay}
          style={{marginTop: 12}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Ulangi Audio
        </button>
      </div>

      {/* Tombol kembali ke perawat */}
      <div className="pasien-footer">
        <button
          className="btn btn-outline btn-full"
          onClick={() => navigate(-1)}
        >
          Kembali ke Mode Perawat
        </button>
      </div>
    </div>
  )
}

