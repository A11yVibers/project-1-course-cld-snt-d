import { useEffect, useState } from 'react'

// Minimal hash router: "#/" is the catalog, "#/course/<id>" is a course page.
// Keeps the stack dependency-free while still giving real, shareable URLs
// and working browser back/forward navigation.
function parseHash(hash) {
  const clean = hash.replace(/^#\/?/, '')
  const [section, courseId] = clean.split('/')
  if (section === 'course' && courseId) {
    return { name: 'course', courseId }
  }
  return { name: 'catalog' }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goToCatalog = () => {
    window.location.hash = '#/'
  }
  const goToCourse = (courseId) => {
    window.location.hash = `#/course/${courseId}`
  }

  return { route, goToCatalog, goToCourse }
}
