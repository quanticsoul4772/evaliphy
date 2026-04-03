import { describe, expect, it } from 'vitest';
import { RequestBuilder } from '../../src/http/builder.js';

describe('RequestBuilder', () => {
  const config = {
    baseUrl: 'https://api.example.com',
    headers: { 'X-Default': 'default' },
  };

  it('should build a basic request', () => {
    const builder = new RequestBuilder(config);
    const request = builder.build('GET', '/test');

    expect(request.url).toBe('https://api.example.com/test');
    expect(request.method).toBe('GET');
    expect(request.headers.get('X-Default')).toBe('default');
  });

  it('should merge headers correctly', () => {
    const builder = new RequestBuilder(config);
    const request = builder.build('POST', '/test', { foo: 'bar' }, {
      headers: { 'X-Custom': 'custom', 'X-Default': 'override' }
    });

    expect(request.headers.get('X-Default')).toBe('override');
    expect(request.headers.get('X-Custom')).toBe('custom');
    expect(request.headers.get('Content-Type')).toBe('application/json');
  });

  it('should handle session ID', () => {
    const builder = new RequestBuilder(config);
    const request = builder.build('GET', '/test', undefined, { sessionId: '123' });

    expect(request.headers.get('x-session-id')).toBe('123');
  });

  it('should handle absolute URLs', () => {
    const builder = new RequestBuilder(config);
    const request = builder.build('GET', 'https://other.com/api');

    expect(request.url).toBe('https://other.com/api');
  });
});
