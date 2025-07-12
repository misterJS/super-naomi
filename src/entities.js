import Matter from "matter-js";

export default (engine) => {
  const player = Matter.Bodies.rectangle(50, 300, 50, 50, { label: "player" });
  const ground = Matter.Bodies.rectangle(400, 600, 800, 50, { isStatic: true });

  Matter.World.add(engine.world, [player, ground]);

  return {
    physics: { engine: engine, world: engine.world },
    player: { body: player, color: "red", size: [50, 50] },
    ground: { body: ground, color: "green", size: [800, 50] },
  };
};
