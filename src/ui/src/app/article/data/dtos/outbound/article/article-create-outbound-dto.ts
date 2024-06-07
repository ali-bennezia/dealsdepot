export interface ArticleCreateOutboundDto {
  link: string;
  title: string;
  content: string;
  tags: string;
}

export function getFormData(
  dto: ArticleCreateOutboundDto,
  files: File[]
): FormData {
  let data = new FormData();
  data.append('link', dto.link);
  data.append('title', dto.title);
  data.append('content', dto.content);
  data.append('tags', dto.tags);
  for (let f of files) {
    data.append('files', f);
  }
  return data;
}
