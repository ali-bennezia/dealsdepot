export interface AuthSession {
  id: string;
  token: string;
  username: string;
  roles: string[];
  profilePictureFileName: string | null;
}
