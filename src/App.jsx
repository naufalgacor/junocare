import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import ScreenBeranda from './screens/ScreenBeranda'
import ScreenPemilihanBahasa from './screens/ScreenPemilihanBahasa'
import ScreenMateriKomunikasi from './screens/ScreenMateriKomunikasi'
import ScreenDaftarKalimat from './screens/ScreenDaftarKalimat'
import ScreenDetailMateri from './screens/ScreenDetailMateri'
import ScreenTampilanPasien from './screens/ScreenTampilanPasien'
import ScreenResponsPasien from './screens/ScreenResponsPasien'
import ScreenVerifikasi from './screens/ScreenVerifikasi'
import ScreenPengaturan from './screens/ScreenPengaturan'
import NavigasiUtama from './components/NavigasiUtama'
import { AppContext } from './context/AppContext'
import './App.css'

function AppContent() {
  const location = useLocation()
  const hiddenNavRoutes = ['/tampilan-pasien']
  const showNav = !hiddenNavRoutes.some(r => location.pathname.startsWith(r))

  return (
    <div className="app-shell">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<ScreenBeranda />} />
          <Route path="/pemilihan-bahasa" element={<ScreenPemilihanBahasa />} />
          <Route path="/materi-komunikasi" element={<ScreenMateriKomunikasi />} />
          <Route path="/daftar-kalimat/:kategori" element={<ScreenDaftarKalimat />} />
          <Route path="/detail-materi/:id" element={<ScreenDetailMateri />} />
          <Route path="/tampilan-pasien/:id" element={<ScreenTampilanPasien />} />
          <Route path="/respons-pasien" element={<ScreenResponsPasien />} />
          <Route path="/verifikasi" element={<ScreenVerifikasi />} />
          <Route path="/pengaturan" element={<ScreenPengaturan />} />
        </Routes>
      </div>
      {showNav && <NavigasiUtama />}
    </div>
  )
}

export default function App() {
  const [sesiAktif, setSesiAktif] = useState(null)
  const [bahasaPasien, setBasasaPasien] = useState({ bahasa: 'Bahasa Jawa', variasi: 'Jawa Ngoko (sehari-hari)' })
  const [hasilInterpretasi, setHasilInterpretasi] = useState(null)
  const [catatanVerifikasi, setCatatanVerifikasi] = useState([])

  return (
    <AppContext.Provider value={{
      sesiAktif, setSesiAktif,
      bahasaPasien, setBasasaPasien,
      hasilInterpretasi, setHasilInterpretasi,
      catatanVerifikasi, setCatatanVerifikasi
    }}>
      <Router>
        <AppContent />
      </Router>
    </AppContext.Provider>
  )
}

