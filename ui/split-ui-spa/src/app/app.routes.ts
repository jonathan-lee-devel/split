import {Routes} from '@angular/router';
import {LandingPageComponent} from './components/pages/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'Split | Welcome',
  },
];