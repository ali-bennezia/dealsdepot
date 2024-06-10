import { environment } from 'src/environments/environment';

export function getMediaLink(fileName: string): string {
  return `${environment.backendUri}/content/image/${fileName}`;
}
