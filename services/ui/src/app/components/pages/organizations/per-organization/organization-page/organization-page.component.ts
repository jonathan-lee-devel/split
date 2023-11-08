import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrganizationService} from '../../../../../services/organization/organization.service';
import {LoadingService} from '../../../../../services/loading/loading.service';
import {OrganizationSnippetDto} from '../../../../../dtos/organization/OrganizationSnippetDto';
import {ProductDto} from '../../../../../dtos/products/ProductDto';
import {ProductService} from '../../../../../services/product/product.service';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.css'],
})
export class OrganizationPageComponent implements OnInit {
  organization: OrganizationSnippetDto = {
    id: 'Loading...',
    name: 'Loading...',
  };
  isLoadingMap = new Map<string, boolean>();
  readonly organizationIsLoadingKey = 'organization-page-organization-is-loading';
  readonly productsIsLoadingKey = 'organization-page-products-is-loading';
  products: ProductDto[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private organizationService: OrganizationService,
              private productService: ProductService,
              private loadingService: LoadingService) {
    this.loadingService.isLoadingMapObservable()
        .subscribe((isLoadingMap) => {
          this.isLoadingMap = isLoadingMap;
        });
  }
  ngOnInit() {
    this.loadingService.onLoadingStart(this.organizationIsLoadingKey);
    this.loadingService.onLoadingStart(this.productsIsLoadingKey);
    this.activatedRoute.params.subscribe((params) => {
      this.organizationService.getOrganizationSnippetById(params['organizationId'])
          .subscribe((organization) => {
            this.organization = organization;
            setTimeout(() => {
              this.loadingService.onLoadingFinished(this.organizationIsLoadingKey);
            }, 500);
          });
      this.productService.getProducts(params['organizationId'])
          .subscribe((products) => {
            setTimeout(() => {
              this.products = products;
              this.loadingService.onLoadingFinished(this.productsIsLoadingKey);
            }, 1000);
          });
    });
  }
}
