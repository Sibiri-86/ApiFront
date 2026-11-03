export class Direction {
    constructor(
        public id?: number,
        public codeCdi?: string,
        public libelleLongCdi?: string,
        public libelleCourtCdi?: string,
        public localiteCdi?: string,
        public cdiCodeCdi?: string,
    ) {

    }

}

//export interface ProfilList {
    //profilList?: Array<Profil>;
//}

export interface DirectionList {
  direction: Direction[];
  selectedDirection: Direction | null;
  loading: boolean;
  error: string | null;
}
