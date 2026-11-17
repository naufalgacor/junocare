import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BAHASA_TERSEDIA } from '../data/dataJunocare'
import HeaderHalaman from '../components/HeaderHalaman'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import './ScreenPemilihanBahasa.css'

export default function ScreenPemilihanBahasa() {
  const navigate = useNavigate()
  const { bahasaPasien, setBasasaPasien } = useApp()

  const [bahasaTerpilih, setBahasaTerpilih] = useState(
    BAHASA_TERSEDIA.find(b => b.nama === bahasaPasien.bahasa) || BAHASA_TERSEDIA[1]
  )
  const [variasiTerpilih, setVariasiTerpilih] = useState(bahasaPasien.variasi || '')
  const [butuhPenerjemah, setButuhPenerjemah] = useState(false)

  const handlePilihBahasa = (bahasa) => {
    if (!bahasa.tersedia) return
    setBahasaTerpilih(bahasa)
    setVariasiTerpilih(bahasa.variasi?.[0]?.nama || '')
    setButuhPenerjemah(false)
  }

  const handleLanjutkan = () => {
    setBasasaPasien({
      bahasa: bahasaTerpilih.nama,
      variasi: variasiTerpilih,
      butuhPenerjemah
    })
    navigate('/materi-komunikasi')
  }

  return (
    <div className="pemilihan-container fade-in">
      <HeaderHalaman judul="Pemilihan Bahasa" />

      <div className="section">
        <div className="pemilihan-intro card mb-4">
          <p className="text-sm text-gray">
            Tentukan bahasa komunikasi yang paling nyaman dipahami pasien.
          </p>
        </div>

        {/* Pilihan Bahasa */}
        <p className="form-label mb-3" style={{marginBottom: 10}}>Bahasa Pilihan Pasien</p>
        <div className="bahasa-grid">
          {BAHASA_TERSEDIA.map(bahasa => (
            <button
              key={bahasa.id}
              className={`bahasa-card ${bahasaTerpilih?.id === bahasa.id ? 'bahasa-card--aktif' : ''} ${!bahasa.tersedia ? 'bahasa-card--nonaktif' : ''}`}
              onClick={() => handlePilihBahasa(bahasa)}
              disabled={!bahasa.tersedia}
            >
              <span className="bahasa-card-ikon">{bahasa.icon}</span>
              <span className="bahasa-card-nama">{bahasa.nama}</span>
              {!bahasa.tersedia && (
                <span className="bahasa-card-status">{bahasa.keterangan}</span>
              )}
              {bahasaTerpilih?.id === bahasa.id && bahasa.tersedia && (
                <span className="bahasa-card-ceklis">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info modular */}
        <PengamanKeselamatan
          tipe="info"
          pesan="Bahasa daerah lain dapat ditambahkan melalui pembaruan modular JUNOCARE."
        />

        {/* Variasi Tutur */}
        {bahasaTerpilih?.variasi?.length > 0 && (
          <div className="form-group mt-4">
            <label className="form-label">Variasi Tutur (Opsional)</label>
            <select
              className="form-select"
              value={variasiTerpilih}
              onChange={e => setVariasiTerpilih(e.target.value)}
            >
              <option value="">-- Pilih Variasi Tutur --</option>
              {bahasaTerpilih.variasi.map(v => (
                <option key={v.id} value={v.nama}>{v.nama}</option>
              ))}
            </select>
            <p className="text-xs text-light mt-2">
              Pilih variasi tutur yang paling sesuai dengan pasien untuk komunikasi lebih efektif.
            </p>
          </div>
        )}

        {/* Butuh Penerjemah */}
        <div className="card mt-4">
          <p className="text-sm font-semibold text-dark mb-3">
            Apakah pasien membutuhkan bantuan penerjemah?
          </p>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${!butuhPenerjemah ? 'active' : ''}`}
              onClick={() => setButuhPenerjemah(false)}
            >
              ✓ Tidak
            </button>
            <button
              className={`toggle-btn ${butuhPenerjemah ? 'active' : ''}`}
              onClick={() => setButuhPenerjemah(true)}
            >
              Ya
            </button>
          </div>
          {butuhPenerjemah && (
            <div className="mt-3">
              <PengamanKeselamatan
                tipe="warning"
                pesan="Bantuan penerjemah kompeten diperlukan"
                detail="Hubungi koordinator untuk menyediakan penerjemah sebelum melanjutkan komunikasi klinis."
              />
            </div>
          )}
        </div>
      </div>

      {/* Tombol Lanjutkan */}
      <div className="pemilihan-footer">
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleLanjutkan}
          disabled={!bahasaTerpilih?.tersedia}
        >
          Lanjutkan ke Materi Komunikasi
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

