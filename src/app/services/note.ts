import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, timeout } from 'rxjs';
import { CreateNoteDTO, Note } from '../features/notes/store/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly apiUrl = 'http://localhost:3000/notes';
  private readonly TIMEOUT = 10000;

  private http = inject(HttpClient);

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl).pipe(timeout(this.TIMEOUT));
  }

  getNotesById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`).pipe(timeout(this.TIMEOUT));
  }

  addNote(dto: CreateNoteDTO): Observable<Note> {
    const today = new Date().toISOString().split('T')[0];
    return this.http
      .post<Note>(this.apiUrl, {
        ...dto,
        isPinned: false,
        createdAt: today,
        updatedAt: today,
      })
      .pipe(timeout(this.TIMEOUT));
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(timeout(this.TIMEOUT));
  }

  updateNote(id: number, title: string, content: string): Observable<Note> {
    return this.getNotesById(id).pipe(
      switchMap((note) =>
        this.http.put<Note>(`${this.apiUrl}/${id}`, {
          ...note,
          title,
          content,
          updatedAt: new Date().toISOString().split('T')[0],
        }),
      ),
      timeout(this.TIMEOUT),
    );
  }

  pinNote(id: number, isPinned: boolean): Observable<Note> {
    return this.getNotesById(id).pipe(
      switchMap((note) =>
        this.http.put<Note>(`${this.apiUrl}/${id}`, {
          ...note,
          isPinned,
          updatedAt: new Date().toISOString().split('T')[0],
        }),
      ),
      timeout(this.TIMEOUT),
    );
  }
}
