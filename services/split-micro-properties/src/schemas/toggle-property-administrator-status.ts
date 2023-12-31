import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';
import {z} from 'zod';

export const togglePropertyAdministratorStatusRequestBodySchema = z.object({
  emailToToggle: z.string().email(),
});

export type TogglePropertyAdministratorStatusRequestBody = z.infer<typeof togglePropertyAdministratorStatusRequestBodySchema>;

export const togglePropertyAdministratorStatusRequestParamsSchema = z.object({
  propertyId: z.string().min(DEFAULT_ID_LENGTH).max(DEFAULT_ID_LENGTH),
});

export type TogglePropertyAdministratorStatusRequestParams = z.infer<typeof togglePropertyAdministratorStatusRequestParamsSchema>;

export const togglePropertyAdministratorStatusRequestQuerySchema = z.object({});

export type TogglePropertyAdministratorStatusRequestQuery = z.infer<typeof togglePropertyAdministratorStatusRequestQuerySchema>;
