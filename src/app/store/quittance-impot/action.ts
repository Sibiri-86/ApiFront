import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InfosQuittance } from './model';

export const QuittanceActions = createActionGroup({
  source: 'Quittance Impot',
  events: {
    'Load': props<{ dateDebut: string; dateFin: string }>(),
    'Load Success': props<{ quittances: InfosQuittance[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Reset': emptyProps(),
  },
});