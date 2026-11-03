// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;
  
  // Observable avec debounce pour éviter les flickering
  public loading$: Observable<boolean> = this.loadingSubject.asObservable().pipe(
    debounceTime(100), // Attend 100ms avant d'afficher/masquer le spinner
    distinctUntilChanged() // N'émet que si la valeur change
  );

  constructor() {}

  /**
   * Affiche le spinner de chargement
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * Masque le spinner de chargement
   */
  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force le masquage du spinner (utile en cas d'erreur)
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  /**
   * Obtient l'état actuel du chargement (synchrone)
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Réinitialise complètement le service
   */
  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }
}