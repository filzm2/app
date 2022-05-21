import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IUser } from '@app/models/user/user.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  private userString;
  private csrfToken: string;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<IUser>;
  public redirectLink: [string, {[key: string]: string}] = null;

  constructor(private http: HttpClient) {
    this.userString = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserSubject = new BehaviorSubject<IUser>(this.userString);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>('api/v1/security/login', {
      password: password,
      username: username,
      provider: 'db',
      refresh: true,
    })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  checkUser() {
    console.log(localStorage.getItem('currentUser'), 'useeeer')
  }

  refresh() {
    // console.log('refreshing token', this.currentUserValue);

    this.postData('/api/v1/security/refresh', {})
      .then((data: any) => {
        // if (Object.keys(data).includes('acess_token')) {
        let newUser: any = {
          access_token: data.access_token,
          refresh_token: this.currentUserValue['refresh_token']
        }
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        return newUser;
        // }
      });
    // // const httpOptions = {
    // //     headers: new HttpHeaders({
    // //       'Content-Type':  'application/json',
    // //       'Authorization': this.currentUserValue['access_token']
    // //     })
    // //   };
    // //   console.log(httpOptions.headers)
    // // return this.http.post<any>('/api/v1/security/refresh',  httpOptions)
    // // .pipe(map(user => {
    // //     console.log('refreshed', user)
    // //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    // //     localStorage.setItem('currentUser', JSON.stringify(user));
    // //     this.currentUserSubject.next(user);
    // //     return user;
    // // }));
  }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit

      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.currentUserValue['refresh_token']
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return await response.json(); // parses JSON response into native JavaScript objects
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  public getCsrfToken(): Observable<string> {
    if (this.csrfToken) {
      return of(this.csrfToken);
    }
    return this.http.get(`/api/v1/security/csrf_token/`).pipe(
      map((res: { result: string }) => res.result),
      tap((token: string) => {
        this.csrfToken = token;
      }));
  }
}
