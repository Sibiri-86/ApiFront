import { MenuAction } from "src/app/store/menu/model";

export interface ModuleParam {
    id?: number;
    libelle?: string;
    code?: string;
    deleted?: boolean;
    menuActions?: MenuAction[];
}