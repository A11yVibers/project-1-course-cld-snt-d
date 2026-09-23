import { HashRouter, Routes, Route } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
