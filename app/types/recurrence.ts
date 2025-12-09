export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly_day' // Tous les X du mois (ex: tous les 11)
  | 'monthly_weekday'; // Premier/deuxième/etc lundi/mardi/etc du mois

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Dimanche, 1 = Lundi, etc.

export type WeekOfMonth = 1 | 2 | 3 | 4 | 5; // Premier, deuxième, etc.

export interface RecurrenceConfig {
  type: RecurrenceType;
  // Pour weekly et biweekly
  daysOfWeek?: DayOfWeek[];
  // Pour monthly_day
  dayOfMonth?: number; // 1-31
  // Pour monthly_weekday
  weekOfMonth?: WeekOfMonth;
  dayOfWeek?: DayOfWeek;
  // Date de fin de la récurrence (optionnel)
  endDate?: string; // YYYY-MM-DD
}
