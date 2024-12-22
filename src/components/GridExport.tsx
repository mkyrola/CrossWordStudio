import React from 'react';

interface GridExportProps {
  gridRef: React.RefObject<HTMLDivElement>;
  grid: { letter: string; isEditable: boolean }[][];
  gridDimensions: {
    rows: number;
    columns: number;
    cellWidth: number;
    cellHeight: number;
  };
  offset: {
    x: number;
    y: number;
  };
}

export const GridExport: React.FC<GridExportProps> = ({
  gridRef,
  grid,
  gridDimensions,
  offset,
}) => {
  const exportAsJSON = () => {
    const exportData = {
      imageUrl: '', // Will be set when capturing canvas
      gridDimensions,
      topLeftOffset: offset,
      cells: grid.map(row => 
        row.map(cell => ({
          isEditable: cell.isEditable
        }))
      ),
      cellsLength: grid.length,
      firstRowLength: grid[0]?.length || 0
    };

    // Create and trigger download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crossword-grid.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    if (!gridRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(gridRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('crossword-grid.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const exportAsImage = async (format: 'png' | 'jpeg') => {
    if (!gridRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(gridRef.current);
      const imgData = canvas.toDataURL(`image/${format}`);
      
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `crossword-grid.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  return (
    <div className="grid-export-controls">
      <button onClick={exportAsJSON}>Export JSON</button>
      <button onClick={exportAsPDF}>Export PDF</button>
      <button onClick={() => exportAsImage('png')}>Export PNG</button>
      <button onClick={() => exportAsImage('jpeg')}>Export JPEG</button>
    </div>
  );
};
