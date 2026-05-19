import {
  OpenCVAPI,
  OpenCVMatrix,
  OpenCVMatVector,
  OpenCVSize
} from '@/src/types/opencv';

/**
 * Type helper for Jest mocks of OpenCV functions.
 * Using `any[]` instead of `unknown[]` for the function arguments
 * to satisfy the constraint of `Parameters<T>` while maintaining type safety for return values.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
type MockedFn<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

// Mock OpenCV matrix
export class MockMat implements OpenCVMatrix {
  rows: number;
  cols: number;
  typeValue: number;
  data8U?: Uint8Array;
  data32F?: Float32Array;
  data32S?: Int32Array;

  constructor(rows = 0, cols = 0, type = 0) {
    this.rows = rows;
    this.cols = cols;
    this.typeValue = type;
  }

  type(): number { return this.typeValue; }
  ptr(): number { return 0; }
  copyTo(): void {}
  clone(): MockMat {
    const copy = new MockMat(this.rows, this.cols, this.typeValue);
    copy.data8U = this.data8U;
    copy.data32F = this.data32F;
    copy.data32S = this.data32S;
    return copy;
  }
  release(): void {}
  delete(): void {}
}

// Mock MatVector
export class MockMatVector implements OpenCVMatVector {
  private mats: OpenCVMatrix[] = [];

  size(): number { return this.mats.length; }
  get(index: number): OpenCVMatrix { return this.mats[index]; }
  push_back(mat: OpenCVMatrix): void { this.mats.push(mat); }
  delete(): void { this.mats = []; }
}

// Mock OpenCV API
export function createMockOpenCV(): OpenCVAPI {
  const mockCv = {
    Mat: MockMat as any,
    MatVector: MockMatVector as any,
    PointVector: jest.fn() as any,
    imread: jest.fn() as MockedFn<OpenCVAPI['imread']>,
    imshow: jest.fn() as MockedFn<OpenCVAPI['imshow']>,
    cvtColor: jest.fn() as MockedFn<OpenCVAPI['cvtColor']>,
    GaussianBlur: jest.fn() as MockedFn<OpenCVAPI['GaussianBlur']>,
    Canny: jest.fn() as MockedFn<OpenCVAPI['Canny']>,
    dilate: jest.fn() as MockedFn<OpenCVAPI['dilate']>,
    getStructuringElement: jest.fn() as MockedFn<OpenCVAPI['getStructuringElement']>,
    findContours: jest.fn() as MockedFn<OpenCVAPI['findContours']>,
    arcLength: jest.fn() as MockedFn<OpenCVAPI['arcLength']>,
    approxPolyDP: jest.fn() as MockedFn<OpenCVAPI['approxPolyDP']>,
    isContourConvex: jest.fn() as MockedFn<OpenCVAPI['isContourConvex']>,
    contourArea: jest.fn() as MockedFn<OpenCVAPI['contourArea']>,
    convexHull: jest.fn() as MockedFn<OpenCVAPI['convexHull']>,
    boundingRect: jest.fn() as MockedFn<OpenCVAPI['boundingRect']>,
    minAreaRect: jest.fn() as MockedFn<OpenCVAPI['minAreaRect']>,
    threshold: jest.fn() as MockedFn<OpenCVAPI['threshold']>,
    resize: jest.fn() as MockedFn<OpenCVAPI['resize']>,
    getPerspectiveTransform: jest.fn() as MockedFn<OpenCVAPI['getPerspectiveTransform']>,
    warpPerspective: jest.fn() as MockedFn<OpenCVAPI['warpPerspective']>,
    adaptiveThreshold: jest.fn() as MockedFn<OpenCVAPI['adaptiveThreshold']>,
    matFromArray: jest.fn() as MockedFn<OpenCVAPI['matFromArray']>,
    Size: jest.fn((w, h) => ({ width: w, height: h })) as any,
    Point: jest.fn((x, y) => ({ x, y })) as any,
    Rect: jest.fn((x, y, w, h) => ({ x, y, width: w, height: h })) as any,
    Scalar: jest.fn() as any,
    morphologyEx: jest.fn() as MockedFn<OpenCVAPI['morphologyEx']>,
    transpose: jest.fn() as MockedFn<OpenCVAPI['transpose']>,
    flip: jest.fn() as MockedFn<OpenCVAPI['flip']>,

    // Constants
    CV_8U: 0,
    CV_8S: 1,
    CV_16U: 2,
    CV_16S: 3,
    CV_32S: 4,
    CV_32F: 5,
    CV_64F: 6,
    CV_32FC2: 13,
    COLOR_RGBA2GRAY: 11,
    COLOR_RGB2GRAY: 7,
    COLOR_BGR2GRAY: 6,
    COLOR_GRAY2RGBA: 8,
    COLOR_GRAY2RGB: 8,
    RETR_EXTERNAL: 0,
    RETR_LIST: 1,
    RETR_TREE: 3,
    CHAIN_APPROX_SIMPLE: 2,
    CHAIN_APPROX_NONE: 1,
    INTER_LINEAR: 1,
    INTER_NEAREST: 0,
    INTER_CUBIC: 2,
    INTER_AREA: 3,
    ADAPTIVE_THRESH_MEAN_C: 0,
    ADAPTIVE_THRESH_GAUSSIAN_C: 1,
    THRESH_BINARY: 0,
    THRESH_BINARY_INV: 1,
    THRESH_OTSU: 8,
    BORDER_CONSTANT: 0,
    BORDER_REPLICATE: 1,
    BORDER_REFLECT: 2,
    BORDER_WRAP: 3,
    BORDER_REFLECT_101: 4,
    BORDER_TRANSPARENT: 5,
    MORPH_RECT: 0,
    MORPH_CLOSE: 1,
    MORPH_OPEN: 2,
    MORPH_ERODE: 3,
    MORPH_DILATE: 4,
  } as any;

  const cv = mockCv as unknown as OpenCVAPI;
  const mock = (fn: any) => fn as jest.Mock;

  // Default implementations
  mock(cv.imread).mockImplementation((canvas: HTMLCanvasElement) => {
    if (!canvas) throw new Error('No canvas');
    return new MockMat(480, 640); // Mock 640x480 image
  });

  mock(cv.cvtColor).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.rows;
    dst.cols = src.cols;
  });

  mock(cv.GaussianBlur).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.rows;
    dst.cols = src.cols;
  });

  mock(cv.Canny).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.rows;
    dst.cols = src.cols;
  });

  mock(cv.dilate).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.rows;
    dst.cols = src.cols;
  });

  mock(cv.getStructuringElement).mockReturnValue(new MockMat());

  mock(cv.findContours).mockImplementation(() => {
    // Mock finding contours
  });

  mock(cv.arcLength).mockReturnValue(100);

  mock(cv.approxPolyDP).mockImplementation((curve: OpenCVMatrix, approx: OpenCVMatrix) => {
    // Mock approximation to 4 points
    approx.rows = 4;
    approx.cols = 1;
    approx.data32S = new Int32Array([0, 0, 100, 0, 100, 100, 0, 100]);
  });

  mock(cv.isContourConvex).mockReturnValue(true);

  mock(cv.contourArea).mockReturnValue(20000); // Above threshold

  mock(cv.convexHull).mockImplementation((points: OpenCVMatrix, hull: OpenCVMatrix) => {
    hull.rows = points.rows;
    hull.cols = points.cols;
  });

  mock(cv.boundingRect).mockReturnValue({ x: 0, y: 0, width: 100, height: 100 });

  mock(cv.minAreaRect).mockReturnValue({
    center: { x: 50, y: 50 },
    size: { width: 100, height: 100 },
    angle: 0
  });

  mock(cv.threshold).mockReturnValue(128);

  mock(cv.resize).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix, dsize: OpenCVSize) => {
    dst.rows = dsize.height;
    dst.cols = dsize.width;
  });

  mock(cv.getPerspectiveTransform).mockReturnValue(new MockMat());

  mock(cv.warpPerspective).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix, M: OpenCVMatrix, dsize: OpenCVSize) => {
    dst.rows = dsize.height;
    dst.cols = dsize.width;
  });

  mock(cv.adaptiveThreshold).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.rows;
    dst.cols = src.cols;
  });

  mock(cv.matFromArray).mockReturnValue(new MockMat());

  mock(cv.transpose).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.cols;
    dst.cols = src.rows;
  });

  mock(cv.flip).mockImplementation((src: OpenCVMatrix, dst: OpenCVMatrix) => {
    dst.rows = src.rows;
    dst.cols = src.cols;
  });

  return cv;
}
