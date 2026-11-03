// loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

/**
 * Intercepteur HTTP qui gère automatiquement l'affichage du spinner
 * Compatible avec le nouveau système d'intercepteurs fonctionnels d'Angular
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Liste des URLs à exclure du spinner (optionnel)
  const excludedUrls = [
    '/api/health',
    '/api/ping',
    '/assets/'
  ];

  // Vérifier si l'URL doit être exclue
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));
  
  if (!shouldExclude) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldExclude) {
        loadingService.hide();
      }
    })
  );
};