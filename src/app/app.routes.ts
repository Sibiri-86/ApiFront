import { Routes } from '@angular/router';
import { UserRouteAccessService } from './service-util/auth/user-route-access-service';

export const routes: Routes = [
    {
        path: 'accueil',
        loadComponent: () => import('./demo/components/landing/landing.component').then(m => m.LandingComponent)
    },
    {
        path: 'not-found',
        loadComponent: () => import('./demo/components/notfound/notfound.component').then(m => m.NotfoundComponent)
    },

    // Pages publiques : en dehors du layout (pas de menu/sidebar sur le login).
    // Elles doivent rester AVANT la route 'admin' pour être trouvées en premier.
    {
        path: 'admin/login',
        title: 'Login',
        loadComponent: () => import('./modules/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'admin/reset-password',
        title: 'Réinitialiser le mot de passe',
        loadComponent: () => import('./modules/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
    },

    {
        path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
    },

    // Pages protégées : dans le layout
    {
        path: 'admin',
        loadComponent: () => import('./layout/app.layout.component').then(m => m.AppLayoutComponent),
        // canActivate: [UserRouteAccessService],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                data: { breadcrumb: 'Accueil' },
                title: 'Dashboard',
                loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent)
            },
            {
                path: 'pages',
                data: { breadcrumb: 'Pages' },
                loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule)
            },
            {
                path: 'profils',
                title: 'Profil',
                loadComponent: () => import('./modules/profils/profils.component').then(c => c.ProfilComponent)
            },
            {
                path: 'module-param',
                data: { breadcrumb: 'Module' },
                loadComponent: () => import('./modules/securite/module-param/module-param.component').then(m => m.ModuleParamComponent),
                //  canActivate: [UserRouteAccessService]
            },
            {
                path: 'user',
                data: { breadcrumb: 'Utilisateurs' },
                loadComponent: () => import('./modules/securite/user/user.component').then(m => m.UserComponent),
                //  canActivate: [UserRouteAccessService]
            },
            {
                path: 'operateurs',
                data: { breadcrumb: 'Opérateurs' },
                loadComponent: () => import('./modules/securite/operateur/operateur.component').then(m => m.OperateurComponent),
            },
            {
                path: 'tvm-verification',
                loadComponent: () =>
                    import('./modules/tvm/tvm-verification.component').then((m) => m.TvmVerificationComponent),
            },
            {
                path: 'quittance-tvm',
                loadComponent: () =>
                    import('./modules/quittance-tvm/quittance-tvm.component').then((m) => m.QuittanceTvmComponent),
            },

            {
                path: 'quittance-tr',
                loadComponent: () =>
                    import('./modules/quittance-tr/quittance-tr.component').then((m) => m.QuittancetrComponent),
            },
            {
                path: 'tr-verification',
                loadComponent: () =>
                    import('./modules/tr-verification/tr-verification.component').then((m) => m.TrVerificationComponent),
            },
             {
                path: 'quittance-impot',
                loadComponent: () =>
                    import('./modules/quittance-impot/quittance-impot.component').then((m) => m.QuittanceImpotComponent),
            },
        ]
    },

    {
        path: '**',
        title: 'Page non trouvée',
        loadComponent: () => import('./demo/components/notfound/notfound.component').then(m => m.NotfoundComponent),
    },
];