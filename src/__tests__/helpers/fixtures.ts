import * as fs from 'fs';
import * as path from 'path';

const FIXTURES_DIR = path.join(process.cwd(), 'src', '__tests__', 'fixtures');

/**
 * Returns the absolute path to a fixture file and asserts it exists.
 */
export function getFixturePath(filename: string): string {
  const fullPath = path.join(FIXTURES_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Fixture not found: "${filename}". Expected at: ${fullPath}`);
  }
  return fullPath;
}

/**
 * Creates an HTMLCanvasElement representing a fixture image.
 * Validates that the fixture file exists on disk.
 * In jsdom, canvas pixel data is not populated (use jest-canvas-mock),
 * but the canvas has the correct dimensions for pipeline tests.
 */
export function createFixtureCanvas(
  filename: string,
  width = 640,
  height = 480
): HTMLCanvasElement {
  getFixturePath(filename); // throws if fixture is missing
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}