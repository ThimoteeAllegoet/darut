export type LeaveType =
  | 'Télétravail'
  | 'Congés'
  | 'Formation'
  | 'Déplacement'
  | 'Absence'
  | 'Temps partiel';

export type PeriodType = 'matin' | 'après-midi' | 'journée';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'deletion_pending';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  isValidator: boolean;
}

import { RecurrenceConfig } from './recurrence';

export interface LeaveRequest {
  id: string;
  memberId: string;
  memberName: string;
  type: LeaveType;
  date: string; // YYYY-MM-DD format
  period: PeriodType;
  status: LeaveStatus;
  comment?: string;
  validatorComment?: string;
  createdAt: string;
  updatedAt: string;
  recurrence?: RecurrenceConfig;
  recurrenceGroupId?: string; // Pour lier toutes les instances d'une récurrence
}
