import { HashRouter, Routes, Route } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import CoursePage from './pages/CoursePage.jsx'

export default function App() {
  return (
    <HashRouter>
      <SiteHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
        </Routes>
      </main>
    </HashRouter>
  )
}
