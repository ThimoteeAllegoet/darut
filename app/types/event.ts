export type EventType = 'Incident majeur' | 'Version' | 'Hotfix' | 'Autre';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
