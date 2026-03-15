// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  gsap.registerPlugin(ScrollTrigger);