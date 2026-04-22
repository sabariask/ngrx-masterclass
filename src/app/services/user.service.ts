import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { User } from "../models/user.model";


@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = "http://localhost:3000/users";
    private http = inject(HttpClient);

    getMockUser(id: number = 1): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }
}