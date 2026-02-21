type CV = any;

export function getCv(): CV | null {
  return typeof window !== "undefined" ? (window as any).cv : null;
}

/**
 * Recognize document and write directly to the target canvas
 */
export function scanIntoCanvas(
  cv: CV,
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement
): boolean {
  const src = cv.imread(sourceCanvas);
  const proc = new cv.Mat();

  try {
    // resize für stabilere detection
    const maxWidth = 1000;
    const scale = src.cols > maxWidth ? maxWidth / src.cols : 1;
    const dsize = new cv.Size(
      Math.round(src.cols * scale),
      Math.round(src.rows * scale)
    );

    cv.resize(src, proc, dsize, 0, 0, cv.INTER_AREA);

    // grayscale
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edges = new cv.Mat();

    cv.cvtColor(proc, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edges, 75, 200);

    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE
    );

    let bestQuad = null;
    let bestArea = 0;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const peri = cv.arcLength(cnt, true);

      const approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

      if (approx.rows === 4 && cv.isContourConvex(approx)) {
        const area = cv.contourArea(approx);
        if (area > bestArea) {
          bestArea = area;
          bestQuad = approx.clone();
        }
      }

      approx.delete();
      cnt.delete();
    }

    if (!bestQuad) {
      gray.delete();
      blurred.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
      return false;
    }

    const pts = [];
    for (let i = 0; i < 4; i++) {
      const x = bestQuad.intPtr(i, 0)[0];
      const y = bestQuad.intPtr(i, 0)[1];
      pts.push({ x, y });
    }

    bestQuad.delete();

    // sortieren
    const sum = pts.map((p) => p.x + p.y);
    const diff = pts.map((p) => p.x - p.y);

    const tl = pts[sum.indexOf(Math.min(...sum))];
    const br = pts[sum.indexOf(Math.max(...sum))];
    const tr = pts[diff.indexOf(Math.max(...diff))];
    const bl = pts[diff.indexOf(Math.min(...diff))];

    function dist(a: any, b: any) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    const maxWidthOut = Math.round(Math.max(dist(br, bl), dist(tr, tl)));
    const maxHeightOut = Math.round(Math.max(dist(tr, br), dist(tl, bl)));

    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      tl.x,
      tl.y,
      tr.x,
      tr.y,
      br.x,
      br.y,
      bl.x,
      bl.y,
    ]);

    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0,
      0,
      maxWidthOut,
      0,
      maxWidthOut,
      maxHeightOut,
      0,
      maxHeightOut,
    ]);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const warped = new cv.Mat();

    cv.warpPerspective(
      proc,
      warped,
      M,
      new cv.Size(maxWidthOut, maxHeightOut)
    );

    // optional: threshold für scanner look
    const gray2 = new cv.Mat();
    const th = new cv.Mat();

    cv.cvtColor(warped, gray2, cv.COLOR_RGBA2GRAY);

    cv.adaptiveThreshold(
      gray2,
      th,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      25,
      10
    );

    const finalMat = new cv.Mat();
    cv.cvtColor(th, finalMat, cv.COLOR_GRAY2RGBA);

    targetCanvas.width = finalMat.cols;
    targetCanvas.height = finalMat.rows;

    cv.imshow(targetCanvas, finalMat);

    // cleanup
    src.delete();
    proc.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    warped.delete();
    gray2.delete();
    th.delete();
    finalMat.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();

    return true;
  } catch {
    src.delete();
    proc.delete();
    return false;
  }
}