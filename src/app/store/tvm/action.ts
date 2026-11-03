import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DemandeVerificationTvm, ReponseVerificationTvm } from './model';

export const TvmActions = createActionGroup({
  source: 'TVM',
  events: {
    'Verifier': props<{ demande: DemandeVerificationTvm }>(),
    'Verifier Succes': props<{ message: string; resultat: ReponseVerificationTvm }>(),
    'Verifier Echec': props<{ code: number; message: string }>(),
    'Reinitialiser': emptyProps(),
  },
});