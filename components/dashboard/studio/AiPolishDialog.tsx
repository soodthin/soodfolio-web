'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Check, X, Loader2, RefreshCw, AlertCircle, Copy } from 'lucide-react';
import { API_BASE } from '@/lib/auth';
import { fetchWithAuth } from '@/lib/apiClient';

export type AiPolishField = 'project_desc' | 'exp_bullet' | 'bio';

export type AiPolishStyleKey = 'metricXyz' | 'architectural' | 'concise';

export interface AiPolishResponse {
  metricXyz: string;
  architectural: string;
  concise: string;
}

export interface AiPolishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  field: AiPolishField;
  onApply: (refinedText: string) => void;
}

interface StyleCardMeta {
  key: AiPolishStyleKey;
  badge: string;
  title: string;
  description: string;
}

const STYLE_CARDS: StyleCardMeta[] = [
  {
    key: 'metricXyz',
    badge: 'Google X-Y-Z',
    title: 'Định lượng Thành tựu',
    description: 'Tập trung đo lường số liệu %, thời gian, thông lượng và quy mô người dùng.',
  },
  {
    key: 'architectural',
    badge: 'Architecture',
    title: 'Giải pháp Kiến trúc & Kỹ thuật',
    description: 'Nhấn mạnh các quyết định kiến trúc, mô hình phân tán và đánh đổi kỹ thuật.',
  },
  {
    key: 'concise',
    badge: 'Concise',
    title: 'Ngắn gọn & Súc tích',
    description: 'Đanh thép, loại bỏ từ thừa, câu mở đầu bằng động từ hành động dứt khoát.',
  },
];

export const AiPolishDialog: React.FC<AiPolishDialogProps> = ({
  isOpen,
  onClose,
  rawText,
  field,
  onApply,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<AiPolishResponse | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AiPolishStyleKey>('metricXyz');
  const [copiedKey, setCopiedKey] = useState<AiPolishStyleKey | null>(null);

  const fetchPolish = useCallback(async () => {
    const trimmed = (rawText || '').trim();
    if (!trimmed) {
      setError('Vui lòng nhập nội dung sơ khởi trước khi yêu cầu AI tối ưu.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`${API_BASE}/ai/polish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: trimmed,
          field,
        }),
      });

      if (response.status === 429) {
        setError('Bạn đã đạt giới hạn 15 yêu cầu AI mỗi phút. Vui lòng đợi trong giây lát rồi thử lại.');
        return;
      }

      if (response.status === 503) {
        setError('Dịch vụ AI Studio hiện đang bận hoặc tạm thời không khả dụng. Vui lòng thử lại sau giây lát.');
        return;
      }

      if (!response.ok) {
        let errorMsg = 'Không thể tối ưu nội dung. Vui lòng kiểm tra lại.';
        try {
          const errData = await response.json();
          if (errData?.message) errorMsg = errData.message;
        } catch {
          // ignore json parse error
        }
        setError(errorMsg);
        return;
      }

      const data: AiPolishResponse = await response.json();
      setOptions(data);
      setSelectedStyle('metricXyz');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Lỗi kết nối máy chủ (${msg}). Vui lòng kiểm tra lại dịch vụ Backend.`);
    } finally {
      setIsLoading(false);
    }
  }, [rawText, field]);

  // Trigger fetch when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOptions(null);
      setError(null);
      setSelectedStyle('metricXyz');
      setCopiedKey(null);
      fetchPolish();
    }
  }, [isOpen, fetchPolish]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (key: AiPolishStyleKey, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleApply = () => {
    if (!options) return;
    const chosenText = options[selectedStyle];
    if (chosenText) {
      onApply(chosenText);
      onClose();
    }
  };

  if (!isOpen) return null;

  const wordCount = (rawText || '').trim().split(/\s+/).filter(Boolean).length;
  const charCount = (rawText || '').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-polish-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0c131a] border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="ai-polish-title"
                  className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white"
                >
                  AI Studio · Tối ưu Nội dung
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  Google X-Y-Z
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                Chuẩn hoá theo chuẩn công thức thành tựu định lượng và kiến trúc kỹ thuật chuyên sâu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs font-sans text-amber-800 dark:text-amber-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">Thông báo từ AI Studio</span>
                  <p className="leading-relaxed">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchPolish}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-amber-900 dark:text-amber-100 bg-amber-500/20 hover:bg-amber-500/30 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-teal-600 dark:text-teal-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold font-sans text-slate-900 dark:text-white">
                  Đang phân tích và định dạng theo công thức X-Y-Z
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-md">
                  Hệ thống đang chuẩn hoá từ khóa công nghệ, đo lường các chỉ số tác động và cấu trúc câu mô tả...
                </p>
              </div>
            </div>
          )}

          {/* 2-Column Before vs After Layout */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Original Draft (Before) */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold font-sans text-slate-700 dark:text-slate-300">
                    Bản nháp ban đầu
                  </label>
                  <span className="text-[11px] font-sans text-slate-400">
                    {charCount} ký tự · {wordCount} từ
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-[#111a24] border border-slate-200 dark:border-white/10 p-4 min-h-[220px] max-h-[360px] overflow-y-auto">
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap">
                    {rawText || '(Chưa có nội dung văn bản gốc)'}
                  </p>
                </div>

                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
                  Văn bản gốc do bạn soạn thảo trước khi được AI Studio tinh chỉnh theo tiêu chuẩn ATS và Google X-Y-Z.
                </p>
              </div>

              {/* Right Column: 3 Style Cards (After) */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold font-sans text-slate-700 dark:text-slate-300">
                    Phương án đề xuất
                  </label>
                  <span className="text-[11px] font-sans text-teal-600 dark:text-teal-400 font-medium">
                    Chọn 1 phong cách phù hợp
                  </span>
                </div>

                {options ? (
                  <div className="space-y-3">
                    {STYLE_CARDS.map(({ key, badge, title, description }) => {
                      const isSelected = selectedStyle === key;
                      const content = options[key] || '';
                      const isCopied = copiedKey === key;

                      return (
                        <div
                          key={key}
                          onClick={() => setSelectedStyle(key)}
                          className={`rounded-2xl border p-4 transition-all cursor-pointer font-sans relative ${
                            isSelected
                              ? 'bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/60 ring-1 ring-teal-500/40 shadow-xs'
                              : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans border ${
                                  isSelected
                                    ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30'
                                    : 'bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-white/10'
                                }`}
                              >
                                {badge}
                              </span>
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(key, content);
                                }}
                                title="Sao chép phương án này"
                                className="h-6 px-2 rounded-md text-[10px] font-sans font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                                    <span>Đã chép</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Sao chép</span>
                                  </>
                                )}
                              </button>

                              <div
                                className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-teal-600 dark:bg-teal-500 border-teal-600 dark:border-teal-500 text-white'
                                    : 'border-slate-300 dark:border-white/20'
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-snug">
                            {description}
                          </p>

                          <div className="rounded-xl bg-white dark:bg-[#111a24] border border-slate-200/80 dark:border-white/10 p-3 text-xs leading-relaxed text-slate-900 dark:text-white whitespace-pre-wrap">
                            {content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center text-xs font-sans text-slate-400">
                    Bấm &quot;Thử lại&quot; ở trên để tạo các phương án tối ưu bằng AI.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-sans">
            <Sparkles className="h-3.5 w-3.5 text-teal-500" />
            <span>AI Studio tự động chuẩn hoá theo công thức Google X-Y-Z</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-sans font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isLoading || !options || !options[selectedStyle]}
              className="px-5 py-2 rounded-xl text-xs font-sans font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Áp dụng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
