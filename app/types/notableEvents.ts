export interface NotableEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  description?: string;
  createdBy: string; // User who created it
  createdAt: string;
  updatedAt: string;
}
