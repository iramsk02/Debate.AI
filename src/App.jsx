import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import DebatePage from './components/DebatePage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/debate" element={<DebatePage />} />
      </Routes>
    </Router>
  )
}

export default App
