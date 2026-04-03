/**
 * OpenCV.js type definitions for canvas-based document scanning.
 * These types wrap the global cv object with proper TypeScript support.
 */

export interface OpenCVMatrix {
  rows: number;
  cols: number;
  type(): number;
  data8U?: Uint8Array;
  data32F?: Float32Array;
  data32S?: Int32Array;
  ptr(row?: number, col?: number): number;
  copyTo(dst: OpenCVMatrix): void;
  clone(): OpenCVMatrix;
  release(): void;
  delete(): void;
}

export interface OpenCVPoint {
  x: number;
  y: number;
}

export interface OpenCVSize {
  width: number;
  height: number;
}

export interface OpenCVRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OpenCVContour = OpenCVMatrix;

export interface OpenCVVector<T> {
  size(): number;
  get(index: number): T;
  push_back(element: T): void;
  delete(): void;
}

export type OpenCVPointVector = OpenCVVector<OpenCVPoint>;
export type OpenCVMatVector = OpenCVVector<OpenCVMatrix>;

export type OpenCVKernel = OpenCVMatrix;

export interface OpenCVRotatedRect {
  center: OpenCVPoint;
  size: OpenCVSize;
  angle: number;
}

export interface OpenCVScalar {
  values?: readonly number[];
}

export interface OpenCVRuntimeAPI extends Partial<OpenCVAPI> {
  onRuntimeInitialized?: () => void;
}

/**
 * Global OpenCV.js API wrapper with explicit type definitions.
 * This represents the cv object that's loaded via <script src="opencv.js"></script>
 */
export interface OpenCVAPI {
  /**
   * Matrix class - the fundamental data structure in OpenCV
   */
  Mat: new (rows?: number, cols?: number, type?: number) => OpenCVMatrix;

  /**
   * Create a matrix from an HTML canvas element
   */
  imread(canvas: HTMLCanvasElement): OpenCVMatrix;

  /**
   * Render a matrix to an HTML canvas element
   */
  imshow(canvasId: string, mat: OpenCVMatrix): void;
  imshow(canvas: HTMLCanvasElement, mat: OpenCVMatrix): void;

  /**
   * Convert color space
   */
  cvtColor(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    code: number,
    dstCn?: number
  ): void;

  /**
   * Apply Gaussian blur
   */
  GaussianBlur(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    ksize: OpenCVSize,
    sigmaX: number,
    sigmaY?: number,
    borderType?: number
  ): void;

  /**
   * Resize image
   */
  resize(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    dsize: OpenCVSize,
    fx?: number,
    fy?: number,
    interpolation?: number
  ): void;

  /**
   * Canny edge detection
   */
  Canny(
    image: OpenCVMatrix,
    edges: OpenCVMatrix,
    threshold1: number,
    threshold2: number,
    apertureSize?: number,
    L2gradient?: boolean
  ): void;

  /**
   * Find contours in binary image
   */
  findContours(
    image: OpenCVMatrix,
    contours: OpenCVMatVector,
    hierarchy: OpenCVMatrix,
    mode: number,
    method: number,
    offset?: OpenCVPoint
  ): number;

  /**
   * Calculate contour area
   */
  contourArea(contour: OpenCVMatrix, oriented?: boolean): number;

  /**
   * Calculate contour arc length (perimeter)
   */
  arcLength(curve: OpenCVMatrix, closed: boolean): number;

  /**
   * Approximate contour to polygon
   */
  approxPolyDP(
    curve: OpenCVMatrix,
    approxCurve: OpenCVMatrix,
    epsilon: number,
    closed: boolean
  ): void;

  /**
   * Check if contour is convex
   */
  isContourConvex(contour: OpenCVMatrix): boolean;

  /**
   * Get convex hull
   */
  convexHull(
    points: OpenCVMatrix,
    hull: OpenCVMatrix,
    clockwise?: boolean,
    returnPoints?: boolean
  ): void;

  /**
   * Get bounding rectangle for contour
   */
  boundingRect(contour: OpenCVMatrix): OpenCVRect;

  /**
   * Get minimum area rectangle
   */
  minAreaRect(points: OpenCVMatrix): OpenCVRotatedRect;

  /**
   * Perspective transform
   */
  getPerspectiveTransform(
    src: OpenCVMatrix,
    dst: OpenCVMatrix
  ): OpenCVMatrix;

  /**
   * Apply perspective transform
   */
  warpPerspective(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    M: OpenCVMatrix,
    dsize: OpenCVSize,
    flags?: number,
    borderMode?: number,
    borderValue?: number
  ): void;

  /**
   * Adaptive thresholding
   */
  adaptiveThreshold(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    maxValue: number,
    adaptiveMethod: number,
    thresholdType: number,
    blockSize: number,
    C: number
  ): void;

