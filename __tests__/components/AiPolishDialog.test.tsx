import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiPolishDialog } from '@/components/dashboard/studio/AiPolishDialog';
import * as apiClient from '@/lib/apiClient';

describe('AiPolishDialog Component Unit & Anti-Pattern Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnApply = vi.fn();

  const sampleRawText = 'Tối ưu hóa hệ thống backend giúp giảm thời gian phản hồi của API và tăng độ tin cậy.';

  const mockPolishResponse = {
    metricXyz: 'Tối ưu 42% thời gian phản hồi (p99 latency từ 380ms xuống 220ms) bằng cách áp dụng Redis caching và reactive pipeline.',
    architectural: 'Tái cấu trúc kiến trúc microservices từ synchronous REST sang event-driven architecture với Apache Kafka.',
    concise: 'Thiết kế pipeline xử lý dữ liệu phân tán, tăng thông lượng hệ thống lên 3.5 lần.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('Modal Open / Close Lifecycle', () => {
    it('does not render anything when isOpen is false', () => {
      const { container } = render(
        <AiPolishDialog
          isOpen={false}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      expect(container.firstChild).toBeNull();
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders modal header, badges, and Before/After columns when isOpen is true', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      expect(screen.getByRole('dialog')).toBeDefined();
      expect(screen.getByText('AI Studio · Tối ưu Nội dung')).toBeDefined();
      expect(screen.getAllByText('Google X-Y-Z').length).toBeGreaterThan(0);

      // Wait for API resolution so Before & After columns render
      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      expect(screen.getByText('Bản nháp ban đầu')).toBeDefined();
      expect(screen.getByText('Phương án đề xuất')).toBeDefined();
      expect(screen.getByText(sampleRawText)).toBeDefined();
    });

    it('calls onClose when close icon button (X) is clicked', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="bio"
          onApply={mockOnApply}
        />
      );

      const closeButton = screen.getByLabelText('Đóng hộp thoại');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnApply).not.toHaveBeenCalled();
    });

    it('calls onClose when "Hủy" button is clicked without invoking onApply', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="exp_bullet"
          onApply={mockOnApply}
        />
      );

      const cancelButton = screen.getByRole('button', { name: 'Hủy' });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnApply).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="exp_bullet"
          onApply={mockOnApply}
        />
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when clicking the modal backdrop overlay', () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="exp_bullet"
          onApply={mockOnApply}
        />
      );

      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation & Initial Text Handling', () => {
    it('shows validation error when rawText is empty and does not call API', async () => {
      const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth');

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText="   "
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      expect(
        screen.getByText('Vui lòng nhập nội dung sơ khởi trước khi yêu cầu AI tối ưu.')
      ).toBeDefined();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('API Integration, Payload & Loading State', () => {
    it('dispatches POST /api/v1/ai/polish with trimmed text and field', async () => {
      const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={`  ${sampleRawText}  `}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/ai/polish'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawText: sampleRawText,
            field: 'project_desc',
          }),
        })
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });
    });

    it('shows loading spinner and descriptive text while waiting for response', async () => {
      let resolvePromise: (value: Response) => void;
      const deferredResponse = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.spyOn(apiClient, 'fetchWithAuth').mockReturnValue(deferredResponse);

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      expect(
        screen.getByText('Đang phân tích và định dạng theo công thức X-Y-Z')
      ).toBeDefined();
      expect(
        screen.getByText(
          'Hệ thống đang chuẩn hoá từ khóa công nghệ, đo lường các chỉ số tác động và cấu trúc câu mô tả...'
        )
      ).toBeDefined();

      // Resolve API
      resolvePromise!(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });
    });
  });

  describe('3 Style Selection Cards & Card Highlighting', () => {
    beforeEach(() => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('renders all 3 style cards: metricXyz, architectural, and concise', async () => {
      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      // Verify titles and badges
      expect(screen.getByText('Định lượng Thành tựu')).toBeDefined();
      expect(screen.getByText('Giải pháp Kiến trúc & Kỹ thuật')).toBeDefined();
      expect(screen.getByText('Ngắn gọn & Súc tích')).toBeDefined();

      expect(screen.getByText(mockPolishResponse.architectural)).toBeDefined();
      expect(screen.getByText(mockPolishResponse.concise)).toBeDefined();
    });

    it('defaults to selecting metricXyz and switches active card on click', async () => {
      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      // Click architectural card
      const archCard = screen.getByText('Giải pháp Kiến trúc & Kỹ thuật').closest('div[class*="rounded-2xl"]');
      expect(archCard).toBeDefined();
      fireEvent.click(archCard!);

      // Click "Áp dụng" to confirm architectural text is applied
      const applyBtn = screen.getByRole('button', { name: /Áp dụng/i });
      fireEvent.click(applyBtn);

      expect(mockOnApply).toHaveBeenCalledWith(mockPolishResponse.architectural);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('copies selected card text to clipboard and displays "Đã chép"', async () => {
      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      const copyButtons = screen.getAllByRole('button', { name: /Sao chép/i });
      expect(copyButtons.length).toBe(3);

      fireEvent.click(copyButtons[0]);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPolishResponse.metricXyz);
      expect(screen.getByText('Đã chép')).toBeDefined();
    });
  });

  describe('Apply Action Behavior', () => {
    it('applies default metricXyz and closes modal when "Áp dụng" is clicked', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="exp_bullet"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      const applyBtn = screen.getByRole('button', { name: /Áp dụng/i });
      fireEvent.click(applyBtn);

      expect(mockOnApply).toHaveBeenCalledWith(mockPolishResponse.metricXyz);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('applies concise style when concise card is clicked before applying', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="bio"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.concise)).toBeDefined();
      });

      const conciseCard = screen.getByText('Ngắn gọn & Súc tích').closest('div[class*="rounded-2xl"]');
      fireEvent.click(conciseCard!);

      const applyBtn = screen.getByRole('button', { name: /Áp dụng/i });
      fireEvent.click(applyBtn);

      expect(mockOnApply).toHaveBeenCalledWith(mockPolishResponse.concise);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('disables "Áp dụng" button when loading or no options are loaded', () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockReturnValue(new Promise(() => {}));

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="bio"
          onApply={mockOnApply}
        />
      );

      const applyBtn = screen.getByRole('button', { name: /Áp dụng/i }) as HTMLButtonElement;
      expect(applyBtn.disabled).toBe(true);
      expect(applyBtn.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Error Handling & Rate Limiting (429, 503, Network Errors)', () => {
    it('displays 429 rate limit banner when user exceeds 15 req/min', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 429,
            message: 'Rate limit exceeded: 15 req/min',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            'Bạn đã đạt giới hạn 15 yêu cầu AI mỗi phút. Vui lòng đợi trong giây lát rồi thử lại.'
          )
        ).toBeDefined();
      });

      expect(screen.getByRole('button', { name: /Thử lại/i })).toBeDefined();
    });

    it('displays 503 service unavailable banner when backend is busy', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(
          JSON.stringify({
            status: 503,
            message: 'Service Unavailable',
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            'Dịch vụ AI Studio hiện đang bận hoặc tạm thời không khả dụng. Vui lòng thử lại sau giây lát.'
          )
        ).toBeDefined();
      });
    });

    it('displays network connection error banner on network failure and allows retry', async () => {
      const fetchSpy = vi.spyOn(apiClient, 'fetchWithAuth').mockRejectedValue(
        new Error('Failed to fetch')
      );

      render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Lỗi kết nối máy chủ \(Failed to fetch\)/i)
        ).toBeDefined();
      });

      // Now set mock to success for retry
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const retryBtn = screen.getByRole('button', { name: /Thử lại/i });
      fireEvent.click(retryBtn);

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });
    });
  });

  describe('UI Anti-Pattern & Design Discipline Verification', () => {
    it('contains strictly ZERO emojis across all rendered modal content', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { container } = render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      const textContent = container.textContent || '';
      expect(emojiRegex.test(textContent)).toBe(false);
      expect(textContent.includes('\u2713')).toBe(false);
    });

    it('enforces font-sans and avoids square brackets [ ] or slashes // on buttons and tabs', async () => {
      vi.spyOn(apiClient, 'fetchWithAuth').mockResolvedValue(
        new Response(JSON.stringify(mockPolishResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const { container } = render(
        <AiPolishDialog
          isOpen={true}
          onClose={mockOnClose}
          rawText={sampleRawText}
          field="project_desc"
          onApply={mockOnApply}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(mockPolishResponse.metricXyz)).toBeDefined();
      });

      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn) => {
        const text = (btn.textContent || '').trim();
        // Button text should not contain literal brackets [ ] or slashes //
        expect(text).not.toMatch(/\[.*\]/);
        expect(text).not.toContain('//');

        // Check font-sans on buttons that render text
        if (text.length > 0) {
          const classAttr = btn.getAttribute('class') || '';
          const hasFontSans =
            classAttr.includes('font-sans') ||
            Array.from(btn.querySelectorAll('*')).some((el) => {
              const attr = el.getAttribute('class') || '';
              return attr.includes('font-sans');
            });
          expect(hasFontSans).toBe(true);
        }
      });
    });
  });
});
