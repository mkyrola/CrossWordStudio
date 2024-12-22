import { GridCell } from '../types/grid';

export interface SolutionMatrix {
  width: number;
  height: number;
  cells: {
    x: number;
    y: number;
    letter: string;
    isBlocked: boolean;
  }[];
}

export const gridToSolutionMatrix = (grid: GridCell[][]): SolutionMatrix => {
  const height = grid.length;
  const width = grid[0]?.length || 0;
  const cells = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      cells.push({
        x,
        y,
        letter: cell.letter || '',
        isBlocked: cell.letter === ' ' || cell.isBlocked === true
      });
    }
  }

  return {
    width,
    height,
    cells
  };
};

export const exportToJson = (grid: GridCell[][]): void => {
  const solutionMatrix = gridToSolutionMatrix(grid);
  const jsonString = JSON.stringify(solutionMatrix, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'crossword_solution.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printPuzzle = async (imageUrl: string, grid: GridCell[][]): Promise<void> => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print the puzzle');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Crossword Puzzle</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: white;
          }
          
          .page {
            width: 170mm;  /* A4 width minus margins */
            height: 257mm; /* A4 height minus margins */
            position: relative;
            box-sizing: border-box;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            page-break-after: always;
          }
          
          .puzzle-container {
            width: 95%;
            height: 95%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .puzzle-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            display: block;
          }
          
          .solution-container {
            width: 95%;
            height: 95%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .solution-grid {
            border-collapse: collapse;
            width: 100%;
            height: 100%;
          }
          
          .solution-grid td {
            border: 1px solid black;
            text-align: center;
            font-size: 16px;
            position: relative;
            padding: 0;
          }
          
          .solution-grid td::before {
            content: '';
            display: block;
            padding-top: 100%;
          }
          
          .solution-grid td span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: Arial, sans-serif;
          }
          
          .blocked {
            background-color: black;
          }
          
          @media print {
            body { 
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .solution-grid td {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <!-- Empty puzzle page -->
        <div class="page">
          <div class="puzzle-container">
            <img src="${imageUrl}" class="puzzle-image" alt="Crossword Puzzle">
          </div>
        </div>
        
        <!-- Solution matrix page -->
        <div class="page">
          <div class="solution-container">
            <table class="solution-grid">
              ${grid.map(row => `
                <tr style="height: ${100 / grid.length}%">
                  ${row.map(cell => `
                    <td class="${cell.letter === ' ' || cell.isBlocked ? 'blocked' : ''}" style="width: ${100 / grid[0].length}%">
                      <span>${cell.letter === ' ' || cell.isBlocked ? '' : cell.letter || ''}</span>
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
      </body>
    </html>
  `);

  // Wait for image to load before printing
  const img = printWindow.document.querySelector('img');
  if (img) {
    img.onload = () => {
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
  }
};
