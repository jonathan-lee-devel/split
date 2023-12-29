import {z} from 'zod';

export const TogglePropertyAdministratorStatusRequestBodySchema = z.object({
  emailToToggle: z.string().email(),
});

export type TogglePropertyAdministratorStatusRequestBody = z.infer<typeof TogglePropertyAdministratorStatusRequestBodySchema>;

export const TogglePropertyAdministratorStatusRequestQuerySchema = z.object({});

export type TogglePropertyAdministratorStatusRequestQuery = z.infer<typeof TogglePropertyAdministratorStatusRequestQuerySchema>;
