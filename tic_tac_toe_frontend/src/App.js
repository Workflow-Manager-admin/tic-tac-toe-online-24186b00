import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import AICommentary from './AICommentary';
import { fetchAICommentary } from './openaiCommentator';
import './AICommentary.css';

/**
 * The main App component.
 * (Integration demo: this should be adapted/integrated below your TTT controls and board.)
 */
function App() {
  const [theme, setTheme] = useState('light');

  // ---------------- AI COMMENTARY STATE -----------------
  const [openAiKey, setOpenAiKey] = useState(
    process.env.REACT_APP_OPENAI_API_KEY || ""
  );
  const [moveDesc, setMoveDesc] = useState("");
  const [boardState, setBoardState] = useState(""); // you should pass real grid here
  const [commentary, setCommentary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleMove = async () => {
    if (!moveDesc.trim()) {
      setAiError("Please describe the move.");
      return;
    }
    if (!openAiKey.trim()) {
      setAiError("Please enter your OpenAI API key.");
      return;
    }
    setAiError("");
    setAiLoading(true);
    try {
      // Replace boardState with real board string for production
      const text = await fetchAICommentary(boardState, moveDesc, openAiKey.trim());
      setCommentary(text);
    } catch (err) {
      setAiError(err.message || "Could not fetch commentary.");
      setCommentary("");
    }
    setAiLoading(false);
  };

  // --- Minimal demo: replace with your board/controls in real project ---
  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <label style={{ fontWeight: 600 }}>OpenAI API Key:</label>
          <input
            style={{
              borderRadius: "7px",
              border: "1px solid #eaeaee",
              fontSize: "0.97rem",
              padding: "6px 8px",
              marginLeft: "7px",
              background: "#f8f9fa",
              color: "#222",
              letterSpacing: "0.01em",
              minWidth: "180px"
            }}
            type="password"
            placeholder="Enter your OpenAI key"
            value={openAiKey}
            onChange={e => setOpenAiKey(e.target.value)}
          />
        </p>
        <div style={{margin: "22px 0 0 0"}}>
          <label style={{marginRight: "8px"}}>Describe the latest move:</label>
          <input 
            value={moveDesc}
            onChange={(e) => setMoveDesc(e.target.value)}
            placeholder='e.g., "X placed at 2,3"'
            style={{
              padding: "6px 13px",
              borderRadius: "7px",
              border: "1px solid #eaeaee",
              fontSize: "1rem",
              width: "170px",
              marginRight: "10px"
            }}
          />
          <button
            style={{
              padding: "6px 15px",
              borderRadius: "7px",
              border: "none",
              background: "var(--button-bg, #007bff)",
              color: "var(--button-text, #fff)",
              fontWeight: 600,
              cursor: "pointer"
            }}
            onClick={handleMove}
            disabled={aiLoading}
          >
            Commentate
          </button>
        </div>
        <AICommentary commentary={commentary} loading={aiLoading} error={aiError} />
        <p style={{ color: "#aaa", fontSize: "0.92rem", marginTop: "42px" }}>
          Edit <code>src/App.js</code> and save to reload.<br/>
          Current theme: <strong>{theme}</strong>
        </p>
        <a className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
