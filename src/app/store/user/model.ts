import { Profil } from "../profil/model";

export interface User {
       id?: any;
       login?: string;
       firstName?: string;
       lastName?: string;
       emailAddress?: string;
       activated?: boolean;
       langKey?: string;
       authorities?: any[];
       createdBy?: string;
       createdDate?: Date;
       lastModifiedBy?: string;
       lastModifiedDate?: Date;
       password?: string;
       profil?: Profil;
       operateurId?: number;
       operateur?: {
              id?: number;
              codeOperateur?: string;
              libelleOperateur?: string;
       };
}

