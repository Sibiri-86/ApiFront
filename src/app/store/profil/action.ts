import {props, createAction} from '@ngrx/store';
import { Profil, ProfilList } from './model';
export const createProfil = createAction('[App Init] Create Profil', props<Profil>());
export const updateProfil = createAction('[App Init] update Profil', props<Profil>());
export const deleteProfil = createAction('[App Init] delete Profil', props<Profil>());
export const deleteProfils = createAction('[App Init] delete Profils', props<{ProfilList: Array<Profil>}>());
export const loadProfil = createAction('[App Init] load Profils');
export const setProfil = createAction('[App Init] set Profil',  props<{profils: Profil[]}>());
