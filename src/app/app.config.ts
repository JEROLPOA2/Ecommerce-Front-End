import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import lara from '@primeng/themes/lara';
import { MyTheme } from './mytheme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: lara,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
