export interface UserProfileInboundDto {
  id: string;
  username: string;
  profilePictureFileName: string | null;
  roles: string[];
  email: string;
  createdAtTime: number;
}
