import { render, act } from '@testing-library/react';
import { App } from '@/src/App';
import type { OpenCVRuntimeAPI } from '@/src/types/opencv';

type WindowWithCV = Window & typeof globalThis & { cv?: OpenCVRuntimeAPI };

// Store the onLoad callback to manually trigger it in tests
let capturedOnLoad: (() => void) | undefined;

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({
    onLoad,
    children,
  }: {
    onLoad?: () => void;
    children?: React.ReactNode;
  }) {
    // Capture the onLoad callback
    capturedOnLoad = onLoad;
    return <>{children}</>;
  };
});

describe('App - OpenCV Initialization', () => {
  let originalLog: typeof console.log;
  let logSpy: jest.Mock;

  beforeEach(() => {
    // Mock console.log
    originalLog = console.log;
    logSpy = jest.fn();
    console.log = logSpy;

    // Clean up window.cv if it exists
    delete (window as WindowWithCV).cv;
    capturedOnLoad = undefined;
  });

  afterEach(() => {
    // Restore console.log
    console.log = originalLog;
    delete (window as WindowWithCV).cv;
    capturedOnLoad = undefined;
    jest.clearAllMocks();
  });

  it('should call console.log("OpenCV.js ready") when OpenCV runtime initializes', async () => {
    // Create a mock cv object that simulates the OpenCV.js library (without Mat to trigger onRuntimeInitialized)
    const cvMock: OpenCVRuntimeAPI = {};
    (window as WindowWithCV).cv = cvMock;

    // Setup the onRuntimeInitialized property with getter/setter
    let runtimeCallback: (() => void) | undefined;
    Object.defineProperty(cvMock, 'onRuntimeInitialized', {
      set(callback: () => void) {
        runtimeCallback = callback;
      },
      get() {
        return runtimeCallback;
      },
      configurable: true,
    });

    // Render the App component (this captures onLoad in capturedOnLoad)
    const { getByTestId } = render(<App />);

    // Verify CameraPreview is rendered
    expect(getByTestId('start-camera-button')).toBeInTheDocument();

    // Manually trigger the onLoad callback that Script would normally call
    if (capturedOnLoad) {
      act(() => {
        capturedOnLoad?.();
      });
    }

    // Now trigger the onRuntimeInitialized callback that the App sets
    if (runtimeCallback) {
      // Simulate Mat being available after init
      cvMock.Mat = jest.fn();
      act(() => {
        runtimeCallback?.();
      });
    }

    // Verify console.log was called with the correct message
    expect(logSpy).toHaveBeenCalledWith('OpenCV.js ready');
  });

  it('should call console.log("OpenCV.js already ready") if Mat is already available', async () => {
    // Create a mock cv object with Mat already available
    (window as WindowWithCV).cv = {
      Mat: jest.fn(),
    };

    render(<App />);

    // Trigger the onLoad callback
    if (capturedOnLoad) {
      act(() => {
        capturedOnLoad?.();
      });
    }

    // Verify console.log was called with the "already ready" message
    expect(logSpy).toHaveBeenCalledWith('OpenCV.js already ready');
  });

  it('should not call console.log if cv is not available', async () => {
    // Don't set window.cv at all
    const { getByTestId } = render(<App />);

    // Component should still render
    expect(getByTestId('start-camera-button')).toBeInTheDocument();

    // Trigger the onLoad callback
    if (capturedOnLoad) {
      act(() => {
        capturedOnLoad?.();
      });
    }

    // console.log should not have been called with 'OpenCV.js ready'
    expect(logSpy).not.toHaveBeenCalledWith('OpenCV.js ready');
  });

  it('should setup onRuntimeInitialized callback when cv is available but Mat is not', async () => {
    // Create a mock cv object without Mat
    const cvMock: OpenCVRuntimeAPI = {};
    (window as WindowWithCV).cv = cvMock;

    let runtimeCallback: (() => void) | undefined;
    Object.defineProperty(cvMock, 'onRuntimeInitialized', {
      set(callback: () => void) {
        runtimeCallback = callback;
      },
      get() {
        return runtimeCallback;
      },
      configurable: true,
    });

    const { getByTestId } = render(<App />);

    // Verify CameraPreview is rendered
    expect(getByTestId('start-camera-button')).toBeInTheDocument();

    // Trigger the onLoad callback
    if (capturedOnLoad) {
      act(() => {
        capturedOnLoad?.();
      });
    }

    // Verify that the onRuntimeInitialized callback was set
    expect(runtimeCallback).toBeDefined();

    // Trigger the runtime initialization
    if (runtimeCallback) {
      act(() => {
        runtimeCallback?.();
      });
    }

    // Verify console.log was called
    expect(logSpy).toHaveBeenCalledWith('OpenCV.js ready');
  });
});











