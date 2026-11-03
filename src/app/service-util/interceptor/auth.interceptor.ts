import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { LoginService } from '../auth/login.service';
import { LoadingService } from './loading.service';

/** URLs pour lesquelles on n'affiche pas le spinner */
const SPINNER_EXCLUDED_URLS: string[] = [
  // Ajoutez d'autres URLs si nécessaire
];

/** Endpoints publics : pas de jeton ajouté, et un 401 n'y déclenche pas de déconnexion */
const PUBLIC_URLS = [
  '/api/users/login',
  '/api/users/reset-password',
];

export const UnifiedAuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authServerProvider = inject(AuthServerProvider);
  const loginService = inject(LoginService);
  const loadingService = inject(LoadingService);

  const shouldShowSpinner = !SPINNER_EXCLUDED_URLS.some((url) => req.url.includes(url));
  const authReq = addAuthToken(req, authServerProvider);

  if (shouldShowSpinner) {
    loadingService.show();
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = jeton absent, invalide ou expiré (le backend n'a pas de refresh token) -> retour au login
      if (error.status === 401 && !isPublicUrl(authReq.url)) {
        console.error('Session expirée ou jeton invalide, déconnexion:', error.url);
        loginService.logout();
        loadingService.forceHide();
        return throwError(() => error);
      }

      // Tout le reste (dont 403 = droits insuffisants) : on journalise, sans déconnecter
      logNonAuthError(error, req.url);
      return throwError(() => error);
    }),
    finalize(() => {
      if (shouldShowSpinner) {
        loadingService.hide();
      }
    })
  );
};

function addAuthToken(request: HttpRequest<any>, authServerProvider: AuthServerProvider): HttpRequest<any> {
  const token = authServerProvider.getAccessToken();

  if (token && !isPublicUrl(request.url)) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return request;
}

function isPublicUrl(url: string): boolean {
  return PUBLIC_URLS.some((publicUrl) => url.includes(publicUrl));
}

function logNonAuthError(error: HttpErrorResponse, url: string): void {
  const errorType = getErrorType(error);
  console.warn(`${errorType} (${error.status}) for ${url}:`, error.error?.message || error.message);
}

function getErrorType(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0: return 'Network/Proxy Error';
    case 400: return 'Bad Request';
    case 401: return 'Unauthorized';
    case 403: return 'Forbidden';
    case 404: return 'Not Found';
    case 409: return 'Conflict';
    case 422: return 'Validation Error';
    case 500: return 'Server Error';
    case 502: return 'Bad Gateway';
    case 503: return 'Service Unavailable';
    default: return 'HTTP Error';
  }
}