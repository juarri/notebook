export interface Note {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  body: string;
  pinned: boolean;
}
