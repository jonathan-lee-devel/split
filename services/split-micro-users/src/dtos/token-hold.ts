export interface TokenHoldDto {
  id: string;
  email: string;
  token: string;
  tokenCode: string;
  refreshToken: string;
  expiryDate: Date,
}
