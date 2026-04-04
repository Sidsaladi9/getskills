import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import SkillDetail from './pages/SkillDetail'
import Submit from './pages/Submit'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Library from './pages/Library'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/skill/:id" element={<SkillDetail />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
