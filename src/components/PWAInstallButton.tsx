import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Android / Chromium / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/40 active:scale-95 transition-all shadow-sm"
        title="Установить приложение на телефон"
      >
        <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="text-[11px] sm:text-xs">Установить</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-sky-300 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/30 active:scale-95 transition-all"
          title="Инструкция по установке на iPhone / iPad"
        >
          <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="hidden sm:inline">На экран</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-sky-400" />
                  Установка на iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-white font-bold text-[10px]">1</span>
                  <span>Нажмите кнопку <b>«Поделиться»</b> <Share2 className="w-3.5 h-3.5 inline text-sky-400 mx-0.5" /> в нижней панели Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-white font-bold text-[10px]">2</span>
                  <span>Прокрутите список вниз и выберите <b>«На экран „Домой“»</b> <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-0.5" />.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-white font-bold text-[10px]">3</span>
                  <span>Нажмите <b>«Добавить»</b> в правом верхнем углу.</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
