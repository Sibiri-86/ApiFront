export interface Module {
  id: string;
  code: string;
  libelle: string;
}

//export interface ProfilList {
    //profilList?: Array<Profil>;
//}

export interface ModuleList {
  profils: Module[];
  selectedProfil: Module | null;
  loading: boolean;
  error: string | null;
}
