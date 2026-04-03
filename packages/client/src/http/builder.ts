import { HttpClientConfig, RequestOptions } from './types.js';

export class RequestBuilder {
  constructor(private config: HttpClientConfig) {}

  build(
    method: string,
    url: string,
    payload?: any,
    options: RequestOptions = {}
  ): Request {
    const fullUrl = new URL(url, this.config.baseUrl);

    const headers = new Headers(this.config.headers);
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers.set(key, String(value));
      });
    }

    const sessionId = options.sessionId;
    if (sessionId) {
      if (options.sessionKey) {
        headers.set(options.sessionKey, sessionId);
      }

      headers.set('x-session-id', sessionId);
    }

    const body = payload ? JSON.stringify(payload) : undefined;
    if (body && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    return new Request(fullUrl.toString(), {
      method,
      headers,
      body,
    });
  }
}
