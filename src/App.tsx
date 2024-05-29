import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Play from './pages/play/Play';
import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play" element={<Play />} />
    </Routes>
  );
}

export default App;
