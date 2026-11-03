import { MenuAction } from "src/app/store/menu/model";

export interface Profil {
    id?: number;
    libelle?: string;
    code?: string;
    menus?: MenuAction[];

}