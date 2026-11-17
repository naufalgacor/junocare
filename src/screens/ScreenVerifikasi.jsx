import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HeaderHalaman from '../components/HeaderHalaman'
import PengamanKeselamatan from '../components/PengamanKeselamatan'
import { STATUS_LABEL } from '../data/dataLapis2'
import './ScreenVerifikasi.css'

const PANDUAN_TINDAKLANJUT = [
  { id: 'pt-1', label: 'Sampaikan informasi lanjutan kepada pasien menggunakan Materi Klinis Lapis 1' },
  { id: 'pt-2', label: 'Lakukan edukasi kesehatan sesuai keluhan yang teridentifikasi' },
  { id: 'pt-3', label: 'Pastikan pasien memahami penjelasan melalui metode Konfirmasi Pemahaman' },
  { id: 'pt-4', label: 'Catat hasil komunikasi dalam dokumen asuhan keperawatan sesuai prosedur' },
]

const CHECKLIST_PEMAHAMAN = [
  { id: 'ch-1', label: 'Pasien memahami informasi yang disampaikan' },
  { id: 'ch-2', label: 'Pasien dapat mengulang kembali informasi utama' },
  { id: 'ch-3', label: 'Pasien tidak tampak bingung atau ragu' },
  { id: 'ch-4', label: 'Pasien setuju dengan rencana komunikasi selanjutnya' },
]

function BadgeStatus({ status }) {
  const cfg = STATUS_LABEL[status] || STATUS_LABEL['belum-diketahui']
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px',
      borderRadius: 100, color: cfg.warna, backgroundColor: cfg.bg
    }}>
      {cfg.label}
    </span>
  )
}

function KartuRingkasan({ judul, ikon, nilai, status }) {
  return (
    <div className="kartu-ringkasan">
      <div className="kartu-ringkasan-header">
        <span style={{ fontSize: 13 }}>{ikon}</span>
        <span className="text-xs font-bold" style={{ color: '#4A5568' }}>{judul}</span>
        <BadgeStatus status={status} />
      </div>
      <p className="kartu-ringkasan-nilai">
        {nilai || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>—</span>}
      </p>
    </div>
  )
}

