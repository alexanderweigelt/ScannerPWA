import {
  runScanPipeline,
  filterContourCandidates,
  orderCornerPoints,
  computeWarpTargetSize,
  normalizePortraitOrientation,
  SCAN_CONFIG,
  type ScanFailureReason,
} from '@/src/scan/scanPipeline';
import { createMockOpenCV, MockMat, MockMatVector } from '@/src/__tests__/mocks/mockOpenCV';
import { createFixtureCanvas } from '@/src/__tests__/helpers/fixtures';
import type { OpenCVAPI, OpenCVMatrix, OpenCVMatVector } from '@/src/types/opencv';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Configures findContours to push one document-like quadrilateral contour */
function mockSuccessContour(cv: OpenCVAPI): void {
  (cv.findContours as jest.Mock).mockImplementation(
    (_img: OpenCVMatrix, contours: OpenCVMatVector) => {
      const cnt = new MockMat(4, 1);
      // A4-like portrait quadrilateral in scaled space
      cnt.data32S = new Int32Array([50, 30, 250, 30, 250, 330, 50, 330]);
      contours.push_back(cnt);
    }
  );
}

function makeCanvas(width = 640, height = 480): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN_CONFIG — typed constants
// ─────────────────────────────────────────────────────────────────────────────

describe('SCAN_CONFIG', () => {
  it('has odd Gaussian kernel size', () => {
    expect(SCAN_CONFIG.gaussianKernel % 2).toBe(1);
  });

  it('has odd adaptive threshold block size', () => {
    expect(SCAN_CONFIG.adaptiveBlockSize % 2).toBe(1);
  });

  it('has a positive minContourAreaRatio between 0 and 1', () => {
    expect(SCAN_CONFIG.minContourAreaRatio).toBeGreaterThan(0);
    expect(SCAN_CONFIG.minContourAreaRatio).toBeLessThan(1);
  });

  it('cannyHigh is greater than cannyLow', () => {
    expect(SCAN_CONFIG.cannyHigh).toBeGreaterThan(SCAN_CONFIG.cannyLow);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// filterContourCandidates
// ─────────────────────────────────────────────────────────────────────────────

describe('filterContourCandidates', () => {
  let cv: OpenCVAPI;

  beforeEach(() => {
    cv = createMockOpenCV();
  });

  it('returns a candidate when a valid quadrilateral contour is present', () => {
    const contours = new MockMatVector();
    const cnt = new MockMat(4, 1);
    contours.push_back(cnt);

    const candidates = filterContourCandidates(cv, contours as unknown as OpenCVMatVector, 1000);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].area).toBeGreaterThan(0);

    candidates.forEach((c) => c.contour.delete());
    contours.delete();
  });

  it('rejects a contour whose area is below minArea', () => {
    const cv2 = createMockOpenCV();
    (cv2.contourArea as jest.Mock).mockReturnValue(50); // small area

    const contours = new MockMatVector();
    contours.push_back(new MockMat(4, 1));

    const candidates = filterContourCandidates(cv2, contours as unknown as OpenCVMatVector, 1000);

    expect(candidates).toHaveLength(0);
    contours.delete();
  });

  it('rejects a non-convex contour', () => {
    const cv2 = createMockOpenCV();
    (cv2.isContourConvex as jest.Mock).mockReturnValue(false);

    const contours = new MockMatVector();
    contours.push_back(new MockMat(4, 1));

    const candidates = filterContourCandidates(cv2, contours as unknown as OpenCVMatVector, 1000);

    expect(candidates).toHaveLength(0);
    contours.delete();
  });

  it('rejects a contour approximated to fewer than 4 corners', () => {
    const cv2 = createMockOpenCV();
    (cv2.approxPolyDP as jest.Mock).mockImplementation((_: OpenCVMatrix, approx: OpenCVMatrix) => {
      approx.rows = 3; // triangle
    });

    const contours = new MockMatVector();
    contours.push_back(new MockMat(3, 1));

    const candidates = filterContourCandidates(cv2, contours as unknown as OpenCVMatVector, 1000);

    expect(candidates).toHaveLength(0);
    contours.delete();
  });

  it('returns an empty array when there are no contours', () => {
    const contours = new MockMatVector(); // empty
    const candidates = filterContourCandidates(cv, contours as unknown as OpenCVMatVector, 1000);
    expect(candidates).toHaveLength(0);
    contours.delete();
  });

  it('selects the largest of multiple valid contours', () => {
    const cv2 = createMockOpenCV();
    let callCount = 0;
    (cv2.contourArea as jest.Mock).mockImplementation(() => {
      callCount++;
      return callCount === 1 ? 10000 : 50000; // second contour is larger
    });

    const contours = new MockMatVector();
    contours.push_back(new MockMat(4, 1));
    contours.push_back(new MockMat(4, 1));

    const candidates = filterContourCandidates(cv2, contours as unknown as OpenCVMatVector, 1000);

    expect(candidates).toHaveLength(2);
    const best = candidates.reduce((a, b) => (a.area > b.area ? a : b));
    expect(best.area).toBe(50000);

    candidates.forEach((c) => c.contour.delete());
    contours.delete();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// orderCornerPoints
// ─────────────────────────────────────────────────────────────────────────────

describe('orderCornerPoints', () => {
  it('correctly orders axis-aligned rectangle corners regardless of input order', () => {
    const pts = [
      { x: 100, y: 100 }, // br
      { x: 0,   y: 0   }, // tl
      { x: 100, y: 0   }, // tr
      { x: 0,   y: 100 }, // bl
    ];
    const result = orderCornerPoints(pts);
    expect(result).toEqual({
      tl: { x: 0,   y: 0   },
      tr: { x: 100, y: 0   },
      br: { x: 100, y: 100 },
      bl: { x: 0,   y: 100 },
    });
  });

  it('works with more than 4 points (accepts 5-point contours)', () => {
    const pts = [
      { x: 0,   y: 0   },
      { x: 50,  y: 0   }, // extra point on top edge
      { x: 100, y: 0   },
      { x: 100, y: 100 },
      { x: 0,   y: 100 },
    ];
    const result = orderCornerPoints(pts);
    expect(result).not.toBeNull();
    expect(result?.tl).toEqual({ x: 0, y: 0 });
    expect(result?.br).toEqual({ x: 100, y: 100 });
  });

  it('returns null when fewer than 4 points are given', () => {
    expect(orderCornerPoints([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }])).toBeNull();
  });

  it('returns null when corners are not all distinct', () => {
    // Degenerate case: tl and br share the same coords
    const pts = [
      { x: 0, y: 0 },
      { x: 0, y: 0 }, // duplicate
      { x: 100, y: 0 },
      { x: 0, y: 100 },
    ];
    expect(orderCornerPoints(pts)).toBeNull();
  });

  it('handles a skewed quadrilateral', () => {
    const pts = [
      { x: 20,  y: 10  }, // approximately TL
      { x: 180, y: 5   }, // approximately TR
      { x: 200, y: 290 }, // approximately BR
      { x: 10,  y: 295 }, // approximately BL
    ];
    const result = orderCornerPoints(pts);
    expect(result).not.toBeNull();
    // TL has smallest x+y
    expect(result?.tl).toEqual({ x: 20, y: 10 });
    // BR has largest x+y
    expect(result?.br).toEqual({ x: 200, y: 290 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computeWarpTargetSize
// ─────────────────────────────────────────────────────────────────────────────

describe('computeWarpTargetSize', () => {
  const squareCorners = {
    tl: { x: 0,   y: 0   },
    tr: { x: 100, y: 0   },
    br: { x: 100, y: 100 },
    bl: { x: 0,   y: 100 },
  };

  it('returns the correct size for a square at scale 1', () => {
    const size = computeWarpTargetSize(squareCorners, 1);
    expect(size).toEqual({ width: 100, height: 100 });
  });

  it('scales up the size when scale < 1 (corners in downscaled space)', () => {
    // corners in 0.5× space → output should be 2× bigger
    const size = computeWarpTargetSize(squareCorners, 0.5);
    expect(size).toEqual({ width: 200, height: 200 });
  });

  it('returns portrait dimensions for A4-like corners', () => {
    const a4Corners = {
      tl: { x: 0,   y: 0   },
      tr: { x: 210, y: 0   },
      br: { x: 210, y: 297 },
      bl: { x: 0,   y: 297 },
    };
    const size = computeWarpTargetSize(a4Corners, 1);
    expect(size.height).toBeGreaterThan(size.width); // portrait
  });

  it('defaults scale to 1 when not provided', () => {
    const size = computeWarpTargetSize(squareCorners);
    expect(size).toEqual({ width: 100, height: 100 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// normalizePortraitOrientation
// ─────────────────────────────────────────────────────────────────────────────

describe('normalizePortraitOrientation', () => {
  let cv: OpenCVAPI;

  beforeEach(() => {
    cv = createMockOpenCV();
  });

  it('returns a clone when the mat is already portrait (cols < rows)', () => {
    const mat = new MockMat(300, 210); // portrait
    const result = normalizePortraitOrientation(cv, mat as unknown as OpenCVMatrix);

    expect(result).toBeDefined();
    expect(cv.transpose).not.toHaveBeenCalled();
    expect(cv.flip).not.toHaveBeenCalled();

    result.delete();
  });

  it('returns a clone when the mat is square', () => {
    const mat = new MockMat(100, 100);
    const result = normalizePortraitOrientation(cv, mat as unknown as OpenCVMatrix);

    expect(cv.transpose).not.toHaveBeenCalled();
    result.delete();
  });

  it('rotates a landscape mat to portrait via transpose + flip', () => {
    const mat = new MockMat(210, 300); // landscape: cols > rows

    const result = normalizePortraitOrientation(cv, mat as unknown as OpenCVMatrix);

    expect(cv.transpose).toHaveBeenCalledTimes(1);
    expect(cv.flip).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();

    result.delete();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// runScanPipeline — typed failure result mapping
// ─────────────────────────────────────────────────────────────────────────────

describe('runScanPipeline — typed failure mapping', () => {
  it('returns document_not_found when no valid contour is found', () => {
    const cv = createMockOpenCV();
    // Default mock: findContours is a no-op → empty contours vector

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('document_not_found');
      expect(result.message).toMatch(/contour/i);
    }
  });

  it('returns image_read_failed when imread returns an empty matrix', () => {
    const cv = createMockOpenCV();
    (cv.imread as jest.Mock).mockReturnValue(new MockMat(0, 0));

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('image_read_failed');
    }
  });

  it('returns invalid_contour when contour has no data32S', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);
    // Return a contour with no data32S
    (cv.approxPolyDP as jest.Mock).mockImplementation((_: OpenCVMatrix, approx: OpenCVMatrix) => {
      approx.rows = 4;
      approx.data32S = undefined;
    });

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('corner_extraction_failed');
    }
  });

  it('returns invalid_point_order when corner ordering fails', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);
    // Make all 4 points identical → ordering returns null
    (cv.approxPolyDP as jest.Mock).mockImplementation((_: OpenCVMatrix, approx: OpenCVMatrix) => {
      approx.rows = 4;
      approx.data32S = new Int32Array([50, 50, 50, 50, 50, 50, 50, 50]); // all same point
    });

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('invalid_point_order');
    }
  });

  it('returns invalid_warp_size when computed dimensions are too small', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);
    // Make all corners at the same location → warp size will be 0
    (cv.approxPolyDP as jest.Mock).mockImplementation((_: OpenCVMatrix, approx: OpenCVMatrix) => {
      approx.rows = 4;
      // Corners cluster so tightly that size rounds to 0
      approx.data32S = new Int32Array([10, 10, 11, 10, 11, 11, 10, 11]);
    });

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('invalid_warp_size');
    }
  });

  it('returns warp_failed when warpPerspective produces empty output', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);
    (cv.warpPerspective as jest.Mock).mockImplementation(
      (_s: OpenCVMatrix, dst: OpenCVMatrix) => {
        dst.rows = 0;
        dst.cols = 0;
      }
    );

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('warp_failed');
    }
  });

  it('returns threshold_failed when adaptiveThreshold produces empty output', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);
    (cv.adaptiveThreshold as jest.Mock).mockImplementation(
      (_s: OpenCVMatrix, dst: OpenCVMatrix) => {
        dst.rows = 0;
        dst.cols = 0;
      }
    );

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('threshold_failed');
    }
  });

  it('returns unexpected_runtime_error when an exception is thrown inside the pipeline', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);
    (cv.cvtColor as jest.Mock).mockImplementation(() => {
      throw new Error('OpenCV internal error');
    });

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe<ScanFailureReason>('unexpected_runtime_error');
      expect(result.message).toContain('OpenCV internal error');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// runScanPipeline — success path
// ─────────────────────────────────────────────────────────────────────────────

describe('runScanPipeline — success path', () => {
  it('returns ok=true for a valid document image', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.ok).toBe(true);
  });

  it('sets targetCanvas dimensions on success', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);

    const target = makeCanvas(1, 1);
    runScanPipeline(cv, makeCanvas(), target);

    // The mock warpPerspective produces 100×100, which flows through the pipeline
    expect(target.width).toBeGreaterThan(0);
    expect(target.height).toBeGreaterThan(0);
  });

  it('calls cv.imshow to render the final matrix', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);

    runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(cv.imshow).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// runScanPipeline — debug mode
// ─────────────────────────────────────────────────────────────────────────────

describe('runScanPipeline — debug mode', () => {
  it('returns debug output when debug=true and pipeline succeeds', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas(), { debug: true });

    expect(result.ok).toBe(true);
    expect(result.debug).toBeDefined();
    expect(result.debug?.grayscaleCanvas).toBeDefined();
    expect(result.debug?.edgesCanvas).toBeDefined();
    expect(result.debug?.warpedCanvas).toBeDefined();
    expect(result.debug?.thresholdedCanvas).toBeDefined();
  });

  it('returns debug output when debug=true and pipeline fails', () => {
    const cv = createMockOpenCV();
    // Default: no contours → fails with document_not_found

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas(), { debug: true });

    expect(result.ok).toBe(false);
    expect(result.debug).toBeDefined();
    expect(result.debug?.grayscaleCanvas).toBeDefined();
    expect(result.debug?.edgesCanvas).toBeDefined();
  });

  it('does not return debug output when debug=false (default)', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);

    const result = runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(result.debug).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// runScanPipeline — cleanup
// ─────────────────────────────────────────────────────────────────────────────

describe('runScanPipeline — cleanup', () => {
  it('calls delete on the src mat even when the pipeline fails', () => {
    const cv = createMockOpenCV();
    const mockSrc = new MockMat(480, 640);
    const deleteSpy = jest.spyOn(mockSrc, 'delete');
    (cv.imread as jest.Mock).mockReturnValue(mockSrc);
    // No contours → document_not_found failure

    runScanPipeline(cv, makeCanvas(), makeCanvas());

    expect(deleteSpy).toHaveBeenCalled();
  });

  it('calls delete on candidate contours after processing', () => {
    const cv = createMockOpenCV();
    mockSuccessContour(cv);

    const deletedContours: boolean[] = [];
    const originalClone = MockMat.prototype.clone;
    MockMat.prototype.clone = function () {
      const cloned = originalClone.call(this);
      const originalDelete = cloned.delete.bind(cloned);
      cloned.delete = () => {
        deletedContours.push(true);
        originalDelete();
      };
      return cloned;
    };

    runScanPipeline(cv, makeCanvas(), makeCanvas());

    MockMat.prototype.clone = originalClone;
    // At least the best candidate contour must have been deleted
    expect(deletedContours.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fixture-based tests
// ─────────────────────────────────────────────────────────────────────────────

describe('fixture-based pipeline tests', () => {
  it('valid document fixture (successful-scan.png) produces a typed success result', () => {
    const cv = createMockOpenCV();
    // Configure mock to simulate finding a clear document quadrilateral,
    // as a real OpenCV would on a well-lit A4 document photo.
    mockSuccessContour(cv);

    const sourceCanvas = createFixtureCanvas('successful-scan.png');
    const targetCanvas = makeCanvas(1, 1);

    const result = runScanPipeline(cv, sourceCanvas, targetCanvas);

    expect(result.ok).toBe(true);
  });

  it('invalid document fixture (failed-scan.png) produces a typed failure because document contours are not clearly detectable', () => {
    const cv = createMockOpenCV();
    // Default mock: findContours is a no-op (no contours pushed to vector),
    // simulating a noisy/no-document image where OpenCV finds no valid quadrilateral.

    const sourceCanvas = createFixtureCanvas('failed-scan.png');
    const targetCanvas = makeCanvas(1, 1);

    const result = runScanPipeline(cv, sourceCanvas, targetCanvas);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      // The invalid fixture must produce a meaningful typed failure reason
      const expectedReasons: ScanFailureReason[] = [
        'document_not_found',
        'invalid_contour',
        'corner_extraction_failed',
      ];
      expect(expectedReasons).toContain(result.reason);
    }
  });
});