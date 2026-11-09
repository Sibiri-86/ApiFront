import { createAction, props } from '@ngrx/store';
import { Operateur } from './model';

export const loadOperateur = createAction('[Operateur] Load operateurs');
export const setOperateur = createAction('[Operateur] Set operateurs', props<{ operateurs: Operateur[] }>());
export const createOperateur = createAction('[Operateur] Create operateur', props<Operateur>());
export const updateOperateur = createAction('[Operateur] Update operateur', props<Operateur>());
export const deleteOperateur = createAction('[Operateur] Delete operateur', props<{ id: number }>());
