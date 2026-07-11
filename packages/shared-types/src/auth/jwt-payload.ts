export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type TRole = (typeof ROLES)[keyof typeof ROLES];

export type TJwtPayload = {
  id: string;
  email: string;
  role: TRole;
};
