import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { isDevMode } from '@angular/core';

bootstrapApplication(App, appConfig)
  .then((appRef) => {
    if (isDevMode()) {
      enableDebugTools(appRef.components[0]);
    }
  })
  .catch((err) => console.error(err));
