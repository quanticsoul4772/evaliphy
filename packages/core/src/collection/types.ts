import { z } from 'zod';

/**
 * Represents a value that may be a promise or a direct value.
 */
export type Awaitable<T> = Promise<T> | T;

/**
 * Performance metrics for an evaluation request.
 */
export interface Timings {
  /** Time to first byte in milliseconds. */
  ttfb: number;
  /** Total request duration in milliseconds. */
  total: number;
  /** Time until the last chunk was received in milliseconds (streaming only). */
  streamEnd?: number;
}

/**
 * Represents a standard response from the evaluation HTTP client.
 */
export interface EvalResponse {
  /** The HTTP status code (e.g., 200, 404). */
  status: number;
  /** The response headers. */
  headers: Headers;
  /** Performance timings for the request, including TTFB and total duration. */
  timings: Timings;
  /** Parse the response body as JSON. */
  json<T = unknown>(): Promise<T>;
  /** Parse the response body as raw text. */
  text(): Promise<string>;
  /**
   * The underlying Fetch Response object.
   *
   * @note If you console.log this property, it may appear as an empty object `{}`
   * in some environments because it is a native stream-based object.
   * Use `.json()` or `.text()` to access the results.
   */
  raw: Response;
}

/**
 * A single chunk of data from a streaming response.
 */
export interface StreamChunk {
  /** The text content of the chunk. */
  text: string;
  [key: string]: any;
}

/**
 * Represents a streaming response from the evaluation HTTP client.
 * Supports async iteration for streaming chunks.
 */
export interface StreamResponse {
  /** Performance timings including stream completion. */
  timings: Timings;
  /** Iterate over incoming chunks of data. */
  [Symbol.asyncIterator](): AsyncIterator<StreamChunk>;
  /** Collect all stream chunks into a single concatenated string. */
  collect(): Promise<string>;
}

/**
 * Options to customize a single HTTP request.
 */
export interface RequestOptions {
  /** Optional session ID to be sent with the request (overrides global session). */
  sessionId?: string;
  sessionKey?: string;
  /** Additional HTTP headers. */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds. */
  timeout?: number;
  /** Retry configuration for the request. */
  retry?: {
    /** Number of retry attempts. */
    attempts: number;
    /** Delay between retries in milliseconds. */
    delay: number;
  };
}

/**
 * Interface for the Evaliphy HTTP client provided in test fixtures.csv.
 *
 * This client is optimized for testing RAG applications and LLM backends.
 * It automatically handles common concerns like JSON serialization, retries,
 * timeouts, and session management.
 */
export interface IHttpClient {
  /**
   * Sends a POST request with a JSON payload.
   *
   * @example
   * ```typescript
   * const response = await httpClient.post('/v1/chat', { message: 'hello' });
   * const data = await response.json();
   * ```
   */
  post(url: string, payload: any, options?: RequestOptions): Promise<EvalResponse>;

  /**
   * Sends a GET request to the specified endpoint.
   *
   * @example
   * ```typescript
   * const response = await httpClient.get('/health');
   * if (response.status === 200) { ... }
   * ```
   */
  get(url: string, options?: RequestOptions): Promise<EvalResponse>;

  /**
   * Sends a PUT request with a JSON payload.
   */
  put(url: string, payload: any, options?: RequestOptions): Promise<EvalResponse>;

  /**
   * Sends a PATCH request with a JSON payload.
   */
  patch(url: string, payload: any, options?: RequestOptions): Promise<EvalResponse>;

  /**
   * Sends a DELETE request.
   */
  delete(url: string, options?: RequestOptions): Promise<EvalResponse>;

  /**
   * Initiates a streaming request, typically used for Server-Sent Events (SSE)
   * or real-time LLM completions.
   *
   * @example
   * ```typescript
   * const stream = await httpClient.stream('/v1/completions', { prompt: '...' });
   * for await (const chunk of stream) {
   *   console.log(chunk.text);
   * }
   * ```
   */
  stream(url: string, payload: any, options?: RequestOptions): Promise<StreamResponse>;

  /**
   * Creates a new client instance scoped to a specific session.
   * All subsequent requests from the returned client will include the provided
   * session header, which is essential for evaluating multi-turn conversations.
   *
   * @param sessionKey - The header name used for session tracking (e.g., 'X-Session-Id').
   * @param sessionId - The unique identifier for the session.
   *
   * @example
   * ```typescript
   * const sessionClient = httpClient.withSession('x-eval-id', 'user-123');
   * await sessionClient.post('/chat', { ... }); // Includes x-eval-id header
   * ```
   */
  withSession(sessionKey:string, sessionId: string): IHttpClient;
}

/**
 * The set of fixtures.csv available to an evaluation test function.
 */
export interface EvaluationFixtures {
  /** The pre-configured HTTP client for interacting with RAG endpoints. */
  httpClient: IHttpClient;
  /** The pre-configured LLM client for generating responses and objects. */
  llmClient: ILLMClient;
}

/**
 * Internal representation of an evaluation test case.
 */
export interface EvalTest {
  kind: 'test';
  name: string;
  fn: (fixtures: EvaluationFixtures) => Awaitable<void>;
}

export interface LLMUsage {
  totalTokens: number;
  model: string;
  provider: string;
  durationMs: number;
}

export interface LLMResponse {
  response: string;
  llmUsages: LLMUsage;
  model: string;
}

export interface LLMObjectResponse<T> {
  object: T;
  llmUsages: LLMUsage;
  model: string;
}

export interface ILLMClient {
  generate(prompt: string): Promise<LLMResponse>;
  generateObject<T>(prompt: string, schema: z.ZodType<T>): Promise<LLMObjectResponse<T>>;
}