  /**
   * Standard thresholding
   */
  threshold(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    thresh: number,
    maxval: number,
    type: number
  ): number;

  /**
   * Convex hull
   */
  convexHull(
    points: OpenCVMatrix,
    hull: OpenCVMatrix,
    clockwise?: boolean,
    returnPoints?: boolean
  ): void;

  /**
   * Bounding rectangle
   */
  boundingRect(contour: OpenCVMatrix): OpenCVRect;

  /**
   * Minimum area rectangle
   */
  minAreaRect(points: OpenCVMatrix): OpenCVRotatedRect;

  transpose(src: OpenCVMatrix, dst: OpenCVMatrix): void;
  flip(src: OpenCVMatrix, dst: OpenCVMatrix, flipCode: number): void;

  /**
   * Get structuring element for morphological operations
   */
  getStructuringElement(shape: number, ksize: OpenCVSize, anchor?: OpenCVPoint): OpenCVMatrix;

  /**
   * Vector constructors
   */
  MatVector: new () => OpenCVMatVector;
  PointVector: new () => OpenCVPointVector;

  /**
   * Create matrix from array
   */
  matFromArray(rows: number, cols: number, type: number, array: number[]): OpenCVMatrix;

  /**
   * Size constructor
   */
  Size: new (width: number, height: number) => OpenCVSize;

  /**
   * Point constructor
   */
  Point: new (x: number, y: number) => OpenCVPoint;

  /**
   * Rect constructor
   */
  Rect: new (x: number, y: number, width: number, height: number) => OpenCVRect;

  /**
   * Scalar constructor
   */
  Scalar: new (v0: number, v1?: number, v2?: number, v3?: number) => OpenCVScalar;

  /**
   * Matrix type codes
   */
  CV_8U: number;
  CV_8S: number;
  CV_16U: number;
  CV_16S: number;
  CV_32S: number;
  CV_32F: number;
  CV_64F: number;
  CV_32FC2: number;

  /**
   * Color space conversion codes
   */
  COLOR_RGBA2GRAY: number;
  COLOR_RGB2GRAY: number;
  COLOR_BGR2GRAY: number;
  COLOR_GRAY2RGBA: number;
  COLOR_GRAY2RGB: number;

  /**
   * Contour retrieval modes
   */
  RETR_EXTERNAL: number;
  RETR_LIST: number;
  RETR_TREE: number;

  /**
   * Contour approximation methods
   */
  CHAIN_APPROX_SIMPLE: number;
  CHAIN_APPROX_NONE: number;

  /**
   * Thresholding methods
   */
  THRESH_BINARY: number;
  THRESH_BINARY_INV: number;
  THRESH_OTSU: number;
  ADAPTIVE_THRESH_MEAN_C: number;
  ADAPTIVE_THRESH_GAUSSIAN_C: number;

  /**
   * Interpolation flags for warpPerspective
   */
  INTER_LINEAR: number;
  INTER_NEAREST: number;
  INTER_CUBIC: number;
  INTER_AREA: number;

  /**
   * Border modes
   */
  BORDER_CONSTANT: number;
  BORDER_REPLICATE: number;
  BORDER_REFLECT: number;
  BORDER_WRAP: number;
  BORDER_REFLECT_101: number;
  BORDER_TRANSPARENT: number;

  /**
   * Morphological operations
   */
  morphologyEx(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    op: number,
    kernel: OpenCVMatrix,
    anchor?: OpenCVPoint,
    iterations?: number,
    borderType?: number,
    borderValue?: number
  ): void;

  /**
   * Dilate image
   */
  dilate(
    src: OpenCVMatrix,
    dst: OpenCVMatrix,
    kernel: OpenCVMatrix,
    anchor?: OpenCVPoint,
    iterations?: number,
    borderType?: number,
    borderValue?: number
  ): void;

  MORPH_CLOSE: number;
  MORPH_OPEN: number;
  MORPH_ERODE: number;
  MORPH_DILATE: number;
  MORPH_RECT: number;
}

/**
 * Type guard to check if OpenCV is available and initialized
 */
export function isOpenCVAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const cv = (window as Window & { cv?: OpenCVRuntimeAPI }).cv;
  return cv != null && cv.Mat != null;
}

/**
 * Get the global OpenCV API with proper typing
 */
export function getOpenCV(): OpenCVAPI | null {
  if (!isOpenCVAvailable()) return null;
  return (window as Window & { cv?: OpenCVRuntimeAPI }).cv as OpenCVAPI;
}

/**
 * Assert OpenCV is available, throw if not
 */
export function requireOpenCV(): OpenCVAPI {
  const cv = getOpenCV();
  if (!cv) {
    throw new Error('OpenCV.js is not initialized or not available');
  }
  return cv;
}
