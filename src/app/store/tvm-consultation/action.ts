import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { QuittanceTvm } from './model';

export const QuittanceTvmActions = createActionGroup({
  source: 'Quittance TVM',
  events: {
    'Load': props<{ dateDebut: string; dateFin: string }>(),
    'Load Success': props<{ quittances: QuittanceTvm[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Reset': emptyProps(),
  },
});