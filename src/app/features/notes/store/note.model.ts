export interface Note {
  id: number;
  title: string;
  content: string;
  category: 'personal' | 'work' | 'learning' | 'other';
  isPinned: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDTO {
  title: string;
  content: string;
  category: 'personal' | 'work' | 'learning' | 'other';
  userId: number;
}
