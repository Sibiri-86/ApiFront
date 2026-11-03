import { inject } from '@angular/core';
import { AuthServerProvider } from '../auth/auth-jwt.service';

/** Pages accessibles sans être connecté */
const PUBLIC_ROUTES = [
  '/admin/reset-password',
  '/admin/login',
];

export const authInitializerFactory = (): (() => Promise<boolean>) => {
  const authServerProvider = inject(AuthServerProvider);

  return (): Promise<boolean> => {
    // Au démarrage, router.url vaut encore '/', on lit donc l'URL du navigateur
    const currentUrl = decodeURIComponent(window.location.href);
    const isPublicRoute = PUBLIC_ROUTES.some((route) => currentUrl.includes(route));

    if (isPublicRoute) {
      return Promise.resolve(true);
    }

    // isAuthenticated() vérifie la présence du jeton et, s'il s'agit d'un JWT, son expiration
    if (authServerProvider.isAuthenticated()) {
      console.log('Jeton valide, application initialisée');
      return Promise.resolve(true);
    }

    // Pas de jeton ou jeton expiré (pas de refresh token côté backend) :
    // on nettoie le stockage et on redirige vers le login
    console.log('Aucun jeton valide, redirection vers le login');
    authServerProvider.logout();
    return Promise.resolve(true);
  };
};