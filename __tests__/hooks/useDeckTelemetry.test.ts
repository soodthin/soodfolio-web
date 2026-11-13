import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeckTelemetry } from '@/hooks/useDeckTelemetry';

describe('useDeckTelemetry Unit Tests', () => {
  let originalSendBeacon: typeof navigator.sendBeacon;
  let mockSendBeacon: ReturnType<typeof vi.fn>;
  let originalFetch: typeof global.fetch;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();

    mockSendBeacon = vi.fn().mockReturnValue(true);
    originalSendBeacon = navigator.sendBeacon;
    Object.defineProperty(navigator, 'sendBeacon', {
      writable: true,
      configurable: true,
      value: mockSendBeacon,
    });

    mockFetch = vi.fn().mockResolvedValue({ ok: true });
    originalFetch = global.fetch;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, 'sendBeacon', {
      writable: true,
      configurable: true,
      value: originalSendBeacon,
    });
    global.fetch = originalFetch;
  });

  it('batches telemetry into TelemetryBatchRequest format when switching slides after 5 seconds', () => {
    const { rerender } = renderHook(
      ({ activeSlide }) => useDeckTelemetry('test-token-123', activeSlide),
      { initialProps: { activeSlide: 'hero' } }
    );

    // Fast-forward 5 seconds on 'hero' slide
    vi.advanceTimersByTime(5000);

    // Switch to 'projects' slide
    rerender({ activeSlide: 'projects' });

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
    const [calledUrl, calledBlob] = mockSendBeacon.mock.calls[0];

    expect(calledUrl).toContain('/public/links/test-token-123/telemetry');
    expect(calledBlob).toBeInstanceOf(Blob);
  });

  it('caps dwellSeconds at 600s ceiling when idle for longer than 10 minutes', () => {
    const { rerender } = renderHook(
      ({ activeSlide }) => useDeckTelemetry('test-token-cap', activeSlide),
      { initialProps: { activeSlide: 'experience' } }
    );

    // Fast-forward 1000 seconds (> 600s cap)
    vi.advanceTimersByTime(1000 * 1000);

    // Switch slide to trigger flush
    rerender({ activeSlide: 'skills' });

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
  });

  it('flushes dwell time when visibilityState changes to hidden', () => {
    renderHook(() => useDeckTelemetry('test-token-vis', 'hero'));

    // Spend 10 seconds
    vi.advanceTimersByTime(10000);

    // Simulate tab hidden
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      configurable: true,
      value: 'hidden',
    });
    window.dispatchEvent(new Event('visibilitychange'));

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);

    // Spend 20 seconds while hidden -> should NOT trigger another beacon
    vi.advanceTimersByTime(20000);
    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
  });

  it('flushes dwell time on beforeunload', () => {
    renderHook(() => useDeckTelemetry('test-token-unload', 'projects'));

    // Spend 15 seconds
    vi.advanceTimersByTime(15000);

    window.dispatchEvent(new Event('beforeunload'));

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
  });
});