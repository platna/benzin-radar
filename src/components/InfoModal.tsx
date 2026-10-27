import React from 'react';
import {
  X,
  Fuel,
  ShieldCheck,
  Clock,
  Zap,
  AlertTriangle,
  PauseCircle,
  ExternalLink,
  RefreshCw,
  MapPin,
  Sparkles
} from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-200 max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Pinned Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
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
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-4 space-y-4 text-xs leading-relaxed [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Section 1: Main Status Badges */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Статусы карточек АЗС
            </h3>

            {/* Badge 1: 95 Available */}
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>🟢 АИ-95 В НАЛИЧИИ</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Бензин есть! В строке указаны все доступные марки (92, 95, 95+, 100, ДТ). Если доступен улучшенный бензин, загорается золотой значок <b>✨ 95 Экто</b> или <b>✨ 95 G-Drive</b>.
              </p>
            </div>

            {/* Badge 2: 95 Queue */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>🟡 АИ-95 · ОЧЕРЕДЬ</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Бензин в наличии, но на заправке скопилась заметная очередь (от 15–30 минут и более). Закладывайте дополнительное время на заправку.
              </p>
            </div>

            {/* Badge 3: Only other fuels / No 95 */}
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
              <div className="font-bold text-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>🔴 НЕТ АИ-95</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                95-й бензин закончился или отпускается только дизель/92-й. Точный список оставшегося топлива всегда выводится в строке «В наличии».
              </p>
            </div>

            {/* Badge 4: Break / Fuel truck unloading */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>⏸ ПЕРЕРЫВ ДО 1 Ч / СЛИВ БЕНЗОВОЗА</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Водитель отметил слив бензовоза или технический перерыв. Отпуск топлива на колонках временно приостановлен.
              </p>
            </div>

            {/* Badge 5: Terminal auto-signal */}
            <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-200 space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>⚡ ТОЛЬКО ТЕРМИНАЛ / АВТОМАТ</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Автоматическая АЗС (оплата только в терминале на колонке) либо сигнал автооплаты без подробной детализации марок.
              </p>
            </div>

            {/* Badge 6: No fresh marks */}
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>⚪ ПОКА НЕТ ОТМЕТОК</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                За последние 12–24 часа отметок по этой станции не поступало. Статус ожидает подтверждения от первого очевидца.
              </p>
            </div>
          </div>

          {/* Section 2: Labels "по отметке" vs "сегодня" */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Плашки источника: «по отметке» и «сегодня»
            </h3>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-0.5">• «по отметке»:</span>
                <span className="text-slate-300">
                  Самые надежные данные: живой водитель только что лично выбрал эти марки пистолетов на АЗС (например, 20–40 минут назад).
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-sky-400 font-bold block mb-0.5">• «сегодня»:</span>
                <span className="text-slate-300">
                  Сводная информация сервера ГдеБЕНЗ за текущий день (объединяет несколько подтверждений за последние часы).
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: How Refresh works */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Как обновлять данные
            </h3>
            <p className="text-slate-300 leading-snug">
              Данные можно обновить двумя способами:
            </p>
            <ul className="space-y-1 text-slate-300 pl-2">
              <li>• Кнопкой <b>«Обновить»</b> в шапке приложения.</li>
              <li>• Жестом <b>«потянуть вниз» (Pull-to-refresh)</b> прямо на экране смартфона.</li>
            </ul>
            <p className="text-slate-400 leading-snug text-[11px] pt-1">
              Также при открытии свернутого приложения сервис автоматически связывается с сервером и подтверждает свежесть всплывающим уведомлением.
            </p>
          </div>

          {/* Section 4: Exact Time & Freshness */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-sky-400" />
              Время отметки: московское время и давность
            </h3>
            <p className="text-slate-300 leading-snug">
              В каждой карточке пишется точное московское время последней отметки очевидца:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>25 мин. назад (19:02)</span>
              </div>
              <div className="text-slate-400 text-[10px]">
                Время синхронизировано минута-в-минуту с базой краудсорсинга ГдеБЕНЗ.
              </div>
            </div>
          </div>

          {/* Section 5: Tracked Stations List (РЕАЛЬНЫЕ 28 АЗС) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Список отслеживаемых станций (строго 28 АЗС)
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Нагорная часть (17 АЗС):</span>
                <p className="text-slate-300 leading-relaxed">
                  <b>Лукойл / Teboil (9):</b> ул. Красная Слобода 10, ул. Родионова 163А, Казанское шоссе 6А, ул. Надежды Сусловой 21, ул. Ванеева 110В, ул. Ванеева 247, пр-кт Гагарина 23В, пр-кт Гагарина 31А, ул. Магистральная 6.
                </p>
                <p className="text-slate-300 leading-relaxed mt-1">
                  <b>Газпромнефть (8):</b> ул. Тимирязева 11а, ул. Юбилейная 3, ул. Академика Сахарова 8, ул. Магистральная 10б, ул. Школьная 70а, ул. Школьная 70б, ул. Ларина 32, ул. Ларина 2.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-sky-400 block mb-1">Ленинский район (11 АЗС):</span>
                <p className="text-slate-300 leading-relaxed">
                  <b>Лукойл / Teboil (6):</b> Комсомольское шоссе 2, Комсомольское шоссе 3В, Комсомольское шоссе 14, пр-кт Ленина 82Б, ул. Героя Попова 35А, ул. Голубева 3А.
                </p>
                <p className="text-slate-300 leading-relaxed mt-1">
                  <b>Газпромнефть (5):</b> Комсомольская площадь 3А, пр-кт Ленина 92а, ул. Новикова-Прибоя 25, ул. Героя Попова 38, ул. Героя Попова 58В.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Source & Navigation */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              Источники данных и навигация
            </h3>
            <p className="text-slate-400 leading-snug">
              Данные синхронизируются в реальном времени с платформой ГдеБЕНЗ. Красная кнопка сразу строит автомобильный маршрут с пробками в Яндекс Картах, а кнопки 2ГИС и ГдеБЕНЗ открывают карточки в соответствующих сервисах.
            </p>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Бензин Радар НН · Все 28 АЗС</span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-xs shadow-md shadow-emerald-950/60 transition-all text-center"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};