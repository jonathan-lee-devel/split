import {z} from 'zod';
import {DEFAULT_TOKEN_SIZE} from '../../../constants/token/token';

export const AcceptOrganizationInvitationRequestBodySchema = z.object({
  organizationInvitationValue: z.string().min(DEFAULT_TOKEN_SIZE).max(DEFAULT_TOKEN_SIZE),
});

export type AcceptOrganizationInvitationRequestBody = z.infer<typeof AcceptOrganizationInvitationRequestBodySchema>;

export const AcceptOrganizationInvitationRequestQuerySchema = z.object({});

export type AcceptOrganizationInvitationRequestQuery = z.infer<typeof AcceptOrganizationInvitationRequestQuerySchema>;
