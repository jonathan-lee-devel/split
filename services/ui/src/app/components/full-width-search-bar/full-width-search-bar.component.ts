import {Component, Input, OnInit} from '@angular/core';
import {SearchableComponent} from '../../interfaces/SearchableComponent';

export type SearchFunction = (searchParams: string) => void;

@Component({
  selector: 'app-full-width-search-bar',
  templateUrl: './full-width-search-bar.component.html',
  styleUrls: ['./full-width-search-bar.component.css'],
})
export class FullWidthSearchBarComponent implements OnInit, SearchableComponent {
  @Input() searchCategories: string[] = [];
  @Input() initialSearchCategory: string = '';
  currentSearchCategory: string = '';
  searchParams: string = '';

  @Input() searchableComponent: SearchableComponent = {search() {}};

  ngOnInit() {
    this.currentSearchCategory = this.initialSearchCategory;
  }

  setSearchCategory(searchCategory: string) {
    this.currentSearchCategory = searchCategory;
  }

  search() {
    this.searchableComponent.search(this.searchParams);
  }
}
