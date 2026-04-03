import { describe, expect, it } from 'vitest';
import { EvalResponseImpl, StreamResponseImpl } from '../../src/http/response.js';

describe('Response', () => {
  describe('EvalResponseImpl', () => {
    it('should wrap a standard Response', async () => {
      const raw = new Response(JSON.stringify({ foo: 'bar' }), {
        status: 201,
        headers: { 'X-Test': 'test' }
      });
      const timings = { ttfb: 10, total: 20 };
      const res = new EvalResponseImpl(raw, timings);

      expect(res.status).toBe(201);
      expect(res.headers.get('X-Test')).toBe('test');
      expect(await res.json()).toEqual({ foo: 'bar' });
      expect(res.timings).toEqual(timings);
    });
  });

  describe('StreamResponseImpl', () => {
    it('should handle non-SSE streams', async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"text": "a"}\n'));
          controller.enqueue(new TextEncoder().encode('{"text": "b"}\n'));
          controller.close();
        }
      });
      const raw = new Response(stream);
      const res = new StreamResponseImpl(raw, { ttfb: 10, total: 10 });

      const chunks = [];
      for await (const chunk of res) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([{ text: 'a' }, { text: 'b' }]);
    });

    it('should handle SSE streams', async () => {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"text": "a"}\n\n'));
          controller.enqueue(new TextEncoder().encode('data: {"text": "b"}\n\n'));
          controller.close();
        }
      });
      const raw = new Response(stream);
      const res = new StreamResponseImpl(raw, { ttfb: 10, total: 10 });

      const chunks = [];
      for await (const chunk of res) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual([{ text: 'a' }, { text: 'b' }]);
    });
  });
});
