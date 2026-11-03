import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DemandeVerification, ResultatVerification } from './model';

export const TrActions = createActionGroup({
  source: 'TR',
  events: {
    'Verifier': props<{ demande: DemandeVerification }>(),
    'Verifier Succes': props<{ message: string; resultat: ResultatVerification }>(),
    'Verifier Echec': props<{ code: number; message: string }>(),
    'Reinitialiser': emptyProps(),
  },
});