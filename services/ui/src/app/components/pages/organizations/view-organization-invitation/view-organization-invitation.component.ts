import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrganizationService} from '../../../../services/organization/organization.service';
import {OrganizationSnippetDto} from '../../../../dtos/organization/OrganizationSnippetDto';
import {LoadingService} from '../../../../services/loading/loading.service';

@Component({
  selector: 'app-view-organization-invitation',
  templateUrl: './view-organization-invitation.component.html',
  styleUrls: ['./view-organization-invitation.component.css'],
})
export class ViewOrganizationInvitationComponent implements OnInit {
  organizationInvitationId: string = '';
  organizationSnippet: OrganizationSnippetDto = {id: '', name: 'Loading...'};
  readonly organizationInvitationSnippetInitialLoading: string = 'organization-invitation-snippet-initial-loading';
  isLoadingMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
  ) {
    this.loadingService.isLoadingMapObservable()
        .subscribe((isLoadingMap) => {
          this.isLoadingMap = isLoadingMap;
        });
  }

  ngOnInit() {
    this.loadingService.onLoadingStart(this.organizationInvitationSnippetInitialLoading);
    this.route.params.subscribe((params) => {
      this.organizationInvitationId = params['organizationInvitationId'];
      this.organizationService.getOrganizationSnippetByInvitationId(this.organizationInvitationId)
          .subscribe((organizationSnippet) => {
            this.loadingService.onLoadingFinished(this.organizationInvitationSnippetInitialLoading);
            this.organizationSnippet = organizationSnippet;
          });
    });
  }

  doAcceptInvitation() {
    this.organizationService.acceptOrganizationInvitation(
        this.organizationInvitationId,
        this.organizationSnippet.id,
    );
  }
}
