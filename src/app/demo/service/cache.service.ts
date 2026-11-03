import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    constructor() { }

    /**
     * Request to save data in sessionStorage
     * @param key is the key of value to save
     * @param value is the value to save
     */
    saveData(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    /**
     * Request to retrieve data from sessionStorage
     * @param key is the key of value to retrieve
     */
    getData(key: string): string {
        return sessionStorage.getItem(key) ?? '';
    }

    /**
     *Request to clear data from local storage
     */
    clearData(): void {
        sessionStorage.clear();
    }
}
