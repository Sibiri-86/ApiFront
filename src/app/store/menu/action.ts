import {props, createAction} from '@ngrx/store';
import { MenuAction } from './model';
export const createMenuAction = createAction('[App Init] Create MenuAction', props<MenuAction>());
export const updateMenuAction = createAction('[App Init] update MenuAction', props<MenuAction>());
export const deleteMenuAction = createAction('[App Init] delete MenuAction', props<MenuAction>());
export const deleteMenuActions = createAction('[App Init] delete MenuActions', props<{menuActions: Array<MenuAction>}>());
export const loadMenuAction = createAction('[App Init] load MenuActions');
export const setMenuAction = createAction('[App Init] set MenuAction',  props<{menuActions: MenuAction[]}>());