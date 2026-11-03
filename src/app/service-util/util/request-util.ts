import { HttpParams } from '@angular/common/http';

/**
 * Interface pour typer les paramètres de requête
 */
export interface RequestParams {
  [key: string]: string | number | boolean | string[] | null | undefined;
  sort?: string[];
}

/**
 * Crée des HttpParams à partir d'un objet de paramètres
 * @param req - Objet contenant les paramètres de requête
 * @returns HttpParams configuré
 */
export const createRequestOption = (req?: RequestParams): HttpParams => {
  let options: HttpParams = new HttpParams();
  
  if (!req) {
    return options;
  }

  // Traiter tous les paramètres sauf 'sort'
  Object.keys(req).forEach(key => {
    if (key !== 'sort') {
      const value = req[key];
      
      // Vérifier que la valeur n'est ni null ni undefined
      if (value !== null && value !== undefined) {
        // Gérer les tableaux
        if (Array.isArray(value)) {
          value.forEach(item => {
            options = options.append(key, String(item));
          });
        } else {
          options = options.set(key, String(value));
        }
      }
    }
  });

  // Traitement spécial pour 'sort'
  if (req.sort && Array.isArray(req.sort)) {
    req.sort.forEach(sortValue => {
      if (sortValue !== null && sortValue !== undefined) {
        options = options.append('sort', String(sortValue));
      }
    });
  }

  return options;
};

// Version alternative plus concise avec une approche fonctionnelle
export const createRequestOptionAlt = (req?: RequestParams): HttpParams => {
  if (!req) {
    return new HttpParams();
  }

  return Object.entries(req).reduce((params, [key, value]) => {
    if (value === null || value === undefined) {
      return params;
    }

    if (key === 'sort' && Array.isArray(value)) {
      return value.reduce((sortParams, sortValue) => 
        sortParams.append('sort', String(sortValue)), params
      );
    }

    if (Array.isArray(value)) {
      return value.reduce((arrayParams, item) => 
        arrayParams.append(key, String(item)), params
      );
    }

    return params.set(key, String(value));
  }, new HttpParams());
};