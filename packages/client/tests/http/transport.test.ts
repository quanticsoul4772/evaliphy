import { describe, expect, it, vi } from 'vitest';
import { EvalResponseImpl, StreamResponseImpl } from '../../src/http/response.js';
import { Transport } from '../../src/http/transport.js';

describe('Transport', () => {
  it('should perform a request and return EvalResponse', async () => {
    const middlewareChain = vi.fn().mockResolvedValue(new Response('ok'));
    const transport = new Transport(middlewareChain);
    const req = new Request('https://test.com');

    const res = await transport.request(req);

    expect(middlewareChain).toHaveBeenCalledWith(req);
    expect(res).toBeInstanceOf(EvalResponseImpl);
    expect(res.timings.ttfb).toBeDefined();
  });

  it('should perform a stream request and return StreamResponse', async () => {
    const middlewareChain = vi.fn().mockResolvedValue(new Response('ok'));
    const transport = new Transport(middlewareChain);
    const req = new Request('https://test.com');

    const res = await transport.stream(req);

    expect(middlewareChain).toHaveBeenCalledWith(req);
    expect(res).toBeInstanceOf(StreamResponseImpl);
    expect(res.timings.ttfb).toBeDefined();
  });
});
