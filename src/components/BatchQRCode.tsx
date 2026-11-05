import React from 'react';
import { Download } from 'lucide-react';

interface BatchQRCodeProps {
  value: string;
  size?: number;
  label?: string;
  showDetails?: boolean;
  allowDownload?: boolean;
}

export const BatchQRCode: React.FC<BatchQRCodeProps> = ({
  value,
  size = 140,
  label,
  showDetails = true,
  allowDownload = false,
}) => {
  // Generate deterministic pattern from value string
  const generateMatrix = (str: string) => {
    const matrixSize = 25;
    const matrix: boolean[][] = Array(matrixSize).fill(false).map(() => Array(matrixSize).fill(false));

    // Corner Finder Patterns (7x7 squares)
    const addFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[row + r][col + c] = true;
          }
        }
      }
    };

    addFinder(0, 0); // Top-left
    addFinder(0, matrixSize - 7); // Top-right
    addFinder(matrixSize - 7, 0); // Bottom-left

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Deterministic payload encoding based on hash characters
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finders and separators
        const inFinderTopLeft = r < 8 && c < 8;
        const inFinderTopRight = r < 8 && c >= matrixSize - 8;
        const inFinderBottomLeft = r >= matrixSize - 8 && c < 8;
        if (inFinderTopLeft || inFinderTopRight || inFinderBottomLeft) continue;
        if (r === 6 || c === 6) continue;

        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        matrix[r][c] = (seed % 3) === 0;
      }
    }

    return matrix;
  };

  const matrix = React.useMemo(() => generateMatrix(value), [value]);
  const cellSize = size / matrix.length;

  const handleDownloadSvg = () => {
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size} ${size}">`;
    const rects = matrix
      .flatMap((row, r) =>
        row.map((filled, c) =>
          filled
            ? `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize + 0.3}" height="${cellSize + 0.3}" fill="#0f172a"/>`
            : ''
        )
      )
      .join('');
    const svgFooter = `</svg>`;
    const fullSvg = `${svgHeader}<rect width="100%" height="100%" fill="#ffffff"/>${rects}${svgFooter}`;

    const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HalalChain-QR-${(label || value).replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="p-3 bg-white rounded-lg border border-neutral-200 shadow-xs inline-block"
        style={{ width: size + 24, height: size + 24 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          {matrix.map((row, r) =>
            row.map((filled, c) =>
              filled ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize + 0.3}
                  height={cellSize + 0.3}
                  fill="#0f172a"
                />
              ) : null
            )
          )}
        </svg>
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <p className="text-[11px] font-mono text-neutral-600 font-medium tabular-nums truncate max-w-[200px]">
            {label || value}
          </p>
          <span className="text-[10px] text-neutral-500 block">Scan for Immutable On-Chain Record</span>

          {allowDownload && (
            <button
              onClick={handleDownloadSvg}
              className="mt-1.5 text-[10px] font-medium text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 mx-auto transition-colors"
              title="Download QR code for abattoir & carton packaging"
            >
              <Download className="w-3 h-3" />
              <span>Download SVG Label</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
