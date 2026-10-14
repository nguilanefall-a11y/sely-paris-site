import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown, Check } from 'lucide-react';
import styles from './LuxuryDateTimePicker.module.css';

const PICKER_TEXTS = {
  fr: {
    notice: 'Chauffeur en place 15 min avant',
    close: 'Fermer',
    edit: 'Modifier',
    dateLabel: 'Date de prise en charge',
    today: 'Auj.',
    tomorrow: 'Demain',
    weekend: 'Week-end',
    timeLabel: 'Heure de prise en charge',
    hour: 'HEURE',
    min: 'MIN',
    confirm: 'Valider la date et l’heure'
  },
  en: {
    notice: 'Chauffeur on site 15 min early',
    close: 'Close',
    edit: 'Edit',
    dateLabel: 'Pick-up date',
    today: 'Today',
    tomorrow: 'Tomorrow',
    weekend: 'Weekend',
    timeLabel: 'Pick-up time',
    hour: 'HOUR',
    min: 'MIN',
    confirm: 'Confirm date & time'
  },
  es: {
    notice: 'Chófer en el lugar 15 min antes',
    close: 'Cerrar',
    edit: 'Modificar',
    dateLabel: 'Fecha de recogida',
    today: 'Hoy',
    tomorrow: 'Mañana',
    weekend: 'Fin de semana',
    timeLabel: 'Hora de recogida',
    hour: 'HORA',
    min: 'MIN',
    confirm: 'Confirmar fecha y hora'
  },
  ar: {
    notice: 'السائق في الموقع قبل 15 دقيقة',
    close: 'إغلاق',
    edit: 'تعديل',
    dateLabel: 'تاريخ الاستلام',
    today: 'اليوم',
    tomorrow: 'غداً',
    weekend: 'عطلة نهاية الأسبوع',
    timeLabel: 'وقت الاستلام',
    hour: 'الساعة',
    min: 'الدقيقة',
    confirm: 'تأكيد التاريخ والوقت'
  },
  zh: {
    notice: '司机提前15分钟到位',
    close: '关闭',
    edit: '修改',
    dateLabel: '接送日期',
    today: '今天',
    tomorrow: '明天',
    weekend: '周末',
    timeLabel: '接送时间',
    hour: '小时',
    min: '分钟',
    confirm: '确认日期与时间'
  },
  de: {
    notice: 'Chauffeur 15 Min. vor Ort',
    close: 'Schließen',
    edit: 'Bearbeiten',
    dateLabel: 'Abholdatum',
    today: 'Heute',
    tomorrow: 'Morgen',
    weekend: 'Wochenende',
    timeLabel: 'Abholzeit',
    hour: 'STUNDE',
    min: 'MIN',
    confirm: 'Datum & Uhrzeit bestätigen'
  },
  it: {
    notice: 'Autista sul posto 15 min prima',
    close: 'Chiudi',
    edit: 'Modifica',
    dateLabel: 'Data di ritiro',
    today: 'Oggi',
    tomorrow: 'Domani',
    weekend: 'Fine settimana',
    timeLabel: 'Ora di ritiro',
    hour: 'ORA',
    min: 'MIN',
    confirm: 'Conferma data e ora'
  },
  pt: {
    notice: 'Motorista no local 15 min antes',
    close: 'Fechar',
    edit: 'Modificar',
    dateLabel: 'Data de recolha',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    weekend: 'Fim de semana',
    timeLabel: 'Hora de partida',
    hour: 'HORA',
    min: 'MIN',
    confirm: 'Confirmar data e hora'
  },
  ru: {
    notice: 'Водитель на месте за 15 мин',
    close: 'Закрыть',
    edit: 'Изменить',
    dateLabel: 'Дата подачи',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    weekend: 'Выходные',
    timeLabel: 'Время подачи',
    hour: 'ЧАСЫ',
    min: 'МИН',
    confirm: 'Подтвердить дату и время'
  },
  ja: {
    notice: '15分前にお迎えに伺います',
    close: '閉じる',
    edit: '変更',
    dateLabel: 'お迎え日',
    today: '今日',
    tomorrow: '明日',
    weekend: '週末',
    timeLabel: 'お迎え時間',
    hour: '時',
    min: '分',
    confirm: '日時を確定する'
  }
};

// Only show practical hours: 06–23 + 00
const HOURS = [
  '06','07','08','09','10','11',
  '12','13','14','15','16','17',
  '18','19','20','21','22','23','00',
];

const MINUTES = ['00', '15', '30', '45'];

