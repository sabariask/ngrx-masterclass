import { Injectable } from "@angular/core";



export interface RouterStateUrl {
    url: string;
    params: { [key:string]: string };
    queryParams: { [key:string]: string };
    fragment: string | null;
    data: { [key:string]: any };
}
