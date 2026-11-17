import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeaderHalaman({ judul, badge, kanan, kembali }) {
  const navigate = useNavigate()
  return (
    <div className="page-header">
      <button className="back-btn" onClick={() => kembali ? kembali() : navigate(-1)} aria-label="Kembali">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <div className="flex items-center gap-2" style={{ flex: 1 }}>
        <h1 className="page-header-title">{judul}</h1>
        {badge && <span className={`badge-layer ${badge.warna ? '' : ''}`} style={badge.style}>{badge.teks}</span>}
      </div>
      {kanan}
    </div>
  )
}

