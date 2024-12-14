import FlappyBird from "./FlappyBird";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Leaderboard from "./Leaderboard";
import './App.css';
import { useState } from "react";
import AddToLb from "./AddToLb";
import About from "./About";
import BlogPage from "./BlogPage";


function App() {
 
  const [score, setScore] = useState(0);
  
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Router>
    <div>
      {/* Navigation links */}
      {/* <nav>
        <Link to="/">Game</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav> */}
    <nav className={menuOpen ? 'show-menu' : ''}>
      <h2>FlappyBird</h2>
      <span className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </span>
      <ul className={menuOpen ? "show-menu" : ""}>
        <li>
          <Link to="/" onClick={closeMenu}>Game</Link>
        </li>
        <li>
          <Link to="/leaderboard" onClick={closeMenu}>Leaderboard</Link>
        </li>
        <li>
          <Link to="/blog" onClick={closeMenu}>Blog</Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMenu}>About</Link>
        </li>
      </ul>
    </nav>



      {/* Define routes */}
      <Routes>
        <Route path="/" element={<FlappyBird score={score} setScore={setScore}   />} />
        <Route path="/leaderboard" element={<Leaderboard  />} />
        <Route path="/addtolb" element={<AddToLb score={score} setScore={setScore} />} />
        <Route path="/about" element={<About/>} />
        <Route path="/blog" element={<BlogPage/>}/>
      </Routes>
    </div>
     <br></br>
     <br></br>
  </Router>
  );
}

export default App;
