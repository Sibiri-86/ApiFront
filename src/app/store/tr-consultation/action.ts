import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { QuittanceTr } from './model';

export const QuittanceTrActions = createActionGroup({
  source: 'Quittance TR',
  events: {
    'Load': props<{ dateDebut: string; dateFin: string }>(),
    'Load Success': props<{ quittances: QuittanceTr[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Reset': emptyProps(),
  },
});