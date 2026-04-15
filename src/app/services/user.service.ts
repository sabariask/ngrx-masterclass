import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { User } from "../models/user.model";


@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = "https://jsonplaceholder.typicode.com";
    private http = inject(HttpClient);

    getUser(id: number = 1): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    }

    getMockUser(): Observable<User> {
        const mockUser: User = {
            id: 1,
            name: 'Arun Kumar',
            email: "arun@gamil.com",
            role: 'admin',
            avatarUrl: 'https://i.pravatar.cc/100?img=1',
            createdAt: '2024-01-15'
        };

        return of(mockUser).pipe(delay(500));
    }
}