import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  @Output() isLoadingMap = new EventEmitter<Map<string, boolean>>();

  private readonly loadingMap = new Map<string, boolean>();

  constructor() { }

  public isLoadingMapObservable(): Observable<Map<string, boolean>> {
    return this.isLoadingMap;
  }

  public onLoadingStart(key: string) {
    this.loadingMap.set(key, true);
    this.isLoadingMap.next(this.loadingMap);
  }

  public onLoadingFinished(key: string) {
    this.loadingMap.set(key, false);
    this.isLoadingMap.next(this.loadingMap);
    this.loadingMap.delete(key);
  }

  public onAllLoadingFinished() {
    this.loadingMap.forEach((_value, key) => {
      this.onLoadingFinished(key);
    });
  }
}
