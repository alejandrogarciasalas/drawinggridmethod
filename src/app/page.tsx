"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(4);
  const [gridColor, setGridColor] = useState("#FF0000");
  const [gridLineWidth, setGridLineWidth] = useState(1);
  const [showDiagonal, setShowDiagonal] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const containerWidth = canvas.parentElement?.clientWidth || 0;
      const containerHeight = canvas.parentElement?.clientHeight || 0;
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height
      );

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawGrid(ctx, canvas.width, canvas.height);
    };
    img.onerror = () => {
      console.error("The provided image couldn't be loaded");
    };

    if (imageUrl) {
      img.src = imageUrl;
    } else {
      // Draw placeholder
      const containerWidth = canvas.parentElement?.clientWidth || 300;
      const containerHeight = canvas.parentElement?.clientHeight || 300;
      canvas.width = containerWidth;
      canvas.height = containerHeight;
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
    const cellSize = Math.min(width, height) / gridSize;
    const offsetX = (width - cellSize * gridSize) / 2;
    const offsetY = (height - cellSize * gridSize) / 2;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = gridLineWidth;

    // Draw vertical lines
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + i * cellSize, offsetY);
      ctx.lineTo(offsetX + i * cellSize, offsetY + gridSize * cellSize);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * cellSize);
      ctx.lineTo(offsetX + gridSize * cellSize, offsetY + i * cellSize);
      ctx.stroke();
    }

    // Draw diagonal lines if showDiagonal is true
    if (showDiagonal) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          ctx.beginPath();
          ctx.moveTo(offsetX + j * cellSize, offsetY + i * cellSize);
          ctx.lineTo(
            offsetX + (j + 1) * cellSize,
            offsetY + (i + 1) * cellSize
          );
          ctx.stroke();
        }
      }
    }

    // Draw numbers if showNumbers is true
    if (showNumbers) {
      ctx.fillStyle = gridColor;
      ctx.font = `${cellSize / 3}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const number = i * gridSize + j + 1;
          ctx.fillText(
            number.toString(),
            offsetX + (j + 0.5) * cellSize,
            offsetY + (i + 0.5) * cellSize
          );
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawImageAndGrid(canvas, image);
    }
  }, [image, gridSize, gridColor, gridLineWidth, showDiagonal, showNumbers]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "grid-overlay-image.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const windowContent = "<!DOCTYPE html>";
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(windowContent);
        printWindow.document.write('<img src="' + dataUrl + '">');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <main className={styles.main}>
      <h1>Image Grid Overlay</h1>

      <div className={styles.imageContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
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
            Grid Size:
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
        <div className={styles.optionGroup}>
          <button onClick={handleDownload} className={styles.button}>
            Download Image
          </button>
          <button onClick={handlePrint} className={styles.button}>
            Print Image
          </button>
        </div>
      </div>
    </main>
  );
}
