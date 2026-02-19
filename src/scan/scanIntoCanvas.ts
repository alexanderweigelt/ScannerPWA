import {OpenCVAPI} from '../types/opencv'; // Ensure OpenCV types are loaded

/**
 * Recognize document and write directly to the target canvas
 */
export function scanIntoCanvas(
    cv: OpenCVAPI,
    sourceCanvas: HTMLCanvasElement,
    targetCanvas: HTMLCanvasElement
): boolean {
    // Recognize document and write directly to the target canvas
    const src = cv.imread(sourceCanvas);
    const proc = new cv.Mat();

    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edges = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    const warped = new cv.Mat();
    const gray2 = new cv.Mat();
    const th = new cv.Mat();
    const finalMat = new cv.Mat();
    let srcTri = new cv.Mat();
    let dstTri = new cv.Mat();
    let M = new cv.Mat();

    try {
        const maxWidth = 1000;
        const scale = src.cols > maxWidth ? maxWidth / src.cols : 1;
        const dsize = new cv.Size(
            Math.round(src.cols * scale),
            Math.round(src.rows * scale)
        );

        cv.resize(src, proc, dsize, 0, 0, cv.INTER_AREA);

        cv.cvtColor(proc, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
        cv.Canny(blurred, edges, 75, 200);

        // Dilate the edges to close gaps
        const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
        cv.dilate(edges, edges, kernel);
        kernel.delete();

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

            // Accept 4-5 corners to be more lenient, then take largest
            if (approx.rows >= 4 && approx.rows <= 6 && cv.isContourConvex(approx)) {
                const area = cv.contourArea(approx);
                if (area > bestArea) {
                    bestArea = area;
                    if (bestQuad) bestQuad.delete();
                    bestQuad = approx.clone();
                }
            }

            approx.delete();
            cnt.delete();
        }

        if (!bestQuad || bestArea < (proc.cols * proc.rows) * 0.05) {
            if (bestQuad) bestQuad.delete();
            throw new Error("No document found or area too small");
        }

        const pts = [];
        const data = bestQuad.data32S;
        if (!data) {
            throw new Error("Contour data is unavailable");
        }
        for (let i = 0; i < bestQuad.rows; i++) {
            pts.push({ x: data[i * 2], y: data[i * 2 + 1] });
        }

        bestQuad.delete();

        // Sort points for perspective transform
        // tl: min(x+y), br: max(x+y), tr: min(y-x), bl: max(y-x)
        const sum = pts.map((p) => p.x + p.y);
        const diff = pts.map((p) => p.y - p.x);

        const tl = pts[sum.indexOf(Math.min(...sum))];
        const br = pts[sum.indexOf(Math.max(...sum))];
        const tr = pts[diff.indexOf(Math.min(...diff))];
        const bl = pts[diff.indexOf(Math.max(...diff))];

        function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
            return Math.hypot(a.x - b.x, a.y - b.y);
        }

        const maxWidthOut = Math.round(Math.max(dist(br, bl), dist(tr, tl)));
        const maxHeightOut = Math.round(Math.max(dist(tr, br), dist(tl, bl)));

        srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            tl.x / scale,
            tl.y / scale,
            tr.x / scale,
            tr.y / scale,
            br.x / scale,
            br.y / scale,
            bl.x / scale,
            bl.y / scale,
        ]);

        const maxWidthOutFull = Math.round(maxWidthOut / scale);
        const maxHeightOutFull = Math.round(maxHeightOut / scale);

        if (maxWidthOutFull < 10 || maxHeightOutFull < 10) {
            throw new Error("Resulting image too small");
        }

        dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0,
            0,
            maxWidthOutFull,
            0,
            maxWidthOutFull,
            maxHeightOutFull,
            0,
            maxHeightOutFull,
        ]);

        M = cv.getPerspectiveTransform(srcTri, dstTri);

        cv.warpPerspective(
            src,
            warped,
            M,
            new cv.Size(maxWidthOutFull, maxHeightOutFull)
        );

        cv.cvtColor(warped, gray2, cv.COLOR_RGBA2GRAY);

        cv.adaptiveThreshold(
            gray2,
            th,
            255,
            cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv.THRESH_BINARY,
            21,
            7
        );

        cv.cvtColor(th, finalMat, cv.COLOR_GRAY2RGBA);

        targetCanvas.width = finalMat.cols;
        targetCanvas.height = finalMat.rows;

        cv.imshow(targetCanvas, finalMat);

        return true;
    } catch (e) {
        console.warn("Scan failed:", e);
        return false;
    } finally {
        src.delete();
        proc.delete();
        if (gray) gray.delete();
        if (blurred) blurred.delete();
        if (edges) edges.delete();
        if (contours) contours.delete();
        if (hierarchy) hierarchy.delete();
        if (warped) warped.delete();
        if (gray2) gray2.delete();
        if (th) th.delete();
        if (finalMat) finalMat.delete();
        if (srcTri) srcTri.delete();
        if (dstTri) dstTri.delete();
        if (M) M.delete();
    }
}