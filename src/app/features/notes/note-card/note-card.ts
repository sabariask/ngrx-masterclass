import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Note } from '../store/note.model';

@Component({
  selector: 'app-note-card',
  imports: [],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCard {
  @Input() note!: Note;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onPin = new EventEmitter<{
    id: number;
    isPinned: boolean;
  }>();
  @Output() onUpdate = new EventEmitter<{
    id: number;
    title: string;
    content: string;
  }>();

  isEditing = signal(false);
  editTitle = signal('');
  editContent = signal('');

  readonly categoryIcons: Record<Note['category'], string> = {
    personal: '🏠',
    work: '💼',
    learning: '📚',
    other: '📌',
  };

  startEdit(): void {
    this.isEditing.set(true);
    this.editTitle.set(this.note.title);
    this.editContent.set(this.note.content);
  }

  saveEdit() {
    const title = this.editTitle().trim();
    const content = this.editContent().trim();

    if (!title || !content) return;

    if (title !== this.note.title || content !== this.note.content) {
      this.onUpdate.emit({
        id: this.note.id,
        title,
        content,
      });
      this.isEditing.set(false);
    }
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  delete() {
    this.onDelete.emit(this.note.id);
  }

  pin() {
    this.onPin.emit({
      id: this.note.id,
      isPinned: this.note.isPinned,
    });
  }
}