export default function ScreenVerifikasi() {
  const navigate = useNavigate()
  const { hasilInterpretasi, catatanVerifikasi, setCatatanVerifikasi } = useApp()
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [checklist, setChecklist] = useState({})
  const [panduanCheck, setPanduanCheck] = useState({})
  const [pilihanAkhir, setPilihanAkhir] = useState(null)
  const [tersimpan, setTersimpan] = useState(false)

  const toggleCheck = (id) => setChecklist(prev => ({ ...prev, [id]: !prev[id] }))
  const togglePanduan = (id) => setPanduanCheck(prev => ({ ...prev, [id]: !prev[id] }))

  const handlePutar = () => {
    setAudioPlaying(true)
    setTimeout(() => setAudioPlaying(false), 3000)
  }

  const handleSimpan = () => {
    const catatan = {
      id: Date.now(),
      waktu: new Date().toLocaleString('id-ID'),
      hasilInterpretasi,
      checklist,
      pilihanAkhir,
      status: pilihanAkhir === 'paham'
        ? 'Panduan Tindak Lanjut Selesai'
        : pilihanAkhir === 'ulang'
          ? 'Perlu Penjelasan Ulang'
          : 'Perlu Bantuan Penerjemah'
    }
    setCatatanVerifikasi(prev => [...prev, catatan])
    setTersimpan(true)
    setTimeout(() => navigate('/'), 1800)
  }

  // Interpretasi baru (format Lapis 2 revisi) atau lama
  const interpretasi = hasilInterpretasi?.interpretasi // object 4 kategori
  const ujaran = hasilInterpretasi?.ujaran || hasilInterpretasi?.teksTranskripsi
  const jumlahChecked = Object.values(checklist).filter(Boolean).length

  return (
    <div className="verifikasi-container fade-in">
      <HeaderHalaman
        judul="Panduan Tindak Lanjut"
        badge={{ teks: 'Lapis 3', style: { backgroundColor: '#D69A36' } }}
      />

      <div className="section">

        {/* ── Disclaimer Arsitektur ── */}
        <PengamanKeselamatan
          tipe="info"
          pesan="Lapis 3 menyediakan arahan komunikasi non-diagnostik berdasarkan informasi yang telah dikonfirmasi perawat di Lapis 2."
          detail="Panduan ini bukan diagnosis medis dan tidak menggantikan penilaian klinis."
        />

        {/* ── Ringkasan dari Lapis 2 ── */}
        <div className="card mt-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p className="text-sm font-bold text-primary">Ringkasan dari Lapis 2 (Terkonfirmasi Perawat)</p>
          </div>

          {ujaran && (
            <div className="ujaran-ringkas-lapis3">
              <span className="text-xs font-bold" style={{ color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ujaran Pasien
              </span>
              <p className="text-sm font-medium mt-1" style={{ fontStyle: 'italic', color: '#1A2332' }}>
                "{ujaran}"
              </p>
            </div>
          )}

          {/* 4 Kartu Kategori dari Lapis 2 */}
          {interpretasi ? (
            <div className="kartu-ringkasan-grid">
              <KartuRingkasan
                judul="Jawaban Konfirmasi" ikon="💬"
                nilai={interpretasi.jawabanKonfirmasi?.nilai}
                status={interpretasi.jawabanKonfirmasi?.status || 'tidak-disebutkan'}
              />
              <KartuRingkasan
                judul="Lokasi Keluhan" ikon="📍"
                nilai={interpretasi.lokasiKeluhan?.nilai}
                status={interpretasi.lokasiKeluhan?.status || 'tidak-disebutkan'}
              />
              <KartuRingkasan
                judul="Waktu / Durasi" ikon="⏱️"
                nilai={interpretasi.waktuDurasi?.nilai}
                status={interpretasi.waktuDurasi?.status || 'tidak-disebutkan'}
              />
              <KartuRingkasan
                judul="Status Keluhan" ikon="📊"
                nilai={interpretasi.statusKeluhan?.nilai}
                status={interpretasi.statusKeluhan?.status || 'belum-diketahui'}
              />
            </div>
          ) : hasilInterpretasi ? (
            /* format lama */
            <div className="ringkasan-blok">
              <div className="ringkasan-item">
                <span className="ringkasan-label">Interpretasi</span>
                <p className="ringkasan-teks font-semibold">
                  {hasilInterpretasi.interpretasi?.lokasiKeluhan?.nilai
                    || hasilInterpretasi.interpretasi
                    || '—'}
                </p>
              </div>
            </div>
          ) : (
            <div className="simulasi-kosong">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-gray text-center mt-2">
                Belum ada hasil dari Lapis 2.<br/>
                <span className="text-xs text-light">Selesaikan sesi Respons Pasien terlebih dahulu.</span>
              </p>
              <button className="btn btn-secondary btn-sm mt-3" onClick={() => navigate('/respons-pasien')}>
                Buka Respons Pasien (Lapis 2)
              </button>
            </div>
          )}
        </div>

        {/* ── Panduan Tindak Lanjut ── */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D69A36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <p className="text-base font-bold text-dark">Panduan Tindak Lanjut Komunikasi</p>
          </div>
          <p className="text-xs text-gray mb-3" style={{ lineHeight: 1.5 }}>
            Centang langkah yang sudah dilakukan. Panduan ini bersifat arahan komunikasi — bukan instruksi medis.
          </p>
          <div className="checklist-list">
            {PANDUAN_TINDAKLANJUT.map((item) => (
              <div key={item.id} className="checkbox-item" onClick={() => togglePanduan(item.id)}>
                <div className={`checkbox-custom ${panduanCheck[item.id] ? 'checked' : ''}`}>
                  {panduanCheck[item.id] && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${panduanCheck[item.id] ? 'font-semibold text-primary' : 'text-dark'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Konfirmasi Pemahaman (Teach-Back) ── */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#176B61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <p className="text-base font-bold text-dark">Konfirmasi Pemahaman Pasien</p>
          </div>

          <div className="teachback-panduan">
            <p className="text-xs text-gray" style={{ lineHeight: 1.6 }}>
              <strong>Metode Konfirmasi Pemahaman (Teach-Back):</strong> Minta pasien
              mengulang kembali informasi yang diterima dengan kata-katanya sendiri.
              Teknik ini memastikan pasien benar-benar memahami — bukan sekadar mengangguk.
            </p>
          </div>

          <button
            className={`btn-putar-ulang ${audioPlaying ? 'playing' : ''}`}
            onClick={handlePutar}
          >
            <div className="putar-ikon">
              {audioPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </div>
            <span>{audioPlaying ? 'Sedang memutar...' : 'Putar Ulang Penjelasan (Simulasi)'}</span>
          </button>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-dark">Status Pemahaman Pasien</p>
              <span className="badge badge-primary">{jumlahChecked}/{CHECKLIST_PEMAHAMAN.length}</span>
            </div>
            <div className="checklist-list">
              {CHECKLIST_PEMAHAMAN.map((item) => (
                <div key={item.id} className="checkbox-item" onClick={() => toggleCheck(item.id)}>
                  <div className={`checkbox-custom ${checklist[item.id] ? 'checked' : ''}`}>
                    {checklist[item.id] && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${checklist[item.id] ? 'font-semibold text-primary' : 'text-dark'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kesimpulan ── */}
        <div className="card mb-4">
          <p className="text-base font-bold text-dark mb-3">Kesimpulan Panduan Tindak Lanjut</p>
          <div className="pilihan-hasil">
            {[
              { id: 'paham', label: 'Pasien memahami — komunikasi berhasil', ikon: '✓', warna: '#176B61', bg: '#EAF4F2' },
              { id: 'ulang', label: 'Perlu penjelasan ulang', ikon: '↻', warna: '#D69A36', bg: '#FFF8EC' },
              { id: 'penerjemah', label: 'Perlu bantuan penerjemah', ikon: '👥', warna: '#2563EB', bg: '#EEF2FF' },
            ].map(p => (
              <button
                key={p.id}
                className={`pilihan-btn ${pilihanAkhir === p.id ? 'pilihan-btn--aktif' : ''}`}
                onClick={() => setPilihanAkhir(p.id)}
                style={pilihanAkhir === p.id ? { borderColor: p.warna, backgroundColor: p.bg } : {}}
              >
                <span className="pilihan-ikon" style={pilihanAkhir === p.id ? { color: p.warna, backgroundColor: p.bg } : {}}>
                  {p.ikon}
                </span>
                <span className="pilihan-label" style={pilihanAkhir === p.id ? { color: p.warna, fontWeight: 700 } : {}}>
                  {p.label}
                </span>
              </button>
            ))}
          </div>

          {pilihanAkhir === 'penerjemah' && (
            <div className="mt-3">
              <PengamanKeselamatan
                tipe="warning"
                pesan="Hubungi koordinator untuk menyediakan penerjemah kompeten."
                detail="Jangan lanjutkan komunikasi klinis kritis tanpa bantuan penerjemah terlatih."
              />
            </div>
          )}
        </div>

        {/* ── Safety Gate Final ── */}
        <PengamanKeselamatan
          tipe="info"
          pesan="Panduan tindak lanjut ini tidak menggantikan penilaian klinis perawat."
          detail="Semua keputusan tindakan medis tetap merupakan tanggung jawab tenaga kesehatan berlisensi. JUNOCARE adalah alat bantu komunikasi, bukan alat diagnostik."
        />
      </div>

      {/* ── Tombol Simpan ── */}
      <div className="verifikasi-footer">
        {tersimpan ? (
          <div className="simpan-sukses">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Panduan tindak lanjut tersimpan
          </div>
        ) : (
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSimpan}
            disabled={!pilihanAkhir}
            style={{ opacity: pilihanAkhir ? 1 : 0.5 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Simpan Panduan Tindak Lanjut
          </button>
        )}
      </div>
    </div>
  )
}
