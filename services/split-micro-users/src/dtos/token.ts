export interface TokenResponseDto {
  token: string;
  refreshToken: string;
}

export interface RegistrationVerificationTokenDto {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
}

export interface PasswordResetVerificationTokenDto {
  id: string;
  value: string;
  expiryDate: Date;
  userEmail: string;
}
