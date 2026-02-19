import { test, expect } from '@playwright/test';

test.describe('Scanner PWA - Main Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock getUserMedia and Video/Canvas behaviors for camera access
    await page.addInitScript(() => {
      // Mock OpenCV
      const cvMock: { Mat: new () => object; onRuntimeInitialized: (() => void) | null } = {
        Mat: class {},
        onRuntimeInitialized: null,
      };
      (window as unknown as { cv: typeof cvMock }).cv = cvMock;

      // Trigger the initialization if someone sets it
      Object.defineProperty(cvMock, 'onRuntimeInitialized', {
        set(fn) {
          this._onRuntimeInitialized = fn;
          if (fn) {
            setTimeout(() => fn(), 100);
          }
        },
        get() {
          return this._onRuntimeInitialized;
        }
      });

      // Mock MediaDevices
      navigator.mediaDevices.getUserMedia = async () => {
        const stream = {
          getTracks: () => [{ stop: () => {} }],
          getVideoTracks: () => [{ stop: () => {} }],
          getAudioTracks: () => [],
          getTrackById: () => null,
          addTrack: () => {},
          removeTrack: () => {},
          clone: () => stream,
          active: true,
          onaddtrack: null,
          onremovetrack: null,
          onactive: null,
          oninactive: null,
        } as unknown as MediaStream;
        return stream;
      };

      // Mock HTMLVideoElement.prototype.play and metadata
      HTMLVideoElement.prototype.play = async function() {
        // Simulate video metadata loading
        Object.defineProperty(this, 'videoWidth', { configurable: true, value: 640 });
        Object.defineProperty(this, 'videoHeight', { configurable: true, value: 480 });
        Object.defineProperty(this, 'readyState', { configurable: true, value: 4 }); // HAVE_ENOUGH_DATA
        this.dispatchEvent(new Event('loadedmetadata'));
        this.dispatchEvent(new Event('canplay'));
        this.dispatchEvent(new Event('canplaythrough'));
        return Promise.resolve();
      };
    });

    await page.goto('http://localhost:3000');
  });

  test('should complete full workflow: Start → Capture → Accept/Scan Again → Stop', async ({
    page, context
  }) => {
    await context.grantPermissions(['camera']);

    // 1. Start view should be visible
    const startButton = page.getByTestId('start-camera-button');
    await expect(startButton).toBeVisible();
    expect(await startButton.textContent()).toBe('Start Camera');

    // 2. Click Start Camera
    await startButton.click();

    // 3. Camera preview should be visible
    await expect(page.getByTestId('preview-canvas')).toBeVisible();
    await expect(page.getByTestId('capture-button')).toBeVisible();
    await expect(page.getByTestId('stop-button')).toBeVisible();

    // 4. Click Capture Scan
    const captureButton = page.getByTestId('capture-button');
    await captureButton.click();

    // 5. Scan result preview should be visible
    const resultImage = page.getByTestId('scan-result-image');
    await expect(resultImage).toBeVisible();

    // Verify correct dimensions (not tiny 3x4 or empty)
    const dimensions = await resultImage.evaluate((img: HTMLImageElement) => {
      return { width: img.naturalWidth, height: img.naturalHeight };
    });
    expect(dimensions.width).toBeGreaterThan(10);
    expect(dimensions.height).toBeGreaterThan(10);

    const acceptButton = page.getByTestId('accept-scan-button');
    const scanAgainButton = page.getByTestId('scan-again-button');
    await expect(acceptButton).toBeVisible();
    await expect(scanAgainButton).toBeVisible();

    // 6. Accept scan (placeholder - does nothing for now)
    await acceptButton.click();
    // Still in scan preview after accept
    await expect(page.getByTestId('scan-result-image')).toBeVisible();

    // 7. Scan again
    await scanAgainButton.click();
    // Camera preview should be active again
    await expect(page.getByTestId('preview-canvas')).toBeVisible();
    await expect(page.getByTestId('capture-button')).toBeVisible();

    // 8. Stop camera
    const stopButton = page.getByTestId('stop-button');
    await stopButton.click();

    // 9. Should return to start view
    await expect(page.getByTestId('start-camera-button')).toBeVisible();
  });

  test('should always show Stop Camera button when camera is active', async ({
    page, context
  }) => {
    await context.grantPermissions(['camera']);

    // Start camera
    await page.getByTestId('start-camera-button').click();

    // Stop Camera button should be visible
    const stopButton = page.getByTestId('stop-button');
    await expect(stopButton).toBeVisible();

    // It should remain visible and functional even after interactions
    const captureButton = page.getByTestId('capture-button');
    await expect(captureButton).toBeVisible();
    expect(await stopButton.isVisible()).toBe(true);
  });

  test('should allow scanning multiple documents', async ({ page, context }) => {
    await context.grantPermissions(['camera']);

    // First scan
    await page.getByTestId('start-camera-button').click();
    await page.getByTestId('capture-button').click();
    await expect(page.getByTestId('scan-result-image')).toBeVisible();

    // Scan again
    await page.getByTestId('scan-again-button').click();
    await expect(page.getByTestId('preview-canvas')).toBeVisible();

    // Second capture
    await page.getByTestId('capture-button').click();
    await expect(page.getByTestId('scan-result-image')).toBeVisible();

    // Scan again
    await page.getByTestId('scan-again-button').click();

    // Stop
    await page.getByTestId('stop-button').click();
    await expect(page.getByTestId('start-camera-button')).toBeVisible();
  });
});

test.describe('Camera Permission Scenarios', () => {
  test('should handle camera permission denied gracefully', async ({
    page,
  }) => {
    // Override the default mock to reject (permission denied)
    await page.addInitScript(() => {
      navigator.mediaDevices.getUserMedia = async () => {
        throw new DOMException('Permission denied', 'NotAllowedError');
      };
    });

    await page.goto('http://localhost:3000');

    // Click Start Camera
    const startButton = page.getByTestId('start-camera-button');
    await startButton.click();

    // Should show error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    expect(await page.getByTestId('error-message').textContent()).toContain('Permission denied');
  });
});
