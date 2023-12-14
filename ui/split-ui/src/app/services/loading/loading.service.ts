import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingMap = new Subject<Map<string, boolean>>();
  isLoadingMap$ = this.isLoadingMap.asObservable();
  private readonly loadingMap = new Map<string, boolean>();

  constructor() { }

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
