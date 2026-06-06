import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NoteFacade } from '../note.facade';
import { NoteFilterStore } from '../store/note-filter.store';
import { CreateNoteDTO, Note } from '../store/note.model';
import { combineLatest, map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NoteCard } from "../note-card/note-card";

@Component({
  selector: 'app-note-list',
  imports: [CommonModule, FormsModule, NoteCard],
  templateUrl: './note-list.html',
  styleUrl: './note-list.scss',
  standalone: true,
  providers: [NoteFilterStore, NoteFacade],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteList implements OnInit {
  noteFacade = inject(NoteFacade);
  filterStore = inject(NoteFilterStore);

  loading$ = this.noteFacade.loading$;
  error$ = this.noteFacade.error$;
  counts$ = this.noteFacade.counts$;
  filterCount$ = this.filterStore.activeFilterCount$;

  newTitle = '';
  newContent = '';
  newCategory: Note['category'] = 'personal';
  showAddForm = false;

  filteredNotes$: Observable<Note[]> = combineLatest([
    this.noteFacade.allNotes$,
    this.filterStore.filterState$,
  ]).pipe(
    map(([notes, filters]) => {
      let result = notes;

      if (filters.showPinned) {
        result = result.filter((n) => n.isPinned);
      }

      if (filters.category !== 'all') {
        result = result.filter((n) => n.category === filters.category);
      }

      if (filters.searchText) {
        const q = filters.searchText.toLowerCase();
        result = result.filter(
          (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
        );
      }

      return result;
    }),
  );

  ngOnInit(): void {
    this.noteFacade.loadNotes();
  }

  addNote(): void {
    if (!this.newTitle.trim() || !this.newContent.trim()) return;
    const dto: CreateNoteDTO = {
      title: this.newTitle.trim(),
      category: this.newCategory,
      content: this.newContent.trim(),
      userId: 1,
    };

    this.noteFacade.addNotes(dto);
    this.newCategory = 'personal';
    this.newTitle = '';
    this.newContent = '';
    this.showAddForm = false;
  }

  deleteNote(id: number): void {
    this.noteFacade.deleteNote(id);
  }

  pinNote(id: number, isPinned: boolean) {
    this.noteFacade.pinNote(id, isPinned);
  }

  updateNote(event: { id: number; title: string; content: string }) {
    this.noteFacade.updateNote(event.id, event.title, event.content);
  }

  onSearch(text: string) {
    this.filterStore.setSearchText(text);
  }

  onCategory(cat: Note['category']) {
    this.filterStore.setCategory(cat);
  }

  trackById(_: number, note: Note) {
    return note.id;
  }
}
