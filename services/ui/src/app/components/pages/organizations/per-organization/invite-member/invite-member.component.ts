import {Component, OnInit} from '@angular/core';
import {OrganizationService} from '../../../../../services/organization/organization.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-invite-member',
  templateUrl: './invite-member.component.html',
  styleUrls: ['./invite-member.component.css'],
})
export class InviteMemberComponent implements OnInit {
  emailToInvite: string = '';
  private organizationId: string = '';

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.organizationId = params['organizationId'];
    });
  }

  doInviteMember() {
    this.organizationService.inviteToJoinOrganization(this.organizationId, this.emailToInvite);
  }
}
