export type AuthUser = {
  id: string;
  email?: string;
  isAnonymous: boolean;
  token: string;
};

export type AuthSession = {
  user: AuthUser | null;
};

