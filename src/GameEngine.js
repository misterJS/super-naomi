import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import createEntities from "./entities";

export default function GameEngine() {
  const scene = useRef();
  const engine = Matter.Engine.create();
  const entities = createEntities(engine);

  useEffect(() => {
    const render = Matter.Render.create({
      element: scene.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#87CEEB",
      },
    });

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    const handleKeyDown = (e) => {
      const { player } = entities;
      if (e.key === "ArrowRight") {
        Matter.Body.setVelocity(player.body, {
          x: 5,
          y: player.body.velocity.y,
        });
      }
      if (e.key === "ArrowLeft") {
        Matter.Body.setVelocity(player.body, {
          x: -5,
          y: player.body.velocity.y,
        });
      }
      if (e.key === " " || e.key === "ArrowUp") {
        Matter.Body.setVelocity(player.body, {
          x: player.body.velocity.x,
          y: -10,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [engine, entities]);

  return <div ref={scene} />;
}
