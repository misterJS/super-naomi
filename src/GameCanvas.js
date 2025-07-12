import React, { useRef, useEffect } from "react";
import standImg from "./assets/motion/stand.PNG";
import walk1Img from "./assets/motion/walk.PNG";
import walk2Img from "./assets/motion/walk2.PNG";
import brickImg from "./assets/brick.png";
import grassImg from "./assets/ground.png";
import topBrickImg from "./assets/top-brick.png";
import coinImg from "./assets/coin.png";
import coinSoundUrl from "./assets/coin.mp3";
import bgmUrl from "./assets/super-naomi-bgm.mp3";
import jumpUrl from "./assets/jump.mp3";
import imageNaomi6 from "./assets/super-naomi-6.png";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const scoreRef = useRef(0);
  const frameCount = useRef(0);
  const offsetX = useRef(0);

  const gravity = 0.5;
  let velocityY = 0;
  let jumping = false;

  const canvasWidth = 800;
  const canvasHeight = 400;
  const grassTopY = 368;

  const marioRef = useRef({
    x: canvasWidth / 2 - 25,
    y: grassTopY - 70,
    width: 50,
    height: 70,
    speed: 3,
  });

  const coinsRef = useRef([
    { x: 500, y: grassTopY - 100, width: 30, height: 30, collected: false },
    { x: 600, y: grassTopY - 100, width: 30, height: 30, collected: false },
    { x: 900, y: grassTopY - 100, width: 30, height: 30, collected: false },
    { x: 1000, y: grassTopY - 100, width: 30, height: 30, collected: false },
  ]);

  const topBricksRef = useRef([
    {
      x: 520,
      y: 280,
      width: 80,
      height: 90,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 600,
      y: 200,
      width: 80,
      height: 90,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 950,
      y: 150,
      width: 80,
      height: 90,
      hit: false,
      animY: 0,
      animating: false,
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const standSprite = new Image();
    const walkSprite1 = new Image();
    const walkSprite2 = new Image();
    const brickSprite = new Image();
    const grassSprite = new Image();
    const coinSprite = new Image();
    const naomi6Sprite = new Image();
    const topBrickSprite = new Image();

    topBrickSprite.src = topBrickImg;
    standSprite.src = standImg;
    walkSprite1.src = walk1Img;
    walkSprite2.src = walk2Img;
    brickSprite.src = brickImg;
    grassSprite.src = grassImg;
    coinSprite.src = coinImg;
    naomi6Sprite.src = imageNaomi6;

    const coinSound = new Audio(coinSoundUrl);
    const bgm = new Audio(bgmUrl);
    const jumpSound = new Audio(jumpUrl);

    bgm.loop = true;
    bgm.volume = 0.4;
    coinSound.volume = 0.2;
    jumpSound.volume = 0.2;

    const loop = () => {
      const mario = marioRef.current;
      const offset = offsetX.current;
      frameCount.current++;

      ctx.fillStyle = "#4e9fe5";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      velocityY += gravity;
      mario.y += velocityY;

      if (mario.y + mario.height >= grassTopY) {
        mario.y = grassTopY - mario.height;
        velocityY = 0;
        jumping = false;
      }

      if (keys.current["ArrowRight"]) offsetX.current += mario.speed;
      if (keys.current["ArrowLeft"]) offsetX.current -= mario.speed;
      if (offsetX.current < 0) offsetX.current = 0;

      // Title
      ctx.drawImage(naomi6Sprite, 200, -50, 400, 300);

      // Ground
      for (let i = 0; i < 100; i++) {
        const x = i * 50 - offset;
        ctx.drawImage(grassSprite, x, grassTopY, 50, 50);
        ctx.drawImage(brickSprite, x, grassTopY + 5, 50, 50);
      }

      // Top Bricks
      topBricksRef.current.forEach((brick) => {
        if (brick.hit) return;

        // Animasi naik-turun brick (bounce)
        if (brick.animating) {
          brick.animY -= 2;
          if (brick.animY <= -10) {
            brick.animating = false;
          }
        } else if (brick.animY < 0) {
          brick.animY += 2;
        }

        const screenX = brick.x - offset;
        ctx.drawImage(
          topBrickSprite,
          screenX,
          brick.y + brick.animY,
          brick.width,
          brick.height
        );

        // Collision dari bawah
        const marioGlobalX = mario.x + offset;
        const collidingFromBelow =
          marioGlobalX + mario.width > brick.x &&
          marioGlobalX < brick.x + brick.width &&
          mario.y + mario.height >= brick.y &&
          mario.y + mario.height <= brick.y + 10 &&
          velocityY < 0;

        if (collidingFromBelow && !brick.hit) {
          mario.y = brick.y - mario.height;
          velocityY = 0;

          brick.hit = true;
          brick.animating = true;

          coinsRef.current.push({
            x: brick.x + 10,
            y: brick.y - 30,
            width: 30,
            height: 30,
            collected: false,
          });

          coinSound.currentTime = 0;
          coinSound.play();
        }
      });

      // Coins
      coinsRef.current.forEach((coin) => {
        if (!coin.collected) {
          const screenX = coin.x - offset;
          ctx.drawImage(coinSprite, screenX, coin.y, coin.width, coin.height);

          const marioGlobalX = mario.x + offset;
          const isColliding =
            marioGlobalX < coin.x + coin.width &&
            marioGlobalX + mario.width > coin.x &&
            mario.y < coin.y + coin.height &&
            mario.y + mario.height > coin.y;

          if (isColliding) {
            coin.collected = true;
            scoreRef.current += 1;
            coinSound.currentTime = 0;
            coinSound.play();
          }
        }
      });

      // Mario animation
      let sprite = standSprite;
      if (keys.current["ArrowRight"] || keys.current["ArrowLeft"]) {
        sprite =
          Math.floor(frameCount.current / 10) % 2 === 0
            ? walkSprite1
            : walkSprite2;
      }

      ctx.drawImage(sprite, mario.x, mario.y + 33, mario.width, mario.height);

      ctx.fillStyle = "#fff";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 30);

      requestAnimationFrame(loop);
    };

    const handleKeyDown = (e) => {
      if (bgm.paused) {
        bgm.play().catch(() => {});
      }
      keys.current[e.key] = true;
      if ((e.key === " " || e.key === "ArrowUp") && !jumping) {
        velocityY = -10;
        jumping = true;
        jumpSound.currentTime = 0;
        jumpSound.play();
      }
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    standSprite.onload = () => {
      loop();
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      bgm.pause();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="400"
      style={{ border: "2px solid black", backgroundColor: "#4e9fe5" }}
    />
  );
};

export default GameCanvas;
