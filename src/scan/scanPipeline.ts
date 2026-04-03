import type { OpenCVAPI, OpenCVMatrix, OpenCVMatVector } from '../types/opencv';

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────

export type ScanFailureReason =
  | 'input_canvas_missing'
  | 'image_read_failed'
  | 'document_not_found'
  | 'invalid_contour'
  | 'corner_extraction_failed'
  | 'invalid_point_order'
  | 'invalid_warp_size'
  | 'warp_failed'
  | 'threshold_failed'
  | 'render_failed'
  | 'unexpected_runtime_error';

export interface ScanDebugOutput {
  grayscaleCanvas?: HTMLCanvasElement;
  edgesCanvas?: HTMLCanvasElement;
  warpedCanvas?: HTMLCanvasElement;
  thresholdedCanvas?: HTMLCanvasElement;
}

export type ScanSuccess = {
  ok: true;
  debug?: ScanDebugOutput;
};

export type ScanFailure = {
  ok: false;
  reason: ScanFailureReason;
  message: string;
  debug?: ScanDebugOutput;
};

export type ScanResult = ScanSuccess | ScanFailure;

export interface ScanPipelineOptions {
  debug?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline config (typed constants, no magic numbers)
// ─────────────────────────────────────────────────────────────────────────────

export const SCAN_CONFIG = {
  /** Downscale source if wider than this before processing */
  maxProcessingWidth: 1000,
  /** Gaussian blur kernel size (must be odd) */
  gaussianKernel: 5,
  /** Canny edge detection low threshold */
  cannyLow: 75,
  /** Canny edge detection high threshold */
  cannyHigh: 200,
  /** Dilation kernel size to close edge gaps */
  dilateKernel: 3,
  /** Polygon approximation epsilon as fraction of perimeter */
  polyEpsilonRatio: 0.02,
  /** Minimum document contour area as fraction of processing image area */
  minContourAreaRatio: 0.05,
  /** Adaptive threshold block size (must be odd) */
  adaptiveBlockSize: 21,
  /** Adaptive threshold constant subtracted from mean */
  adaptiveC: 7,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

function pointDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function matToCanvas(cv: OpenCVAPI, mat: OpenCVMatrix): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = mat.cols;
  canvas.height = mat.rows;
  if (mat.rows > 0 && mat.cols > 0) {
    cv.imshow(canvas, mat);
  }
  return canvas;
}

function fail(
  reason: ScanFailureReason,
  message: string,
  debug?: ScanDebugOutput
): ScanFailure {
  return { ok: false, reason, message, debug };
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage: filter contour candidates
// ─────────────────────────────────────────────────────────────────────────────

export interface ContourCandidate {
  /** Caller must delete this mat when done */
  contour: OpenCVMatrix;
  area: number;
}

/**
 * Iterates raw contours and returns those that look like document quadrilaterals.
 * Each returned candidate.contour is a clone — caller owns it and must delete it.
 * The original contours in the MatVector are deleted by this function.
 */
export function filterContourCandidates(
  cv: OpenCVAPI,
  contours: OpenCVMatVector,
  minArea: number
): ContourCandidate[] {
  const candidates: ContourCandidate[] = [];

  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const peri = cv.arcLength(cnt, true);
    const approx = new cv.Mat();

    try {
      cv.approxPolyDP(cnt, approx, SCAN_CONFIG.polyEpsilonRatio * peri, true);

      if (
        approx.rows >= 4 &&
        approx.rows <= 6 &&
        cv.isContourConvex(approx) &&
        cv.contourArea(approx) > minArea
      ) {
        candidates.push({
          contour: approx.clone(),
          area: cv.contourArea(approx),
        });
      }
    } finally {
      approx.delete();
      cnt.delete();
    }
  }

  return candidates;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage: order corner points
// ─────────────────────────────────────────────────────────────────────────────

export interface OrderedCorners {
  tl: Point;
  tr: Point;
  br: Point;
  bl: Point;
}

/**
 * Orders an arbitrary set of points (≥4) into TL, TR, BR, BL by using
 * sum (x+y) and difference (y-x) of coordinates.
 * Returns null if the four derived corners are not distinct.
 */
export function orderCornerPoints(pts: Point[]): OrderedCorners | null {
  if (pts.length < 4) return null;

  const sums = pts.map((p) => p.x + p.y);
  const diffs = pts.map((p) => p.y - p.x);

  const tl = pts[sums.indexOf(Math.min(...sums))];
  const br = pts[sums.indexOf(Math.max(...sums))];
  const tr = pts[diffs.indexOf(Math.min(...diffs))];
  const bl = pts[diffs.indexOf(Math.max(...diffs))];

  if (!tl || !tr || !br || !bl) return null;

  // Require four distinct corners
  const unique = new Set([tl, tr, br, bl].map((p) => `${p.x},${p.y}`));
  if (unique.size < 4) return null;

  return { tl, tr, br, bl };
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage: compute warp target size
// ─────────────────────────────────────────────────────────────────────────────

export interface WarpTargetSize {
  width: number;
  height: number;
}

/**
 * Derives the output pixel dimensions from the ordered corners.
 * If corners are in a downscaled coordinate space, pass scale (<1) to map
 * back to full-resolution output.
 */
export function computeWarpTargetSize(
  corners: OrderedCorners,
  scale: number = 1
): WarpTargetSize {
  const { tl, tr, br, bl } = corners;

  const widthBottom = pointDistance(br, bl);
  const widthTop = pointDistance(tr, tl);
  const heightRight = pointDistance(tr, br);
  const heightLeft = pointDistance(tl, bl);

  return {
    width: Math.round(Math.max(widthBottom, widthTop) / scale),
    height: Math.round(Math.max(heightRight, heightLeft) / scale),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage: normalize portrait orientation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a portrait-oriented copy of the mat.
 * If already portrait (cols ≤ rows), returns a clone.
 * If landscape, rotates 90° CCW via transpose + horizontal flip.
 * Caller owns the returned mat and must delete it.
 */
export function normalizePortraitOrientation(
  cv: OpenCVAPI,
  warped: OpenCVMatrix
): OpenCVMatrix {
  if (warped.cols <= warped.rows) {
    return warped.clone();
  }

  // Landscape → 90° CCW to produce portrait
  const transposed = new cv.Mat();
  try {
    cv.transpose(warped, transposed);
    const portrait = new cv.Mat();
    cv.flip(transposed, portrait, 1);
    return portrait;
  } finally {
    transposed.delete();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main pipeline
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runs the full document scan pipeline on sourceCanvas and writes the
 * processed result to targetCanvas.
 *
 * Pipeline stages:
 *   imread → resize → grayscale → blur → Canny → dilate → findContours
 *   → filter → orderCorners → warpPerspective → portrait normalize
 *   → adaptiveThreshold → imshow
 */
export function runScanPipeline(
  cv: OpenCVAPI,
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  options?: ScanPipelineOptions
): ScanResult {
  const debugMode = options?.debug ?? false;
  const debugOutput: ScanDebugOutput = {};

  // Pre-allocate all mats so the finally block can always clean up.
  // imread is called first; if it throws, the subsequent allocations below
  // haven't run yet, but in practice cv.imread does not throw on a valid canvas.
  const src = cv.imread(sourceCanvas);
  const proc = new cv.Mat();
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  const warped = new cv.Mat();
  const gray2 = new cv.Mat();
  const thresholded = new cv.Mat();
  const finalMat = new cv.Mat();
  let portrait: OpenCVMatrix | null = null;
  let candidates: ContourCandidate[] = [];

  try {
    // ── 1. Validate imread result ─────────────────────────────────────────
    if (src.rows === 0 || src.cols === 0) {
      return fail('image_read_failed', 'cv.imread returned an empty matrix');
    }

    // ── 2. Scale down for faster processing ───────────────────────────────
    const scale =
      src.cols > SCAN_CONFIG.maxProcessingWidth
        ? SCAN_CONFIG.maxProcessingWidth / src.cols
        : 1;
    const dsize = new cv.Size(
      Math.round(src.cols * scale),
      Math.round(src.rows * scale)
    );
    cv.resize(src, proc, dsize, 0, 0, cv.INTER_AREA);

    // ── 3. Grayscale ──────────────────────────────────────────────────────
    cv.cvtColor(proc, gray, cv.COLOR_RGBA2GRAY);
    if (debugMode) {
      debugOutput.grayscaleCanvas = matToCanvas(cv, gray);
    }

    // ── 4. Gaussian blur ──────────────────────────────────────────────────
    cv.GaussianBlur(
      gray,
      blurred,
      new cv.Size(SCAN_CONFIG.gaussianKernel, SCAN_CONFIG.gaussianKernel),
      0
    );

    // ── 5. Canny edge detection ───────────────────────────────────────────
    cv.Canny(blurred, edges, SCAN_CONFIG.cannyLow, SCAN_CONFIG.cannyHigh);

    // ── 6. Dilate edges to close small gaps ───────────────────────────────
    const kernel = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(SCAN_CONFIG.dilateKernel, SCAN_CONFIG.dilateKernel)
    );
    cv.dilate(edges, edges, kernel);
    kernel.delete();

    if (debugMode) {
      debugOutput.edgesCanvas = matToCanvas(cv, edges);
    }

    // ── 7. Find external contours ─────────────────────────────────────────
    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    // ── 8. Filter to document-like quadrilateral candidates ───────────────
    const minArea = proc.cols * proc.rows * SCAN_CONFIG.minContourAreaRatio;
    candidates = filterContourCandidates(cv, contours, minArea);

    if (candidates.length === 0) {
      return fail(
        'document_not_found',
        'No document-like contour found — verify the document is clearly visible',
        debugMode ? debugOutput : undefined
      );
    }

    // ── 9. Select the largest candidate ───────────────────────────────────
    const best = candidates.reduce((a, b) => (a.area > b.area ? a : b));

    // ── 10. Extract corner points from contour data ────────────────────────
    const data = best.contour.data32S;
    if (!data || best.contour.rows < 4) {
      return fail(
        'corner_extraction_failed',
        `Contour data unavailable or has fewer than 4 points (rows=${best.contour.rows})`,
        debugMode ? debugOutput : undefined
      );
    }

    const rawPts: Point[] = [];
    for (let i = 0; i < best.contour.rows; i++) {
      rawPts.push({ x: data[i * 2], y: data[i * 2 + 1] });
    }

    // ── 11. Order corners TL → TR → BR → BL ──────────────────────────────
    const corners = orderCornerPoints(rawPts);
    if (!corners) {
      return fail(
        'invalid_point_order',
        `Could not establish a consistent corner ordering from ${rawPts.length} points`,
        debugMode ? debugOutput : undefined
      );
    }

    console.debug('[scan] ordered corners:', corners);

    // ── 12. Compute warp output size (scaled back to full-res) ────────────
    const warpSize = computeWarpTargetSize(corners, scale);

    if (warpSize.width < 10 || warpSize.height < 10) {
      return fail(
        'invalid_warp_size',
        `Computed warp target is too small: ${warpSize.width}×${warpSize.height}`,
        debugMode ? debugOutput : undefined
      );
    }

    // ── 13. Perspective warp (using original full-res src) ─────────────────
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      corners.tl.x / scale, corners.tl.y / scale,
      corners.tr.x / scale, corners.tr.y / scale,
      corners.br.x / scale, corners.br.y / scale,
      corners.bl.x / scale, corners.bl.y / scale,
    ]);
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0,              0,
      warpSize.width, 0,
      warpSize.width, warpSize.height,
      0,              warpSize.height,
    ]);
    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    srcTri.delete();
    dstTri.delete();

    cv.warpPerspective(
      src,
      warped,
      M,
      new cv.Size(warpSize.width, warpSize.height)
    );
    M.delete();

    if (warped.rows === 0 || warped.cols === 0) {
      return fail(
        'warp_failed',
        'warpPerspective produced an empty matrix',
        debugMode ? debugOutput : undefined
      );
    }

    if (debugMode) {
      debugOutput.warpedCanvas = matToCanvas(cv, warped);
    }

    // ── 14. Normalize to portrait orientation ─────────────────────────────
    portrait = normalizePortraitOrientation(cv, warped);

    // ── 15. Grayscale + adaptive threshold → scan look ────────────────────
    cv.cvtColor(portrait, gray2, cv.COLOR_RGBA2GRAY);
    cv.adaptiveThreshold(
      gray2,
      thresholded,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      SCAN_CONFIG.adaptiveBlockSize,
      SCAN_CONFIG.adaptiveC
    );

    console.debug(
      `[scan] threshold: ADAPTIVE_GAUSSIAN_C blockSize=${SCAN_CONFIG.adaptiveBlockSize} C=${SCAN_CONFIG.adaptiveC}`,
      `output empty=${thresholded.rows === 0}`
    );

    if (thresholded.rows === 0 || thresholded.cols === 0) {
      return fail(
        'threshold_failed',
        'adaptiveThreshold produced an empty matrix',
        debugMode ? debugOutput : undefined
      );
    }

    if (debugMode) {
      debugOutput.thresholdedCanvas = matToCanvas(cv, thresholded);
    }

    // ── 16. Render to target canvas ───────────────────────────────────────
    cv.cvtColor(thresholded, finalMat, cv.COLOR_GRAY2RGBA);

    targetCanvas.width = finalMat.cols;
    targetCanvas.height = finalMat.rows;
    cv.imshow(targetCanvas, finalMat);

    console.debug(`[scan] success: ${finalMat.cols}×${finalMat.rows}`);

    return { ok: true, debug: debugMode ? debugOutput : undefined };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn('[scan] unexpected error:', message);
    return fail(
      'unexpected_runtime_error',
      message,
      debugMode ? debugOutput : undefined
    );
  } finally {
    for (const c of candidates) c.contour.delete();
    src.delete();
    proc.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    warped.delete();
    portrait?.delete();
    gray2.delete();
    thresholded.delete();
    finalMat.delete();
  }
}