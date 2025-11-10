'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/format';
import styles from './Calendar.module.css';

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const monthNamesShort = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export function Calendar({ months = [], onMonthClick }) {
  const [currentYear, setCurrentYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  // Organizar meses por ano
  const monthsByYear = useMemo(() => {
    const organized = {};
    months.forEach(month => {
      // Extrair ano do id (formato: "2026-01") ou do label
      let year;
      if (month.id && month.id.includes('-')) {
        year = parseInt(month.id.split('-')[0]);
      } else if (month.label) {
        const yearMatch = month.label.match(/\d{4}/);
        year = yearMatch ? parseInt(yearMatch[0]) : currentYear;
      } else {
        year = currentYear;
      }

      if (!organized[year]) {
        organized[year] = {};
      }

      // Extrair mês do id ou label
      let monthNum;
      if (month.id && month.id.includes('-')) {
        monthNum = parseInt(month.id.split('-')[1]);
      } else if (month.label) {
        const monthName = month.label.toLowerCase().split('/')[0].trim();
        monthNum = monthNames.findIndex(m => m.toLowerCase().startsWith(monthName)) + 1;
        if (monthNum === 0) {
          monthNum = monthNamesShort.findIndex(m => m.toLowerCase().startsWith(monthName)) + 1;
        }
      }

      if (monthNum && monthNum >= 1 && monthNum <= 12) {
        organized[year][monthNum] = month;
      }
    });
    return organized;
  }, [months, currentYear]);

  // Obter anos disponíveis
  const availableYears = useMemo(() => {
    const years = Object.keys(monthsByYear).map(Number).sort((a, b) => a - b);
    if (years.length === 0) {
      return [currentYear];
    }
    return years;
  }, [monthsByYear, currentYear]);

  // Garantir que o ano atual está na lista
  const displayYear = availableYears.includes(currentYear) ? currentYear : availableYears[0] || currentYear;

  // Obter meses do ano atual
  const currentYearMonths = monthsByYear[displayYear] || {};

  const handlePrevYear = () => {
    const currentIndex = availableYears.indexOf(displayYear);
    if (currentIndex > 0) {
      setCurrentYear(availableYears[currentIndex - 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(displayYear);
    if (currentIndex < availableYears.length - 1) {
      setCurrentYear(availableYears[currentIndex + 1]);
    }
  };

  const handleMonthClick = (month) => {
    if (month && onMonthClick) {
      onMonthClick(month);
    }
  };

  // Criar grid de 12 meses
  const monthGrid = [];
  for (let i = 1; i <= 12; i++) {
    const month = currentYearMonths[i];
    const hasValue = month && month.total > 0;
    
    // Criar objeto de mês se não existir (para permitir criar novos meses)
    const monthData = month || {
      id: `${displayYear}-${String(i).padStart(2, '0')}`,
      label: `${monthNames[i - 1].toLowerCase()}/${displayYear}`,
      total: 0,
    };
    
    monthGrid.push(
      <div
        key={i}
        className={`${styles.monthCell} ${hasValue ? styles.hasValue : ''} ${!month ? styles.empty : ''}`}
        onClick={() => handleMonthClick(monthData)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMonthClick(monthData);
          }
        }}
      >
        <div className={styles.monthHeader}>
          <span className={styles.monthName}>{monthNamesShort[i - 1]}</span>
        </div>
        <div className={styles.monthContent}>
          {month ? (
            <>
              <span className={styles.monthValue}>
                {formatCurrency(month.total || 0)}
              </span>
              {hasValue && <span className={styles.monthIndicator}>●</span>}
            </>
          ) : (
            <span className={styles.monthEmpty}>—</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button
          className={styles.navButton}
          onClick={handlePrevYear}
          disabled={availableYears.indexOf(displayYear) === 0}
          aria-label="Ano anterior"
        >
          ←
        </button>
        <h2 className={styles.yearTitle}>{displayYear}</h2>
        <button
          className={styles.navButton}
          onClick={handleNextYear}
          disabled={availableYears.indexOf(displayYear) === availableYears.length - 1}
          aria-label="Próximo ano"
        >
          →
        </button>
      </div>

      <div className={styles.monthsGrid}>
        {monthGrid}
      </div>

      {availableYears.length > 1 && (
        <div className={styles.yearSelector}>
          {availableYears.map(year => (
            <button
              key={year}
              className={`${styles.yearButton} ${year === displayYear ? styles.active : ''}`}
              onClick={() => setCurrentYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

