import React from "react";
import GameCanvas from "./GameCanvas";
import "./App.css";

const App = () => {
  const pressKey = (key) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key }));
    }, 100);
  };

  return (
    <div className="gameboy-body">
      <div className="gameboy-screen">
        <GameCanvas />
      </div>

      <div className="gameboy-buttons">
        <div style={{ display: "flex" }}>
          <div className="dpad">
            <button className="btn up" onClick={() => pressKey("ArrowUp")}>
              ▲
            </button>
            <button className="btn left" onClick={() => pressKey("ArrowLeft")}>
              ◀
            </button>
            <button
              className="btn right"
              onClick={() => pressKey("ArrowRight")}
            >
              ▶
            </button>
            <button className="btn down" onClick={() => pressKey("ArrowDown")}>
              ▼
            </button>
          </div>

          <div className="ab-buttons">
            <button className="btn btn-b" onClick={() => pressKey(" ")}>
              B
            </button>
            <button className="btn btn-a" onClick={() => pressKey("a")}>
              A
            </button>
          </div>
        </div>

        <div className="start-select">
          <button className="btn start" onClick={() => alert("START!")}>
            START
          </button>
          <button className="btn select" onClick={() => alert("SELECT!")}>
            SELECT
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
