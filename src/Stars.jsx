// Stars.jsx
import React from "react";

const Stars = ({ count = 100 }) => {
  const stars = Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 2 + 1; // 1-3px
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2; // 2-5s

    return (
      <div
        key={i}
        className="star"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });

  return <div className="stars-overlay">{stars}</div>;
};

export default Stars;
