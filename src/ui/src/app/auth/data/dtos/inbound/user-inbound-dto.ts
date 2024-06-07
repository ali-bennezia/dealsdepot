export interface UserInboundDto {
  id: string;
  username: string;
  profilePictureFileName: string | null;
  roles: string[];
  createdAtTime: number;
}
