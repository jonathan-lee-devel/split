import {Component, Input} from '@angular/core';
import {OrganizationSnippetDto} from '../../dtos/organization/OrganizationSnippetDto';

@Component({
  selector: 'app-organization-search-result',
  templateUrl: './organization-search-result.component.html',
  styleUrls: ['./organization-search-result.component.css'],
})
export class OrganizationSearchResultComponent {
  @Input() searchResult: OrganizationSnippetDto = {id: '', name: ''};
}
