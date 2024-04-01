import { Routes } from '@angular/router';
import { GameTemplateComponent } from './templates/game-template/game-template.component';
import { SetupComponent } from './partials/setup/setup.component';

export const routes: Routes = [
  {
    path: 'game',
    title: 'Partida',
    component: GameTemplateComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'setup', // child route path
        title: 'Configuración de la partida',
        component: SetupComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'game' },
];
