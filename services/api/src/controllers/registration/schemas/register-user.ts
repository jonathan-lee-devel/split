import {z} from 'zod';
import {MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH} from '../../../constants/registration/registration';

export const RegisterUserRequestBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
  lastName: z.string().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
  confirmPassword: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH), // Confirm password must match password, this validation is performed in the callback
  acceptTermsAndConditions: z.literal<boolean>(true), // Boolean but must be true
});

export type RegisterUserRequestBody = z.infer<typeof RegisterUserRequestBodySchema>;

export const RegisterUserRequestQuerySchema = z.object({});

export type RegisterUserRequestQuery = z.infer<typeof RegisterUserRequestQuerySchema>;
