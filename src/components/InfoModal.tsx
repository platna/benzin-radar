import React from 'react';
import {
  X,
  Fuel,
  ShieldCheck,
  HelpCircle,
  Clock,
  Zap,
  AlertTriangle,
  PauseCircle,
  ExternalLink
} from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Инструкция и справка</h2>
              <p className="text-[11px] text-slate-400">Как читать статусы и метки «Бензин Радар НН»</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          {/* Section 1: Notifications & Fuel Badges (Photos 3-4) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Что означают сообщения на карточках АЗС
            </h3>

            {/* Sub-item: Only other fuels (Photo 3) */}
            <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200 space-y-1">
              <div className="font-bold text-sky-300 flex items-center gap-1">
                <span>ℹ️ По отметкам водителей — в наличии только 92 (или ДТ)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Реальный водитель на месте подтвердил, что <b>АИ-95 закончился</b>, но на колонках есть другие виды топлива (например, только АИ-92 или только дизель).
              </p>
            </div>

            {/* Sub-item: Terminal auto-signal (Photo 4) */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Только автосигнал оплаты терминала</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                На автоматической АЗС или через платежный терминал прошла оплата — заправка работала. Но живые водители не отправляли подтверждение именно по АИ-95, поэтому гарантии наличия нет.
              </p>
            </div>

            {/* Sub-item: Break / Fuel truck unloading (Photo 5) */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <PauseCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>⏸ Перерыв до 1 ч / Слив бензовоза</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                На АЗС прибыл бензовоз для пополнения резервуаров или объявлен технический перерыв. В это время отпуск топлива временно приостановлен.
              </p>
            </div>

            {/* Sub-item: No fresh marks yet */}
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <span>⚪ Пока нет отметок / Данные устарели</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                За последние 8–12 часов свежих отметок водителей по этой заправке не поступало, поэтому наличие АИ-95 неизвестно, пока кто-то не оставит отметку в ГдеБЕНЗ.
              </p>
            </div>
          </div>

          {/* Section 2: Confidence rating % (Photo 5) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Что означает процент уверенности (напр. 90%, 35%, 15%)
            </h3>
            <p className="text-slate-300 leading-snug">
              Это математическая вероятность наличия топлива по алгоритму ГдеБЕНЗ с учетом двух факторов:
            </p>
            <ul className="space-y-1 text-slate-300 pl-2">
              <li>• <b>Количество подтверждений</b>: чем больше независимых водителей отметили заправку, тем выше базовый рейтинг (до 90%).</li>
              <li>• <b>Время отметки</b>: свежая отметка держит высокий рейтинг. Со временем (через 8–24 часа) рейтинг снижается, отражая вероятность изменения ситуации.</li>
            </ul>
          </div>

          {/* Section 3: Exact Time & Freshness (Request 1) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-emerald-400" />
              Время отметки: московское время и давность
            </h3>
            <p className="text-slate-300 leading-snug">
              В правом углу каждой карточки выводится точное время по Москве (МСК) и сколько времени назад зафиксировано событие:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] mt-1">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-200 font-semibold block">Водитель: 16:46 (12 мин. назад)</span>
                <span className="text-slate-400 text-[10px]">Личная отметка водителя через приложение</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-teal-300 font-semibold block">⚡ Заправка работала: 15:30 (1 ч. назад)</span>
                <span className="text-slate-400 text-[10px]">Автоматический сигнал терминала оплаты</span>
              </div>
            </div>
          </div>

          {/* Section 4: Traffic lights */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Цветовая индикация очередей
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center mt-1">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <div className="text-xs sm:text-sm font-bold">🟢 До 15 мин</div>
                <div className="text-[10px] text-slate-400">Свободно</div>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <div className="text-xs sm:text-sm font-bold">🟡 15–30 мин</div>
                <div className="text-[10px] text-slate-400">Очередь</div>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <div className="text-xs sm:text-sm font-bold">🔴 1–2 часа</div>
                <div className="text-[10px] text-slate-400">Большая очередь</div>
              </div>
            </div>
          </div>

          {/* Section 5: Tracked Stations List */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Точный список ключевых АЗС (28 станций)
            </h3>
            <p className="text-slate-400 leading-snug">
              Приложение непрерывно отслеживает сертифицированные заправки стандартов Евро-5 (К5) двух зон:
            </p>
            <ul className="mt-1.5 space-y-1 text-slate-300 pl-1">
              <li>• <b>Нагорная часть (17 АЗС)</b>: Лукойл, Teboil и Газпромнефть на ключевых магистралях (Родионова, Гагарина, Ванеева, Казанское ш., Ларина, Сахарова, Тимирязева и др.).</li>
              <li>• <b>Ленинский район (11 АЗС)</b>: пр. Ленина, Комсомольское ш., Новикова-Прибоя, ул. Героя Попова, Баумана, Голубева и др.</li>
            </ul>
          </div>

          {/* Section 6: Data source & 1-click navigation */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              Источники данных и навигация
            </h3>
            <p className="text-slate-400 leading-snug">
              Данные синхронизируются в реальном времени с краудсорсинговой сетью ГдеБЕНЗ. Красная кнопка «Маршрут на авто» в карточке сразу строит маршрут с учетом живых пробок в Яндекс Картах, а кнопки 2ГИС и ГдеБЕНЗ открывают карточки в профильных сервисах.
            </p>
            <div className="pt-1">
              <a
                href="https://gdebenz.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Официальный сайт ГдеБЕНЗ →
              </a>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-950/60 active:scale-[0.99] transition-all"
        >
          Понятно
        </button>
      </div>
    </div>
  );
};
