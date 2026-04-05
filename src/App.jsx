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
import SquadBuilder from './pages/SquadBuilder'
import PlayerComparison from './pages/PlayerComparison'
import TraitRecommender from './pages/TraitRecommender'
import PlayerAnalyser from './pages/PlayerAnalyser'
import TransferAnalysis from './pages/TransferAnalysis'
import Database from './pages/Database'
import Players from './pages/database/Players'
import PlayerDetail from './pages/database/PlayerDetail'
import Clubs from './pages/database/Clubs'
import ClubDetail from './pages/database/ClubDetail'
import Competitions from './pages/database/Competitions'
import CompetitionDetail from './pages/database/CompetitionDetail'
import Nations from './pages/database/Nations'
import NationDetail from './pages/database/NationDetail'
import AdLayout from './components/AdLayout'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 70 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<AdLayout><Tools /></AdLayout>} />
          <Route path="/community" element={<AdLayout><Community /></AdLayout>} />
          <Route path="/blog" element={<AdLayout><Blog /></AdLayout>} />
          <Route path="/about" element={<AdLayout><About /></AdLayout>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools/tactic-builder" element={<TacticBuilder />} />
          <Route path="/tools/squad-builder" element={<SquadBuilder />} />
          <Route path="/tools/player-comparison" element={<PlayerComparison />} />
          <Route path="/tools/trait-recommender" element={<TraitRecommender />} />
          <Route path="/tools/player-analyser" element={<PlayerAnalyser />} />
          <Route path="/tools/transfer-analysis" element={<TransferAnalysis />} />
          <Route path="/database" element={<AdLayout><Database /></AdLayout>} />
          <Route path="/database/players" element={<AdLayout><Players /></AdLayout>} />
          <Route path="/database/players/:id" element={<PlayerDetail />} />
          <Route path="/database/clubs" element={<AdLayout><Clubs /></AdLayout>} />
          <Route path="/database/clubs/:id" element={<ClubDetail />} />
          <Route path="/database/competitions" element={<AdLayout><Competitions /></AdLayout>} />
          <Route path="/database/competitions/:id" element={<CompetitionDetail />} />
          <Route path="/database/nations" element={<AdLayout><Nations /></AdLayout>} />
          <Route path="/database/nations/:id" element={<NationDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
