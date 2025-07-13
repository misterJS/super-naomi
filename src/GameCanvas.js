import React, { useRef, useEffect } from "react";
import standImg from "./assets/motion/stand.PNG";
import walk1Img from "./assets/motion/walk.PNG";
import walk2Img from "./assets/motion/walk2.PNG";
import wavingNaomi from "./assets/motion/naomi.png";
import brickImg from "./assets/brick.png";
import grassImg from "./assets/ground.png";
import topBrickImg from "./assets/top-brick.png";
import coinImg from "./assets/coin.png";
import coinSoundUrl from "./assets/coin.mp3";
import bgmUrl from "./assets/super-naomi-bgm.mp3";
import jumpUrl from "./assets/jump.mp3";
import imageNaomi6 from "./assets/super-naomi-6.png";
import cloudImg from "./assets/cloud.png";
import Stars from "./Stars";

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const keys = useRef({});
  const scoreRef = useRef(0);
  const frameCount = useRef(0);
  const offsetX = useRef(0);
  const gameStarted = useRef(false);
  const gameEnded = useRef(false);
  const naomiY = useRef(220);
  let naomiDirection = 1;

  // === Kondisi Siang atau Malam ===
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;

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
    { x: 520, y: 270, width: 30, height: 30, collected: false },
    { x: 610, y: 180, width: 30, height: 30, collected: false },
    { x: 700, y: 130, width: 30, height: 30, collected: false },
    { x: 790, y: 180, width: 30, height: 30, collected: false },
    { x: 880, y: 270, width: 30, height: 30, collected: false },
    { x: 970, y: 270, width: 30, height: 30, collected: false },
  ]);

  const topBricksRef = useRef([
    {
      x: 500,
      y: 300,
      width: 80,
      height: 30,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 590,
      y: 220,
      width: 80,
      height: 30,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 680,
      y: 170,
      width: 80,
      height: 30,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 770,
      y: 220,
      width: 80,
      height: 30,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 860,
      y: 300,
      width: 80,
      height: 30,
      hit: false,
      animY: 0,
      animating: false,
    },
    {
      x: 950,
      y: 300,
      width: 80,
      height: 30,
      hit: false,
      animY: 0,
      animating: false,
    },
  ]);

  const cloudsFront = useRef([
    { x: 800, y: 50, speed: 0.3 },
    { x: 1200, y: 60, speed: 0.3 },
  ]);

  const cloudsBack = useRef([
    { x: 1000, y: 30, speed: 0.15 },
    { x: 1600, y: 40, speed: 0.15 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const standSprite = new Image();
    const walkSprite1 = new Image();
    const walkSprite2 = new Image();
    const wavingSprite = new Image();
    const brickSprite = new Image();
    const grassSprite = new Image();
    const coinSprite = new Image();
    const naomi6Sprite = new Image();
    const topBrickSprite = new Image();
    const cloudSprite = new Image();

    standSprite.src = standImg;
    walkSprite1.src = walk1Img;
    walkSprite2.src = walk2Img;
    wavingSprite.src = wavingNaomi;
    brickSprite.src = brickImg;
    grassSprite.src = grassImg;
    coinSprite.src = coinImg;
    naomi6Sprite.src = imageNaomi6;
    topBrickSprite.src = topBrickImg;
    cloudSprite.src = cloudImg;

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

      // === Background berdasarkan waktu ===
      ctx.fillStyle = isNight ? "#0b1f3a" : "#4e9fe5";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Awan hanya muncul saat siang
      if (!isNight) {
        cloudsBack.current.forEach((cloud) => {
          cloud.x -= cloud.speed;
          if (cloud.x < -150) cloud.x = canvasWidth + Math.random() * 200;
          ctx.globalAlpha = 0.3;
          ctx.drawImage(cloudSprite, cloud.x, cloud.y, 120, 60);
        });

        cloudsFront.current.forEach((cloud) => {
          cloud.x -= cloud.speed;
          if (cloud.x < -150) cloud.x = canvasWidth + Math.random() * 200;
          ctx.globalAlpha = 0.6;
          ctx.drawImage(cloudSprite, cloud.x, cloud.y, 140, 70);
        });
        ctx.globalAlpha = 1;
      }

      if (!gameStarted.current) {
        ctx.drawImage(naomi6Sprite, 200, -50, 400, 300);
        ctx.drawImage(
          wavingSprite,
          350,
          300,
          100,
          100
        );
        ctx.fillStyle = "#fff";
        ctx.font = "18px Arial";
        ctx.fillText("Pencet apa aja buat mulai!", 290, 190);
        requestAnimationFrame(loop);
        return;
      }

      if (gameEnded.current) {
        naomiY.current += naomiDirection;
        if (naomiY.current <= 200 || naomiY.current >= 240)
          naomiDirection *= -1;

        ctx.drawImage(naomi6Sprite, 200, -50, 400, 300);
        ctx.drawImage(wavingSprite, 350, naomiY.current, 100, 100);
        ctx.fillStyle = "#fff";
        ctx.font = "24px Arial";
        ctx.fillText("Yeay! Semua koin terkumpul!", 250, 180);
        ctx.font = "18px Arial";
        ctx.fillText("Tekan R untuk restart", 300, 210);
        requestAnimationFrame(loop);
        return;
      }

      velocityY += gravity;
      mario.y += velocityY;

      if (keys.current["ArrowRight"]) offsetX.current += mario.speed;
      if (keys.current["ArrowLeft"]) offsetX.current -= mario.speed;
      if (offsetX.current < 0) offsetX.current = 0;

      for (let i = 0; i < 100; i++) {
        const x = i * 50 - offset;
        ctx.drawImage(grassSprite, x, grassTopY, 50, 50);
        ctx.drawImage(brickSprite, x, grassTopY + 5, 50, 50);
      }

      let standingOnBrick = false;
      topBricksRef.current.forEach((brick) => {
        const screenX = brick.x - offset;
        if (brick.animating) {
          brick.animY -= 2;
          if (brick.animY <= -10) brick.animating = false;
        } else if (brick.animY < 0) {
          brick.animY += 2;
        }

        const brickY = brick.y + brick.animY;
        ctx.drawImage(
          topBrickSprite,
          screenX,
          brickY,
          brick.width,
          brick.height
        );

        const marioGlobalX = mario.x + offset;
        const horizontalOverlap =
          marioGlobalX + mario.width > brick.x &&
          marioGlobalX < brick.x + brick.width;

        const verticalFromAbove =
          mario.y + mario.height > brickY &&
          mario.y < brickY &&
          mario.y + mario.height <= brickY + 20 &&
          velocityY >= 0;

        if (horizontalOverlap && verticalFromAbove) {
          mario.y = brickY - mario.height;
          velocityY = 0;
          jumping = false;
          standingOnBrick = true;
        }
      });

      if (!standingOnBrick && mario.y + mario.height < grassTopY) {
        jumping = true;
      }

      if (mario.y + mario.height >= grassTopY) {
        mario.y = grassTopY - mario.height;
        velocityY = 0;
        jumping = false;
      }

      for (let i = 0; i < coinsRef.current.length; i++) {
        const coin = coinsRef.current[i];
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

            if (scoreRef.current === coinsRef.current.length) {
              gameEnded.current = true;
            }
            break;
          }
        }
      }

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
      if (e.key.toLowerCase() === "r" && gameEnded.current) {
        scoreRef.current = 0;
        offsetX.current = 0;
        gameEnded.current = false;
        coinsRef.current.forEach((coin) => (coin.collected = false));
        return;
      }

      if (!gameStarted.current) {
        gameStarted.current = true;
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

    standSprite.onload = () => loop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      bgm.pause();
    };
  }, []);

  return (
    <>
    <canvas
      ref={canvasRef}
      width="800"
      height="400"
      style={{ border: "2px solid black", backgroundColor: "#4e9fe5" }}
    />
    {isNight && <Stars count={80} />}
    </>
  );
};

export default GameCanvas;
