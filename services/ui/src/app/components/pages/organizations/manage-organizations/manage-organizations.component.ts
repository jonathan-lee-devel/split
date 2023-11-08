import {Component, OnInit} from '@angular/core';
import {OrganizationService} from '../../../../services/organization/organization.service';
import {OrganizationDto} from '../../../../dtos/organization/OrganizationDto';
import {LoadingService} from '../../../../services/loading/loading.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {UserDto} from '../../../../dtos/auth/UserDto';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css'],
})
export class ManageOrganizationsComponent implements OnInit {
  organizations: OrganizationDto[] = [];
  isLoadingMap = new Map<string, boolean>();
  readonly manageOrganizationsOrganizationsLoading = 'manage-organizations-organizations-loading';
  currentUser: UserDto = AuthService.DEFAULT_USER;

  constructor(
      private loadingService: LoadingService,
      private organizationService: OrganizationService,
      private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.loadingService.isLoadingMapObservable().subscribe((isLoadingMap) => {
      this.isLoadingMap = isLoadingMap;
    });
    this.loadingService.onLoadingStart(this.manageOrganizationsOrganizationsLoading);
    this.currentUser = this.authService.getCurrentUserInfo();
    this.organizationService.getOrganizationsWhereInvolved().subscribe((organizations) => {
      this.organizations = organizations;
      this.loadingService.onLoadingFinished(this.manageOrganizationsOrganizationsLoading);
    });
  }
}
