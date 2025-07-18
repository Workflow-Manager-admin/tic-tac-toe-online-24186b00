import React from "react";
import "./AICommentary.css";

// PUBLIC_INTERFACE
function AICommentary({ commentary, loading, error }) {
  /** 
   * Displays AI commentary below the game controls.
   * @param {string} commentary - Current commentary text
   * @param {boolean} loading - Shows loading state when fetching commentary
   * @param {string} error - Error message, if any
   */
  return (
    <div className="ai-commentary-container" data-testid="ai-commentary">
      <div className="ai-commentary-label">Game Commentary</div>
      <div className={`ai-commentary-box${loading ? " ai-commentary-loading" : ""}`}>
        {loading ? (
          <span className="ai-spinner" aria-label="Loading commentary..."></span>
        ) : error ? (
          <span className="ai-commentary-error">{error}</span>
        ) : (
          <span>{commentary}</span>
        )}
      </div>
    </div>
  );
}

export default AICommentary;
