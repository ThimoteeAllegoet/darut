import { RecurrenceConfig, DayOfWeek, WeekOfMonth } from '../types/recurrence';

/**
 * Génère toutes les dates récurrentes basées sur une configuration
 * @param startDate Date de début au format YYYY-MM-DD
 * @param config Configuration de récurrence
 * @param maxMonths Nombre maximum de mois à générer (optionnel, pas de limite par défaut)
 * @returns Array de dates au format YYYY-MM-DD
 */
export function generateRecurrentDates(
  startDate: string,
  config: RecurrenceConfig,
  maxMonths?: number
): string[] {
  if (config.type === 'none') {
    return [startDate];
  }

  const dates: string[] = [];
  const start = new Date(startDate + 'T12:00:00'); // Midi pour éviter problèmes timezone

  // Si pas de date de fin spécifiée, erreur - l'utilisateur DOIT fournir une date de fin
  if (!config.endDate) {
    throw new Error('Une date de fin est requise pour les récurrences');
  }

  const finalDate = new Date(config.endDate + 'T12:00:00');

  switch (config.type) {
    case 'daily':
      generateDailyDates(start, finalDate, dates);
      break;

    case 'weekly':
      if (config.daysOfWeek && config.daysOfWeek.length > 0) {
        generateWeeklyDates(start, finalDate, config.daysOfWeek, 1, dates);
      }
      break;

    case 'biweekly':
      if (config.daysOfWeek && config.daysOfWeek.length > 0) {
        generateWeeklyDates(start, finalDate, config.daysOfWeek, 2, dates);
      }
      break;

    case 'monthly_day':
      if (config.dayOfMonth) {
        generateMonthlyDayDates(start, finalDate, config.dayOfMonth, dates);
      }
      break;

    case 'monthly_weekday':
      if (config.weekOfMonth !== undefined && config.dayOfWeek !== undefined) {
        generateMonthlyWeekdayDates(start, finalDate, config.weekOfMonth, config.dayOfWeek, dates);
      }
      break;
  }

  return dates;
}

function generateDailyDates(start: Date, end: Date, dates: string[]): void {
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
}

function generateWeeklyDates(
  start: Date,
  end: Date,
  daysOfWeek: DayOfWeek[],
  weekInterval: number,
  dates: string[]
): void {
  const current = new Date(start);

  // Trouver le premier jour correspondant
  while (!daysOfWeek.includes(current.getDay() as DayOfWeek) && current <= end) {
    current.setDate(current.getDate() + 1);
  }

  let weekCount = 0;
  while (current <= end) {
    if (weekCount % weekInterval === 0 && daysOfWeek.includes(current.getDay() as DayOfWeek)) {
      dates.push(formatDate(current));
    }

    const nextDay = current.getDay() + 1;
    if (nextDay > 6) {
      weekCount++;
    }
    current.setDate(current.getDate() + 1);
  }
}

function generateMonthlyDayDates(start: Date, end: Date, dayOfMonth: number, dates: string[]): void {
  const current = new Date(start);

  // Ajuster au bon jour du mois
  current.setDate(dayOfMonth);
  if (current < start) {
    current.setMonth(current.getMonth() + 1);
  }

  while (current <= end) {
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    if (dayOfMonth <= daysInMonth) {
      dates.push(formatDate(current));
    }
    current.setMonth(current.getMonth() + 1);
  }
}

function generateMonthlyWeekdayDates(
  start: Date,
  end: Date,
  weekOfMonth: WeekOfMonth,
  dayOfWeek: DayOfWeek,
  dates: string[]
): void {
  const current = new Date(start);
  current.setDate(1); // Premier jour du mois

  if (current < start) {
    current.setMonth(current.getMonth() + 1);
  }

  while (current <= end) {
    const targetDate = getNthWeekdayOfMonth(current.getFullYear(), current.getMonth(), weekOfMonth, dayOfWeek);
    if (targetDate && targetDate >= start && targetDate <= end) {
      dates.push(formatDate(targetDate));
    }
    current.setMonth(current.getMonth() + 1);
  }
}

function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekOfMonth: WeekOfMonth,
  dayOfWeek: DayOfWeek
): Date | null {
  const firstDay = new Date(year, month, 1);
  let count = 0;
  const current = new Date(firstDay);

  while (current.getMonth() === month) {
    if (current.getDay() === dayOfWeek) {
      count++;
      if (count === weekOfMonth) {
        return new Date(current);
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return null; // N'existe pas dans ce mois (ex: 5ème lundi)
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Génère un nom lisible pour une configuration de récurrence
 */
export function getRecurrenceLabel(config: RecurrenceConfig): string {
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const weekNames = ['Premier', 'Deuxième', 'Troisième', 'Quatrième', 'Cinquième'];

  switch (config.type) {
    case 'none':
      return 'Aucune';

    case 'daily':
      return 'Tous les jours';

    case 'weekly':
      if (config.daysOfWeek && config.daysOfWeek.length > 0) {
        const days = config.daysOfWeek.map(d => dayNames[d]).join(', ');
        return `Tous les ${days}`;
      }
      return 'Hebdomadaire';

    case 'biweekly':
      if (config.daysOfWeek && config.daysOfWeek.length > 0) {
        const days = config.daysOfWeek.map(d => dayNames[d]).join(', ');
        return `Toutes les 2 semaines: ${days}`;
      }
      return 'Bimensuel';

    case 'monthly_day':
      if (config.dayOfMonth) {
        return `Tous les ${config.dayOfMonth} du mois`;
      }
      return 'Mensuel (jour fixe)';

    case 'monthly_weekday':
      if (config.weekOfMonth !== undefined && config.dayOfWeek !== undefined) {
        const week = weekNames[config.weekOfMonth - 1];
        const day = dayNames[config.dayOfWeek];
        return `${week} ${day} du mois`;
      }
      return 'Mensuel (jour de semaine)';

    default:
      return 'Personnalisé';
  }
}
