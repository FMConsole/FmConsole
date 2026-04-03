import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Community from './pages/Community'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import TacticBuilder from './pages/TacticBuilder'
import SquadPlanner from './pages/SquadPlanner'
import StatsScanner from './pages/StatsScanner'
import PlayerComparison from './pages/PlayerComparison'
import TraitRecommender from './pages/TraitRecommender'
import Database from './pages/Database'
import Players from './pages/database/Players'
import PlayerDetail from './pages/database/PlayerDetail'
import Clubs from './pages/database/Clubs'
import ClubDetail from './pages/database/ClubDetail'
import Competitions from './pages/database/Competitions'
import CompetitionDetail from './pages/database/CompetitionDetail'
import Nations from './pages/database/Nations'
import NationDetail from './pages/database/NationDetail'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 70 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/community" element={<Community />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools/tactic-builder" element={<TacticBuilder />} />
          <Route path="/tools/squad-planner" element={<SquadPlanner />} />
          <Route path="/tools/stats-scanner" element={<StatsScanner />} />
          <Route path="/tools/player-comparison" element={<PlayerComparison />} />
          <Route path="/tools/trait-recommender" element={<TraitRecommender />} />
          <Route path="/database" element={<Database />} />
          <Route path="/database/players" element={<Players />} />
          <Route path="/database/players/:id" element={<PlayerDetail />} />
          <Route path="/database/clubs" element={<Clubs />} />
          <Route path="/database/clubs/:id" element={<ClubDetail />} />
          <Route path="/database/competitions" element={<Competitions />} />
          <Route path="/database/competitions/:id" element={<CompetitionDetail />} />
          <Route path="/database/nations" element={<Nations />} />
          <Route path="/database/nations/:id" element={<NationDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
