import { ArticleInboundDto } from './dtos/inbound/article-inbound-dto';

export interface ArticleOperationResult {
  success: boolean;
  status: number;
  data: ArticleInboundDto | null;
}
