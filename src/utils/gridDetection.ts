import { GridCalibrationData } from '../components/GridCalibration';

interface DetectionResult {
  success: boolean;
  calibration?: GridCalibrationData;
  error?: string;
}

interface DetectedBox {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface GridInfo {
  boxes: DetectedBox[];
  cellWidth: number;
  cellHeight: number;
  gridBounds: { left: number; top: number; right: number; bottom: number };
}

export async function detectGrid(imageUrl: string, imageDimensions?: { width: number; height: number }): Promise<DetectionResult> {
  try {
    if (!imageDimensions) {
      return {
        success: true,
        calibration: {
          gridWidth: 15,
          gridHeight: 15,
          cellWidth: 40,
          cellHeight: 40,
          offsetX: 0,
          offsetY: 0
        }
      };
    }

    // Load and process the image
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    // Create canvas for processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Downscale for performance
    const MAX_PROCESS_SIZE = 800;
    const scale = Math.min(1, MAX_PROCESS_SIZE / Math.max(image.width, image.height));
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Convert to grayscale and apply threshold
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const binaryData = await preprocessImage(imageData);
    
    // Detect individual boxes using morphological operations
    const boxes = await detectBoxes(binaryData, canvas.width, canvas.height);
    
    if (boxes.length === 0) {
      throw new Error('No puzzle boxes detected');
    }
    
    // Group boxes by size to find the main grid pattern
    const gridInfo = await analyzeGridPattern(boxes);
    
    // Scale results back to displayed image dimensions
    // gridInfo.cellWidth/cellHeight are in canvas coordinates, need to scale to display
    const canvasToDisplayScaleX = imageDimensions.width / canvas.width;
    const canvasToDisplayScaleY = imageDimensions.height / canvas.height;

    // Calculate grid dimensions from detected boxes
    const gridWidth = calculateGridDimension(gridInfo.boxes, 'x', gridInfo.cellWidth);
    const gridHeight = calculateGridDimension(gridInfo.boxes, 'y', gridInfo.cellHeight);

    return {
      success: true,
      calibration: {
        gridWidth: Math.max(5, Math.min(25, gridWidth)),
        gridHeight: Math.max(5, Math.min(25, gridHeight)),
        cellWidth: Math.round(gridInfo.cellWidth * canvasToDisplayScaleX),
        cellHeight: Math.round(gridInfo.cellHeight * canvasToDisplayScaleY),
        offsetX: Math.round(gridInfo.gridBounds.left * canvasToDisplayScaleX),
        offsetY: Math.round(gridInfo.gridBounds.top * canvasToDisplayScaleY)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function preprocessImage(imageData: ImageData): Promise<Uint8ClampedArray> {
  const { width, height, data } = imageData;
  const binary = new Uint8ClampedArray(width * height);
  
  // Calculate histogram for Otsu's threshold
  const histogram = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    histogram[gray]++;
  }
  
  // Otsu's method for automatic threshold
  const threshold = calculateOtsuThreshold(histogram, width * height);
  
  // Convert to binary using adaptive threshold
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    // Invert: dark lines become 255, white areas become 0
    binary[i / 4] = gray < threshold ? 255 : 0;
  }
  
  // Yield control periodically
  await new Promise(resolve => setTimeout(resolve, 0));
  
  return binary;
}

function calculateOtsuThreshold(histogram: number[], totalPixels: number): number {
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }
  
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 0;
  
  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    
    wF = totalPixels - wB;
    if (wF === 0) break;
    
    sumB += t * histogram[t];
    
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    
    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = t;
    }
  }
  
  return threshold;
}

async function detectBoxes(binary: Uint8ClampedArray, width: number, height: number): Promise<DetectedBox[]> {
  const boxes: DetectedBox[] = [];
  const visited = new Uint8Array(width * height);
  
  // Find connected components (white areas inside dark borders)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (binary[idx] === 0 && !visited[idx]) {
        const box = floodFill(binary, visited, width, height, x, y);
        if (box && isValidBox(box)) {
          boxes.push(box);
        }
      }
    }
  }
  
  // Yield control
  await new Promise(resolve => setTimeout(resolve, 0));
  
  return boxes;
}

