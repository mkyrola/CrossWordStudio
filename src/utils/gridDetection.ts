import { GridCalibrationData } from '../components/GridCalibration';
import { DETECTION_CONFIG } from '../config/constants';

interface DetectionResult {
  success: boolean;
  calibration?: GridCalibrationData;
  error?: string;
}

export async function detectGrid(imageUrl: string): Promise<DetectionResult> {
  try {
    // Create a new image and wait for it to load
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    // Create a canvas to process the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image to canvas
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and detect edges
    const edges = detectEdges(data, canvas.width, canvas.height);

    // Detect lines using Hough transform
    const { horizontalLines, verticalLines } = detectLines(edges, canvas.width, canvas.height);

    // Analyze line spacing to determine grid size
    const gridSize = analyzeLineSpacing(horizontalLines, verticalLines);

    // Calculate offsets
    const offsets = calculateOffsets(horizontalLines[0], verticalLines[0]);

    return {
      success: true,
      calibration: {
        gridWidth: gridSize.width,
        gridHeight: gridSize.height,
        cellWidth: DETECTION_CONFIG.DEFAULT_CELL_SIZE,
        cellHeight: DETECTION_CONFIG.DEFAULT_CELL_SIZE,
        offsetX: offsets.x,
        offsetY: offsets.y
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function detectEdges(imageData: Uint8ClampedArray, width: number, height: number): number[][] {
  const edges: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      // Apply Sobel operator
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const idx = ((y + i) * width + (x + j)) * 4;
          const gray = (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3;
          gx += gray * sobelX[i + 1][j + 1];
          gy += gray * sobelY[i + 1][j + 1];
        }
      }

      edges[y][x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return edges;
}

function detectLines(edges: number[][], width: number, height: number) {
  // Simplified Hough transform implementation
  const horizontalLines: number[] = [];
  const verticalLines: number[] = [];
  const threshold = DETECTION_CONFIG.EDGE_THRESHOLD;

  // Detect horizontal lines
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      sum += edges[y][x];
    }
    if (sum > threshold) {
      horizontalLines.push(y);
    }
  }

  // Detect vertical lines
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y < height; y++) {
      sum += edges[y][x];
    }
    if (sum > threshold) {
      verticalLines.push(x);
    }
  }

  return { horizontalLines, verticalLines };
}

function analyzeLineSpacing(horizontalLines: number[], verticalLines: number[]) {
  // Calculate average spacing
  let avgHorizontalSpacing = 0;
  let avgVerticalSpacing = 0;

  if (horizontalLines.length > 1) {
    for (let i = 1; i < horizontalLines.length; i++) {
      avgHorizontalSpacing += horizontalLines[i] - horizontalLines[i - 1];
    }
    avgHorizontalSpacing /= (horizontalLines.length - 1);
  }

  if (verticalLines.length > 1) {
    for (let i = 1; i < verticalLines.length; i++) {
      avgVerticalSpacing += verticalLines[i] - verticalLines[i - 1];
    }
    avgVerticalSpacing /= (verticalLines.length - 1);
  }

  return {
    width: Math.round(verticalLines.length - 1),
    height: Math.round(horizontalLines.length - 1)
  };
}

function calculateOffsets(firstHorizontalLine: number, firstVerticalLine: number) {
  return {
    x: firstVerticalLine || 0,
    y: firstHorizontalLine || 0
  };
}
