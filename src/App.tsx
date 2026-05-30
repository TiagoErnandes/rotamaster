import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Home } from './pages/Home';
import { ViewRotation } from './pages/ViewRotation';
import { Ranking } from './pages/Ranking';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-game-950 text-gray-100 font-game flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/view" element={<ViewRotation />} />
            <Route path="/ranking" element={<Ranking />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
