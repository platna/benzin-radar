import React from 'react';
import { X, Fuel, ShieldCheck, MapPin, Send, ExternalLink, HelpCircle } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl text-slate-200 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">О «Бензин Радар НН»</h2>
              <p className="text-xs text-slate-400">Мониторинг АИ-95 в Нижнем Новгороде</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Точный список ключевых АЗС
            </h3>
            <p className="text-slate-400">
              Приложение отслеживает сертифицированные заправки стандартов Евро-5 (К5) двух зон:
            </p>
            <ul className="mt-2 space-y-1 text-slate-300">
              <li>• <b>Нагорная часть (17 АЗС)</b>: Лукойл, Teboil и Газпромнефть на ключевых магистралях (Родионова, Гагарина, Ванеева, Казанское ш., Ларина и др.).</li>
              <li>• <b>Ленинский район (11 АЗС)</b>: пр. Ленина, Комсомольское ш., Новикова-Прибоя, ул. Попова, Баумана и др.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              Цветовая индикация очередей
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center mt-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <div className="text-sm font-bold">🟢 До 15 мин</div>
                <div className="text-[10px] text-slate-400">Свободно</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <div className="text-sm font-bold">🟡 15–30 мин</div>
                <div className="text-[10px] text-slate-400">Очередь</div>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <div className="text-sm font-bold">🔴 1–2 часа</div>
                <div className="text-[10px] text-slate-400">Большая очередь</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              Источники данных и навигация
            </h3>
            <p className="text-slate-400 mb-2">
              Данные синхронизируются с краудсорсинговой сетью ГдеБЕНЗ, а кнопки в карточке позволяют в 1 клик проложить маршрут с учетом актуальных пробок в Яндекс Картах или 2ГИС.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://gdebenz.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline font-semibold"
              >
                Официальный сайт ГдеБЕНЗ →
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
