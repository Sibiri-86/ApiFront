import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from "./cache.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { API_URL } from '../components/model/util.model';
import { Account } from '../components/model/account.model';
import { User } from 'src/app/store/user/model';

@Injectable({
    providedIn: 'root'
})




export class AuthService {

    private readonly http = inject(HttpClient);
    private readonly API_URL = API_URL;
    private cacheService = inject(CacheService)
    private router = inject(Router)
    readonly TOKEN_KEY = "TOKEN";
    readonly UTILISATEUR_KEY = "UTILISATEUR";
    readonly USERNAME_KEY = "USERNAME";


    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        //   this.tokenSubject.next(accessToken);
    }

    public login(loginVM: Account): Observable<HttpResponse<JwtToken>> {
        return this.http.post<JwtToken>(`${this.API_URL}/authenticate`, loginVM, { observe: "response" });
    }
    public onSaveToken(token: string): void {
        // Save Token
        this.cacheService.saveData(this.TOKEN_KEY, token);

        // Save additional data
        const jwtHelperService = new JwtHelperService();
        const decodedToken = jwtHelperService.decodeToken(token);
        const utilisateurJson = decodedToken['utilisateur'];
        if (utilisateurJson !== undefined) {
            this.cacheService.saveData(this.UTILISATEUR_KEY, JSON.stringify(utilisateurJson));
        }
        console.warn("decodedToken", decodedToken);
    }

    





    public getToken(): string {
        return this.cacheService.getData(this.TOKEN_KEY);
    }

    public isTokenExpired(): boolean {
        const jwtHelperService = new JwtHelperService();
        return jwtHelperService.isTokenExpired(this.getToken());
    }

    public onLogout(): void {
        this.cacheService.clearData();
        this.router.navigate(['/admin/login']);
    }

    public getLocalUsername(): string | null {
        const username = this.cacheService.getData(this.USERNAME_KEY);
        if (username === undefined || username === '') {
            return null;
        }
        return username;
    }

    public hasAnyAuthority(authorities: string[]): boolean {
        if (!authorities || authorities.length === 0) {
            return true;
        }
        const jwtHelperService = new JwtHelperService();
        const decodedToken = jwtHelperService.decodeToken(this.getToken());
        const auths: string[] = (decodedToken.auth as string).split(' ');
        return authorities.some(auth => auths.includes(auth));
    }

    getUsersProfil(): string[] | null {
        const jwtHelperService = new JwtHelperService();
        const decodedToken = jwtHelperService.decodeToken(this.getToken());
        return (decodedToken.auth as string).split(' ');
    }

}

export class JwtToken {
    constructor(
        public accessToken: string,
        public refreshToken: string,
    ) {
    }
}
