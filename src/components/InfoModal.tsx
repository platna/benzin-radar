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
  ExternalLink,
  RefreshCw,
  MapPin
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

        {/* Scrollable Body with custom sleek scrollbar */}
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
                Подтверждено последней отметкой водителя на месте. В карточке перечислены все доступные виды топлива (92, 95, 95+, 100, ДТ) и наличие лимита (напр. «Лимит 30 л» или «Без ограничений»).
              </p>
            </div>

            {/* Badge 2: 95 Queue */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>🟡 АИ-95 · ОЧЕРЕДЬ (15–30 мин)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Бензин в наличии, но на заправке скопилась очередь от 5 до 15+ машин. Рекомендуется закладывать дополнительное время.
              </p>
            </div>

            {/* Badge 3: Only other fuels / No 95 */}
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-1">
              <div className="font-bold text-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>🔴 НЕТ АИ-95 (или топлива нет)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Бензин АИ-95 закончился. Если на АЗС остались другие виды топлива (например, АИ-92 или ДТ), это четко указано в строке «В наличии: 92, ДТ».
              </p>
            </div>

            {/* Badge 4: Break / Fuel truck unloading */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>⏸ ПЕРЕРЫВ ДО 1 Ч / СЛИВ БЕНЗОВОЗА</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                На АЗС прибыл бензовоз для пополнения резервуаров или идет технический перерыв/пересменка. Отпуск топлива временно приостановлен.
              </p>
            </div>

            {/* Badge 5: Terminal auto-signal */}
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>⚡ ТОЛЬКО ТЕРМИНАЛ / АВТОМАТ</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Автоматическая АЗС (оплата только в терминале на колонке) либо зафиксирован автоматический сигнал работы терминала без детализации марок топлива.
              </p>
            </div>

            {/* Badge 6: No fresh marks */}
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-200 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>⚪ ПОКА НЕТ СВЕЖИХ ОТМЕТОК</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                За последние 12 часов отметок водителей по этой заправке не поступало, поэтому статус помечен как требующий подтверждения.
              </p>
            </div>
          </div>

          {/* Section 2: How Refresh works */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Как работает обновление данных
            </h3>
            <p className="text-slate-300 leading-snug">
              При нажатии кнопки <b>«Обновить»</b> сервис запрашивает свежие данные напрямую по <b>обоим районам сразу</b> (17 АЗС Нагорной части + 11 АЗС Ленинского района) в обход кэша.
            </p>
            <p className="text-slate-400 leading-snug text-[11px]">
              Также каждые 5 минут приложение автоматически сверяет данные в фоне и показывает всплывающее уведомление со временем сверки.
            </p>
          </div>

          {/* Section 3: Exact Time & Freshness */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-sky-400" />
              Время отметки: московское время и давность
            </h3>
            <p className="text-slate-300 leading-snug">
              В строке каждой отметки пишется давность и точное время по Москве (МСК), например:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-200 font-semibold">
                👤 Водитель: 36 мин. назад (10:07)
              </div>
              <div className="text-slate-400 text-[10px]">
                Время берется непосредственно из последней зарегистрированной отметки очевидца на сервере ГдеБЕНЗ.
              </div>
            </div>
          </div>

          {/* Section 4: Confidence rating % */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Что означает процент уверенности (напр. 90%, 50%, 15%)
            </h3>
            <p className="text-slate-300 leading-snug">
              Это математический расчет вероятности актуальности данных:
            </p>
            <ul className="space-y-1 text-slate-300 pl-2">
              <li>• <b>90%–95%</b>: свежая отметка (до 1–2 часов), подтвержденная несколькими водителями.</li>
              <li>• <b>50%–70%</b>: отметка была сделана 3–6 часов назад, ситуация могла частично измениться.</li>
              <li>• <b>Ниже 30%</b>: отметка старше 8–12 часов, статус требует проверки на месте.</li>
            </ul>
          </div>

          {/* Section 5: Tracked Stations List */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Список отслеживаемых станций (28 АЗС)
            </h3>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">Нагорная часть (17 АЗС):</span>
                <span className="text-slate-300">
                  Лукойл (Родионова, Гагарина, Ванеева, Казанское ш., Ларина, Бекетова, Тимирязева, Бринского), Teboil (Родионова, Казанское ш., Ковалихинская, Сахарова, Ларина) и Газпромнефть (Казанское ш., Деловая, Ларина).
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-sky-400 block mb-0.5">Ленинский район (11 АЗС):</span>
                <span className="text-slate-300">
                  Лукойл (пр. Ленина 82Б, 11Б, 17, 43б; Комсомольское ш. 7А; Новикова-Прибоя 33; ул. Г. Попова 42; Баумана 78; Голубева 3А; Школьная 70А/Б).
                </span>
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
              Данные синхронизируются с краудсорсинговой платформой ГдеБЕНЗ. Кнопка «Маршрут на авто» в карточке строит прямой маршрут в Яндекс Картах с учетом пробок, а кнопки 2ГИС и ГдеБЕНЗ открывают карточку станции в соответствующих сервисах.
            </p>
          </div>
        </div>

        {/* Pinned Footer with prominent "Понятно" button */}
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
