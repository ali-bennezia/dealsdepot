import { UserInboundDto } from 'src/app/auth/data/dtos/inbound/user-inbound-dto';

export interface ArticleInboundDto {
  id: string;
  author: string;
  link: string;
  title: string;
  content: string;
  clicks: number;
  views: number;
  totalVotes: number;
  medias: string[];
  tags: string[];
  votes: {
    for: number;
    against: number;
  };
  authorData: UserInboundDto;
  createdAtTime: number;
  updatedAtTime: number;
}