function floodFill(binary: Uint8ClampedArray, visited: Uint8Array, width: number, height: number, startX: number, startY: number): DetectedBox | null {
  const stack: [number, number][] = [[startX, startY]];
  let minX = startX, maxX = startX;
  let minY = startY, maxY = startY;
  let pixelCount = 0;
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * width + x;
    
    if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || binary[idx] !== 0) {
      continue;
    }
    
    visited[idx] = 1;
    pixelCount++;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    
    // Add neighbors
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  
  const boxWidth = maxX - minX + 1;
  const boxHeight = maxY - minY + 1;
  
  return {
    x: minX,
    y: minY,
    width: boxWidth,
    height: boxHeight,
    centerX: minX + boxWidth / 2,
    centerY: minY + boxHeight / 2
  };
}

function isValidBox(box: DetectedBox): boolean {
  // Check if box is roughly square (aspect ratio between 0.5 and 2)
  const aspectRatio = box.width / box.height;
  if (aspectRatio < 0.5 || aspectRatio > 2) {
    return false;
  }
  
  // Minimum size requirement
  const MIN_SIZE = 15;
  if (box.width < MIN_SIZE || box.height < MIN_SIZE) {
    return false;
  }
  
  // Maximum size requirement
  const MAX_SIZE = 150;
  if (box.width > MAX_SIZE || box.height > MAX_SIZE) {
    return false;
  }
  
  return true;
}

async function analyzeGridPattern(boxes: DetectedBox[]): Promise<GridInfo> {
  // Group boxes by similar sizes
  const sizeGroups = groupBoxesBySize(boxes);
  
  // Find the largest group (most common cell size)
  let largestGroup: DetectedBox[] = [];
  let medianSize = { width: 0, height: 0 };
  
  for (const group of sizeGroups) {
    if (group.length > largestGroup.length) {
      largestGroup = group;
      medianSize = calculateMedianSize(group);
    }
  }
  
  // Filter out boxes that are too different from the median size
  const filteredBoxes = largestGroup.filter(box => 
    Math.abs(box.width - medianSize.width) < medianSize.width * 0.2 &&
    Math.abs(box.height - medianSize.height) < medianSize.height * 0.2
  );
  
  // Find the actual grid spacing (center-to-center distance)
  const gridSpacing = {
    width: findMostCommonSpacing(filteredBoxes, 'x'),
    height: findMostCommonSpacing(filteredBoxes, 'y')
  };
  
  // Use detected spacing if available, otherwise fall back to box dimensions
  const actualCellWidth = gridSpacing.width > 0 ? gridSpacing.width : medianSize.width;
  const actualCellHeight = gridSpacing.height > 0 ? gridSpacing.height : medianSize.height;
  
  // Calculate grid bounds based on detected cells
  const gridBounds = calculateGridBoundsFromCells(filteredBoxes, actualCellWidth, actualCellHeight);
  
  await new Promise(resolve => setTimeout(resolve, 0));
  
  return {
    boxes: filteredBoxes,
    cellWidth: actualCellWidth,
    cellHeight: actualCellHeight,
    gridBounds
  };
}

function calculateGridBoundsFromCells(boxes: DetectedBox[], cellWidth: number, cellHeight: number): { left: number; top: number; right: number; bottom: number } {
  if (boxes.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0 };
  }
  
  // Find the grid origin by extrapolating from detected boxes
  const gridOrigin = findGridOrigin(boxes, cellWidth, cellHeight);
  
  // Calculate the extents of the grid
  let maxCol = -1;
  let maxRow = -1;
  
  for (const box of boxes) {
    const col = Math.round((box.centerX - gridOrigin.x) / cellWidth);
    const row = Math.round((box.centerY - gridOrigin.y) / cellHeight);
    maxCol = Math.max(maxCol, col);
    maxRow = Math.max(maxRow, row);
  }
  
  // Calculate bounds based on the inferred grid
  const left = gridOrigin.x;
  const top = gridOrigin.y;
  const right = gridOrigin.x + (maxCol + 1) * cellWidth;
  const bottom = gridOrigin.y + (maxRow + 1) * cellHeight;
  
  return { left, top, right, bottom };
}

