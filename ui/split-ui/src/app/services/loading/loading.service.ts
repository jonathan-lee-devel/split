import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoadingMap = signal<Map<string, boolean>>(new Map<string, boolean>());
  isLoadingMap_ = this.isLoadingMap.asReadonly();
  private readonly loadingMapData = new Map<string, boolean>();

  constructor() { }

  public onLoadingStart(key: string) {
    this.loadingMapData.set(key, true);
    this.isLoadingMap.set(this.loadingMapData);
  }

  public onLoadingFinished(key: string) {
    this.loadingMapData.set(key, false);
    this.isLoadingMap.set(this.loadingMapData);
    this.loadingMapData.delete(key);
  }

  public onAllLoadingFinished() {
    this.loadingMapData
        .forEach((_value, key) => {
          this.onLoadingFinished(key);
        });
  }
}