export default function LuxuryDateTimePicker({
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  isEn,
  minDateISO,
}) {
  const { i18n } = useTranslation();
  const currentLang = (i18n?.language || (isEn ? 'en' : 'fr')).split('-')[0];
  const pTexts = PICKER_TEXTS[currentLang] || PICKER_TEXTS.fr;
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const todayISO = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  const selectedDateObj = useMemo(() => {
    if (!selectedDate) return new Date();
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDate]);

  const [viewYear, setViewYear] = useState(() => selectedDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDateObj.getMonth());

  useEffect(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [selectedDate]);

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startDow = (firstDay.getDay() + 6) % 7;
    const days = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  // Quick date helpers
  const setQuickDate = (offset) => {
    const t = new Date(today);
    t.setDate(t.getDate() + offset);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${d}`);
    setViewYear(y);
    setViewMonth(t.getMonth());
  };

  const setWeekend = () => {
    const t = new Date(today);
    const day = t.getDay();
    const diffToSat = (6 - day + 7) % 7 || 7;
    t.setDate(t.getDate() + diffToSat);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${d}`);
    setViewYear(y);
    setViewMonth(t.getMonth());
  };

  // Parse time
  const [currentHour, currentMinute] = useMemo(() => {
    if (!selectedTime || !selectedTime.includes(':')) return ['08', '00'];
    const [h, m] = selectedTime.split(':');
    return [h.padStart(2, '0'), m.padStart(2, '0')];
  }, [selectedTime]);

  // Formatted date for recap
  const formattedDate = useMemo(() => {
    if (!selectedDate) return '—';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const obj = new Date(y, m - 1, d);
      return obj.toLocaleDateString(currentLang, {
        weekday: 'long', day: 'numeric', month: 'long',
      });
    } catch { return selectedDate; }
  }, [selectedDate, currentLang]);

  const monthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2026, i, 15);
      const name = d.toLocaleDateString(currentLang, { month: 'long' });
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
  }, [currentLang]);

  const weekdays = useMemo(() => {
    // 2026-01-05 is a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2026, 0, 5 + i);
      const letter = d.toLocaleDateString(currentLang, { weekday: 'narrow' });
      return letter.toUpperCase();
    });
  }, [currentLang]);

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* ── Compact Mobile Trigger (Suggestion 15) ── */}
      <button
        type="button"
        onClick={() => setMobileOpen(prev => !prev)}
        className={styles.compactMobileTrigger}
        aria-expanded={mobileOpen}
      >
        <div className={styles.compactLeft}>
          <div className={styles.compactCalendarIcon}>
            <Calendar size={18} />
          </div>
          <div className={styles.compactTextGroup}>
            <span className={styles.compactMainText}>
              {formattedDate} · {selectedTime}
            </span>
            <span className={styles.compactSubText}>
              {pTexts.notice}
            </span>
          </div>
        </div>
        <div className={styles.compactAction}>
          <span className={styles.compactActionLabel}>
            {mobileOpen ? pTexts.close : pTexts.edit}
          </span>
          <ChevronDown size={16} className={`${styles.compactChevron} ${mobileOpen ? styles.chevronRotated : ''}`} />
        </div>
      </button>

      {/* ── Desktop Recap ── */}
      <div className={styles.recapBar}>
        <span className={styles.recapDate}>{formattedDate}</span>
        <span className={styles.recapSep}>·</span>
        <span className={styles.recapTime}>{selectedTime}</span>
        <span className={styles.recapNote}>
          — {pTexts.notice}
        </span>
      </div>

      {/* ── Two Columns (expandable on mobile) ── */}
      <div className={`${styles.grid} ${mobileOpen ? styles.gridOpen : ''}`}>

        {/* ─── DATE ─── */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            {pTexts.dateLabel}
          </div>

          {/* Quick presets */}
          <div className={styles.quickRow}>
            <button type="button" onClick={() => setQuickDate(0)}
              className={`${styles.quickBtn} ${selectedDate === todayISO ? styles.quickBtnActive : ''}`}>
              {pTexts.today}
            </button>
            <button type="button" onClick={() => setQuickDate(1)} className={styles.quickBtn}>
              {pTexts.tomorrow}
            </button>
            <button type="button" onClick={setWeekend} className={styles.quickBtn}>
              {pTexts.weekend}
            </button>
          </div>

          {/* Month nav */}
          <div className={styles.monthNav}>
            <button type="button" onClick={handlePrevMonth} disabled={isCurrentMonth} className={styles.monthNavBtn}>
              <ChevronLeft size={14} />
            </button>
            <span className={styles.monthTitle}>{monthNames[viewMonth]} {viewYear}</span>
            <button type="button" onClick={handleNextMonth} className={styles.monthNavBtn}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className={styles.weekRow}>
            {weekdays.map((w, i) => <span key={i} className={styles.weekCell}>{w}</span>)}
          </div>

          {/* Days */}
          <div className={styles.daysGrid}>
            {calendarDays.map((d, idx) => {
              if (d === null) return <div key={`e-${idx}`} />;
              const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const isPast = iso < todayISO;
              const isSelected = iso === selectedDate;
              const isToday = iso === todayISO;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isPast}
                  onClick={() => onDateChange(iso)}
                  className={[
                    styles.dayBtn,
                    isSelected ? styles.daySelected : '',
                    isToday && !isSelected ? styles.dayToday : '',
                    isPast ? styles.dayPast : '',
                  ].join(' ')}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TIME ─── */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            {pTexts.timeLabel}
          </div>

          {/* Large clock display */}
          <div className={styles.clockDisplay}>
            <span className={styles.clockHH}>{currentHour}</span>
            <span className={styles.clockColon}>:</span>
            <span className={styles.clockMM}>{currentMinute}</span>
          </div>

          {/* Hour grid */}
          <div className={styles.sectionLabel}>{pTexts.hour}</div>
          <div className={styles.hoursGrid}>
            {HOURS.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => onTimeChange(`${h}:${currentMinute}`)}
                className={`${styles.hChip} ${currentHour === h ? styles.hChipActive : ''}`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Minute row */}
          <div className={styles.sectionLabel}>{pTexts.min}</div>
          <div className={styles.minutesRow}>
            {MINUTES.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => onTimeChange(`${currentHour}:${m}`)}
                className={`${styles.mChip} ${currentMinute === m ? styles.mChipActive : ''}`}
              >
                :{m}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile close/validate action */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className={styles.closeMobilePickerBtn}
        >
          <Check size={16} />
          <span>{pTexts.confirm}</span>
        </button>
      </div>
    </div>
  );
}
