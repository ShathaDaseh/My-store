import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  Auth0ClientService,
  AuthConfigService,
  AuthGuard,
  AuthService,
  provideAuth0
} from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

const isBrowser = typeof window !== 'undefined';
const authProviders = isBrowser
  ? [
      provideAuth0({
        domain: environment.auth.domain,
        clientId: environment.auth.clientId,
        authorizationParams: {
          redirect_uri: environment.auth.redirectUri,
          audience: environment.auth.audience
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
      })
    ]
  : [];
const serverSafeProviders = isBrowser
  ? []
  : [
      {
        provide: AuthService,
        useValue: null
      },
      {
        provide: Auth0ClientService,
        useValue: null
      },
      {
        provide: AuthConfigService,
        useValue: null
      },
      {
        provide: AuthGuard,
        useValue: { canActivate: () => true }
      }
    ];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    ...authProviders,
    ...serverSafeProviders
  ]
};
