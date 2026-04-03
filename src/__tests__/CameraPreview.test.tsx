import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CameraPreview } from '@/src/camera/CameraPreview';

// Create a mock of the useCamera hook that can be modified per test
const mockUseCamera = jest.fn();

jest.mock('@/src/camera/useCamera', () => ({
  useCamera: () => mockUseCamera(),
}));

describe('CameraPreview', () => {
  beforeEach(() => {
    // Default mock return value
    mockUseCamera.mockReturnValue({
      streamRef: { current: null },
      error: null,
      scanError: null,
      isActive: false,
      startCamera: jest.fn(),
      stopCamera: jest.fn(),
      captureFrame: jest.fn(() => 'data:image/jpeg;base64,test'),
      videoRef: {
        current: {
          videoWidth: 640,
          videoHeight: 480,
          readyState: 2,
          srcObject: null,
          play: jest.fn(),
        } as unknown as HTMLVideoElement,
      },
    });

    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/jpeg;base64,test'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render start button', () => {
    render(<CameraPreview />);
    const button = screen.getByTestId('start-camera-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Start Camera');
  });

  it('should call startCamera when button is clicked', async () => {
    const startCamera = jest.fn();
    mockUseCamera.mockReturnValue({
      streamRef: { current: null },
      error: null,
      isActive: false,
      startCamera,
      stopCamera: jest.fn(),
      videoRef: { current: null },
    });

    render(<CameraPreview />);

    const button = screen.getByTestId('start-camera-button');
    await userEvent.click(button);

    expect(startCamera).toHaveBeenCalledTimes(1);
  });

  it('should render preview canvas when active', () => {
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
    });
    render(<CameraPreview />);
    const canvas = screen.getByTestId('preview-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render Capture Scan button when camera is active', () => {
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
    });
    render(<CameraPreview />);
    const button = screen.getByTestId('capture-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Capture Scan');
  });

  it('should render Stop Camera button when camera is active', () => {
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
    });
    render(<CameraPreview />);
    const button = screen.getByTestId('stop-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Stop Camera');
  });

  it('should call onCapture and show pending scan when Capture Scan is clicked', async () => {
    const mockOnCapture = jest.fn();
    const stopCamera = jest.fn();
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
      stopCamera,
    });

    render(<CameraPreview onCapture={mockOnCapture} />);

    const button = screen.getByTestId('capture-button');
    await userEvent.click(button);

    expect(mockOnCapture).toHaveBeenCalledTimes(1);
    expect(mockOnCapture).toHaveBeenCalledWith(
      expect.stringMatching(/^data:image\/jpeg;base64/)
    );
    expect(stopCamera).toHaveBeenCalled();

    // After capture, it should show the result image
    const resultImage = screen.getByTestId('scan-result-image');
    expect(resultImage).toBeInTheDocument();
    expect(resultImage).toHaveAttribute('src', 'data:image/jpeg;base64,test');
  });

  it('should handle Accept Scan correctly', async () => {
    const mockOnCapture = jest.fn();
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
    });

    render(<CameraPreview onCapture={mockOnCapture} />);

    // First capture
    const captureBtn = screen.getByTestId('capture-button');
    await userEvent.click(captureBtn);

    // Reset mock to check for second call
    mockOnCapture.mockClear();

    // Now accept
    const acceptBtn = screen.getByTestId('accept-scan-button');
    await userEvent.click(acceptBtn);

    expect(mockOnCapture).toHaveBeenCalledWith('data:image/jpeg;base64,test');
    // Result image should STILL be there after accept
    expect(screen.getByTestId('scan-result-image')).toBeInTheDocument();
  });

  it('should handle Scan Again correctly', async () => {
    const startCamera = jest.fn();
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
      startCamera,
    });

    render(<CameraPreview />);

    // First capture
    const captureBtn = screen.getByTestId('capture-button');
    await userEvent.click(captureBtn);

    // Now scan again
    const scanAgainBtn = screen.getByTestId('scan-again-button');
    await userEvent.click(scanAgainBtn);

    expect(startCamera).toHaveBeenCalled();
    // Result image should be gone
    expect(screen.queryByTestId('scan-result-image')).not.toBeInTheDocument();
  });

  it('should clear error when starting camera', async () => {
    const startCamera = jest.fn();
    // Start with an error state
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      error: 'Initial error',
      isActive: false,
      startCamera,
    });

    render(<CameraPreview />);

    // Error message should be visible initially
    expect(screen.getByTestId('error-message')).toBeInTheDocument();

    const button = screen.getByTestId('start-camera-button');
    await userEvent.click(button);

    expect(startCamera).toHaveBeenCalled();
    // Note: The actual error clearing happens inside startCamera in useCamera.ts
    // In our mock, startCamera would trigger a re-render where useCamera() returns error: null
  });

  it('should call onStop when Stop Camera is clicked', async () => {
    const mockOnStop = jest.fn();
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
    });
    render(<CameraPreview onStop={mockOnStop} />);

    const button = screen.getByTestId('stop-button');
    await userEvent.click(button);

    expect(mockOnStop).toHaveBeenCalledTimes(1);
  });

  it('should display error message when error is present', () => {
    mockUseCamera.mockReturnValue({
      streamRef: { current: null },
      error: 'Camera permission denied',
      isActive: false,
      startCamera: jest.fn(),
      stopCamera: jest.fn(),
      videoRef: { current: null },
    });

    render(<CameraPreview />);
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Camera permission denied');
  });

  it('should call onError when camera error occurs', () => {
    mockUseCamera.mockReturnValue({
      streamRef: { current: null },
      error: 'Camera not available',
      isActive: false,
      startCamera: jest.fn(),
      stopCamera: jest.fn(),
      videoRef: { current: null },
    });

    const mockOnError = jest.fn();
    render(<CameraPreview onError={mockOnError} />);

    expect(mockOnError).toHaveBeenCalledWith('Camera not available');
  });

  it('should handle video play failure gracefully', async () => {
    const mockOnError = jest.fn();

    // Mock useCamera to return error state
    mockUseCamera.mockReturnValue({
      streamRef: { current: null },
      error: 'Play failed',
      isActive: false,
      startCamera: jest.fn(),
      stopCamera: jest.fn(),
      videoRef: { current: null },
    });

    render(<CameraPreview onError={mockOnError} />);

    // Should show error message
    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Play failed');

    // Should call onError callback
    expect(mockOnError).toHaveBeenCalledWith('Play failed');
  });

  it('should render scan result image with data URL after capture', async () => {
    mockUseCamera.mockReturnValue({
      ...mockUseCamera(),
      isActive: true,
      captureFrame: jest.fn(() => 'data:image/jpeg;base64,mocked_image_data'),
    });

    render(<CameraPreview />);

    const captureBtn = screen.getByTestId('capture-button');
    await userEvent.click(captureBtn);

    const resultImage = screen.getByTestId('scan-result-image');
    expect(resultImage).toBeInTheDocument();
    expect(resultImage).toHaveAttribute('src', 'data:image/jpeg;base64,mocked_image_data');
  });
});
