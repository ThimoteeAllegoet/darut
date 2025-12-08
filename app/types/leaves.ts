export type LeaveType =
  | 'Télétravail'
  | 'Congés'
  | 'Formation'
  | 'Déplacement'
  | 'Absence';

export type PeriodType = 'matin' | 'après-midi' | 'journée';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  isValidator: boolean;
}

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
}
