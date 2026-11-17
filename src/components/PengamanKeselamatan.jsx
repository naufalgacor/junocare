import React from 'react'
import './PengamanKeselamatan.css'

export default function PengamanKeselamatan({ tipe = 'warning', pesan, detail }) {
  const config = {
    warning: {
      warna: '#D69A36',
      bg: '#FFF8EC',
      border: '#F5D78E',
      ikon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D69A36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )
    },
    info: {
      warna: '#176B61',
      bg: '#EAF4F2',
      border: 'rgba(23,107,97,0.2)',
      ikon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )
    },
    danger: {
      warna: '#C0392B',
      bg: '#FDECEA',
      border: '#FFCDD2',
      ikon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )
    }
  }

  const c = config[tipe]

  return (
    <div className="pengaman-keselamatan" style={{ backgroundColor: c.bg, borderColor: c.border }}>
      <span className="pengaman-ikon">{c.ikon}</span>
      <div>
        <p className="pengaman-pesan" style={{ color: c.warna === '#176B61' ? '#0f4f47' : c.warna }}>
          {pesan}
        </p>
        {detail && <p className="pengaman-detail">{detail}</p>}
      </div>
    </div>
  )
}

