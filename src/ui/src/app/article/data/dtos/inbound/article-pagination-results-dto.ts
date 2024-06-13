import { ArticleInboundDto } from './article-inbound-dto';

export interface ArticlePaginationResultsDto {
  totalDocs: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  pagingCounter: number;
  results: ArticleInboundDto[];
}
