import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import  { reducer } from './store/profil/reducer';
import { provideEffects } from '@ngrx/effects';
import { ProfilEffects } from './store/profil/effect';
import {  UnifiedAuthInterceptor } from './service-util/interceptor/auth.interceptor';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UserEffects } from './store/user/effect';
import { UserReducer } from './store/user/reducer';
import { authInitializerFactory } from './service-util/interceptor/auth.initializer.factory';
import { MenuActionEffects } from './store/menu/effect';
import { Menureducer } from './store/menu/reducer';
import { ModuleParamEffects } from './store/module-param/effect';
import { Modulereducer } from './store/module-param/reducer';
import { OperateurEffects } from './store/operateur/effect';
import { OperateurReducer } from './store/operateur/reducer';
import { GlobalConfigreducer } from './store/global-config/reducer';

import { dashboardReducer } from './store/dashboard/reducer';
import { DashboardEffects } from './store/dashboard/effect';

import { IdleTimeoutService } from './service-util/auth/idleTimeout.service';
import { MessageService } from 'primeng/api';
import { loadingInterceptor } from './service-util/interceptor/loading.interceptor';
import { TvmEffects } from './store/tvm/effect';
import { tvmFeature } from './store/tvm/reducer';
import { quittanceTvmFeature } from './store/tvm-consultation/reducer';
import { QuittanceTvmEffects } from './store/tvm-consultation/effect';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { quittanceTrFeature } from './store/tr-consultation/reducer';
import { QuittanceTrEffects } from './store/tr-consultation/effect';
import { trFeature } from './store/tr-verification/reducer';
import { TrEffects } from './store/tr-verification/effect';
import { quittanceFeature } from './store/quittance-impot/reducer';
import { QuittanceImpotEffects } from './store/quittance-impot/effect';



registerLocaleData(localeFr);
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializerFactory,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr' },

    provideHttpClient(
      withInterceptors([UnifiedAuthInterceptor,loadingInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideStore({
      globalState: GlobalConfigreducer,
      profilState: reducer,
      userState: UserReducer,
      operateurState: OperateurReducer,
      menuActionState: Menureducer,
      moduleParamState: Modulereducer,
      dashboard: dashboardReducer,
      [tvmFeature.name]: tvmFeature.reducer,
      [quittanceTvmFeature.name]: quittanceTvmFeature.reducer,
      [quittanceTrFeature.name]: quittanceTrFeature.reducer,
      [trFeature.name]: trFeature.reducer,
      [quittanceFeature.name]: quittanceFeature.reducer

    }),
    provideEffects([
      ProfilEffects,
      UserEffects,
      MenuActionEffects,
      ModuleParamEffects,
      OperateurEffects,
      DashboardEffects,
      TvmEffects,
      QuittanceTvmEffects,
      QuittanceTrEffects,
      TrEffects,
      QuittanceImpotEffects
    ]),
    provideRouter(routes),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    }),

    importProvidersFrom(
      NgxWebstorageModule.forRoot({
        prefix: 'myApp',
        separator: '.',
        caseSensitive: true
      })
    ),
     IdleTimeoutService,
    MessageService,
  ],
};
