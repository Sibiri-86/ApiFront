export interface Profil {
  id?: number;
  code?: string;
  libelle?: string;
}

//export interface ProfilList {
    //profilList?: Array<Profil>;
//}

export interface ProfilList {
  profils: Profil[];
  selectedProfil: Profil | null;
  loading: boolean;
  error: string | null;
}
