import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './LuxuryDateTimePicker.module.css';

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEKDAYS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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
  isEn = false,
  minDateISO,
}) {
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
      return obj.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
    } catch { return selectedDate; }
  }, [selectedDate, isEn]);

  const monthNames = isEn ? MONTH_NAMES_EN : MONTH_NAMES_FR;
  const weekdays = isEn ? WEEKDAYS_EN : WEEKDAYS_FR;

  return (
    <div className={styles.container}>
      {/* ── Compact Recap ── */}
      <div className={styles.recapBar}>
        <span className={styles.recapDate}>{formattedDate}</span>
        <span className={styles.recapSep}>·</span>
        <span className={styles.recapTime}>{selectedTime}</span>
        <span className={styles.recapNote}>
          {isEn ? '— chauffeur on site 15 min early' : '— chauffeur en place 15 min avant'}
        </span>
      </div>

      {/* ── Two Columns ── */}
      <div className={styles.grid}>

        {/* ─── DATE ─── */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>
            {isEn ? 'Date' : 'Date de prise en charge'}
          </div>

          {/* Quick presets */}
          <div className={styles.quickRow}>
            <button type="button" onClick={() => setQuickDate(0)}
              className={`${styles.quickBtn} ${selectedDate === todayISO ? styles.quickBtnActive : ''}`}>
              {isEn ? 'Today' : "Auj."}
            </button>
            <button type="button" onClick={() => setQuickDate(1)} className={styles.quickBtn}>
              {isEn ? 'Tomorrow' : 'Demain'}
            </button>
            <button type="button" onClick={setWeekend} className={styles.quickBtn}>
              Week-end
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
            {isEn ? 'Pick-up time' : 'Heure de prise en charge'}
          </div>

          {/* Large clock display */}
          <div className={styles.clockDisplay}>
            <span className={styles.clockHH}>{currentHour}</span>
            <span className={styles.clockColon}>:</span>
            <span className={styles.clockMM}>{currentMinute}</span>
          </div>

          {/* Hour grid */}
          <div className={styles.sectionLabel}>{isEn ? 'HOUR' : 'HEURE'}</div>
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
          <div className={styles.sectionLabel}>{isEn ? 'MIN' : 'MIN'}</div>
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

      </div>
    </div>
  );
}
