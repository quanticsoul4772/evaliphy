import { EvalResponseImpl, StreamResponseImpl } from './response.js';
import { EvalResponse, MiddlewareFn, StreamResponse, Timings } from './types.js';

export class Transport {
  constructor(private middlewareChain: MiddlewareFn) {}

  async request(req: Request): Promise<EvalResponse> {
    const start = Date.now();
    const response = await this.middlewareChain(req);
    const ttfb = Date.now() - start;
    
    const timings: Timings = {
      ttfb,
      total: ttfb, // Initial total is same as ttfb for non-streaming
    };

    return new EvalResponseImpl(response, timings);
  }

  async stream(req: Request): Promise<StreamResponse> {
    const start = Date.now();
    const response = await this.middlewareChain(req);
    const ttfb = Date.now() - start;

    const timings: Timings = {
      ttfb,
      total: ttfb,
    };

    return new StreamResponseImpl(response, timings);
  }
}
