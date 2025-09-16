/**
 * HTTP Types
 * Type definitions for HTTP request and response objects
 */

export interface HttpRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string>;
  user?: any;
}

export interface HttpResponse {
  status: (code: number) => HttpResponse;
  json: (data: any) => HttpResponse;
  send: (data: any) => HttpResponse;
  end: () => void;
  locals?: Record<string, any>;
}