function findMostCommonSpacing(boxes: DetectedBox[], axis: 'x' | 'y'): number {
  const spacings: number[] = [];
  
  // Sort boxes by position
  const sorted = [...boxes].sort((a, b) => axis === 'x' ? a.centerX - b.centerX : a.centerY - b.centerY);
  
  // Calculate spacing between adjacent boxes
  for (let i = 0; i < sorted.length - 1; i++) {
    const spacing = axis === 'x' 
      ? sorted[i + 1].centerX - sorted[i].centerX
      : sorted[i + 1].centerY - sorted[i].centerY;
    
    // Only consider reasonable spacings (between 10 and 200 pixels)
    if (spacing > 10 && spacing < 200) {
      spacings.push(spacing);
    }
  }
  
  if (spacings.length === 0) return 0;
  
  // Find the minimum spacing as the fundamental cell size
  const minSpacing = Math.min(...spacings);
  
  // Group spacings by multiples of the minimum spacing
  const histogram: { [key: number]: number } = {};
  
  for (const spacing of spacings) {
    // Find which multiple of minSpacing this is closest to
    const multiple = Math.round(spacing / minSpacing);
    const expectedSpacing = minSpacing * multiple;
    
    // Only consider if it's close to expected (within 20%)
    if (Math.abs(spacing - expectedSpacing) < minSpacing * 0.2) {
      histogram[minSpacing] = (histogram[minSpacing] || 0) + 1;
    }
  }
  
  // Return the fundamental cell size
  return minSpacing;
}

function findGridOrigin(boxes: DetectedBox[], cellWidth: number, cellHeight: number): { x: number; y: number } {
  // Find the top-left-most box as reference
  let topLeftBox = boxes[0];
  let minDistance = Infinity;
  
  for (const box of boxes) {
    const distance = box.centerX + box.centerY;
    if (distance < minDistance) {
      minDistance = distance;
      topLeftBox = box;
    }
  }
  
  // Calculate the grid offset/phase
  // The origin should align such that all detected boxes are at integer grid positions
  const offsetX = topLeftBox.centerX % cellWidth;
  const offsetY = topLeftBox.centerY % cellHeight;
  
  // Calculate the actual origin
  const originX = topLeftBox.centerX - offsetX;
  const originY = topLeftBox.centerY - offsetY;
  
  // Snap to nearest cell boundary
  return {
    x: Math.round(originX / cellWidth) * cellWidth,
    y: Math.round(originY / cellHeight) * cellHeight
  };
}

function groupBoxesBySize(boxes: DetectedBox[]): DetectedBox[][] {
  const groups: DetectedBox[][] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < boxes.length; i++) {
    if (used.has(i)) continue;
    
    const group = [boxes[i]];
    used.add(i);
    
    for (let j = i + 1; j < boxes.length; j++) {
      if (used.has(j)) continue;
      
      // Check if boxes have similar sizes
      const sizeDiff = Math.abs(boxes[i].width - boxes[j].width) + Math.abs(boxes[i].height - boxes[j].height);
      const avgSize = (boxes[i].width + boxes[i].height + boxes[j].width + boxes[j].height) / 4;
      
      if (sizeDiff < avgSize * 0.3) { // Within 30% size difference
        group.push(boxes[j]);
        used.add(j);
      }
    }
    
    groups.push(group);
  }
  
  return groups;
}

function calculateMedianSize(boxes: DetectedBox[]): { width: number; height: number } {
  const widths = boxes.map(b => b.width).sort((a, b) => a - b);
  const heights = boxes.map(b => b.height).sort((a, b) => a - b);
  
  return {
    width: widths[Math.floor(widths.length / 2)],
    height: heights[Math.floor(heights.length / 2)]
  };
}

function calculateGridDimension(boxes: DetectedBox[], axis: 'x' | 'y', cellSize: number): number {
  // Get unique positions along the axis
  const positions = boxes.map(b => axis === 'x' ? b.x : b.y).sort((a, b) => a - b);
  const uniquePositions: number[] = [];
  
  for (const pos of positions) {
    if (uniquePositions.length === 0 || pos - uniquePositions[uniquePositions.length - 1] > cellSize * 0.5) {
      uniquePositions.push(pos);
    }
  }
  
  // Estimate grid dimension based on spacing
  let maxGap = 0;
  for (let i = 1; i < uniquePositions.length; i++) {
    maxGap = Math.max(maxGap, uniquePositions[i] - uniquePositions[i - 1]);
  }
  
  // If we have regular spacing, count the cells
  if (maxGap > cellSize * 0.8 && maxGap < cellSize * 1.2) {
    return uniquePositions.length;
  }
  
  // Otherwise estimate based on range
  const range = Math.max(...positions) - Math.min(...positions);
  return Math.round(range / cellSize) + 1;
}
