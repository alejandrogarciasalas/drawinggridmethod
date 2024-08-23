"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(4);
  const [gridColor, setGridColor] = useState("#FF0000");
  const [gridLineWidth, setGridLineWidth] = useState(1);
  const [showDiagonal, setShowDiagonal] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const drawImageAndGrid = (
    canvas: HTMLCanvasElement,
    imageUrl: string | null
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      drawGrid(ctx, canvas.width, canvas.height);
    };
    img.onerror = () => {
      console.error("The provided image couldn't be loaded");
    };

    if (imageUrl) {
      img.src = imageUrl;
    } else {
      // Draw placeholder
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#333";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "Upload an image to start",
        canvas.width / 2,
        canvas.height / 2
      );
      drawGrid(ctx, canvas.width, canvas.height);
    }
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridLineWidth;

    // Draw vertical lines
    for (let i = 1; i < gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 1; i < gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(width, i * cellHeight);
      ctx.stroke();
    }

    // Draw diagonal lines if showDiagonal is true
    if (showDiagonal) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          ctx.beginPath();
          ctx.moveTo(j * cellWidth, i * cellHeight);
          ctx.lineTo((j + 1) * cellWidth, (i + 1) * cellHeight);
          ctx.stroke();
        }
      }
    }

    // Draw numbers if showNumbers is true
    if (showNumbers) {
      ctx.fillStyle = gridColor;
      ctx.font = `${Math.min(cellWidth, cellHeight) / 3}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const number = i * gridSize + j + 1;
          ctx.fillText(
            number.toString(),
            (j + 0.5) * cellWidth,
            (i + 0.5) * cellHeight
          );
        }
      }
    }
  };

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      drawImageAndGrid(canvas, image);
    }
  }, [image, gridSize, gridColor, gridLineWidth, showDiagonal, showNumbers]);

  return (
    <main className={styles.main}>
      <h1>Image Grid Overlay</h1>

      <div className={styles.imageContainer}>
        <canvas className={styles.canvas} />
      </div>

      <div className={styles.uploadContainer}>
        <label htmlFor="imageUpload" className={styles.uploadLabel}>
          Upload Image
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
        </label>
      </div>

      <div className={styles.options}>
        <div className={styles.optionGroup}>
          <label className={styles.optionLabel}>
            Columns:
            <input
              type="number"
              min="1"
              max="10"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className={styles.numberInput}
            />
          </label>
          <label className={styles.optionLabel}>
            Rows:
            <input
              type="number"
              min="1"
              max="10"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className={styles.numberInput}
            />
          </label>
        </div>
        <div className={styles.optionGroup}>
          <label className={styles.optionLabel}>
            Line Color:
            <input
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
              className={styles.colorInput}
            />
          </label>
          <label className={styles.optionLabel}>
            Line Width:
            <input
              type="number"
              min="1"
              max="10"
              value={gridLineWidth}
              onChange={(e) => setGridLineWidth(Number(e.target.value))}
              className={styles.numberInput}
            />
          </label>
        </div>
        <div className={styles.optionGroup}>
          <label className={styles.optionLabel}>
            Diagonal Grid:
            <input
              type="checkbox"
              checked={showDiagonal}
              onChange={(e) => setShowDiagonal(e.target.checked)}
              className={styles.checkbox}
            />
          </label>
          <label className={styles.optionLabel}>
            Add Numbers:
            <input
              type="checkbox"
              checked={showNumbers}
              onChange={(e) => setShowNumbers(e.target.checked)}
              className={styles.checkbox}
            />
          </label>
        </div>
      </div>
    </main>
  );
}
