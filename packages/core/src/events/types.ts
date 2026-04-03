import {
  ConfigResolvedPayload,
  HookEndPayload,
  HookFailPayload,
  HookStartPayload,
  RunEndPayload,
  RunStartPayload,
  TestFailPayload,
  TestPassPayload,
  TestRetryPayload,
  TestStartPayload,
  DiscoveryStartPayload,
  DiscoveryFilePayload,
  DiscoveryEndPayload,
} from './payloads.js';

export interface EvaliphyReporter {
  name: string;
  onRunStart?: (payload: RunStartPayload) => void | Promise<void>;
  onTestStart?: (payload: TestStartPayload) => void | Promise<void>;
  onTestPass?: (payload: TestPassPayload) => void | Promise<void>;
  onTestFail?: (payload: TestFailPayload) => void | Promise<void>;
  onTestRetry?: (payload: TestRetryPayload) => void | Promise<void>;
  onRunEnd?: (payload: RunEndPayload) => void | Promise<void>;
  onDiscoveryStart?: (payload: DiscoveryStartPayload) => void | Promise<void>;
  onDiscoveryFile?: (payload: DiscoveryFilePayload) => void | Promise<void>;
  onDiscoveryEnd?: (payload: DiscoveryEndPayload) => void | Promise<void>;
}

export type EvaliphyEvent =
  | { type: 'run:start'; payload: RunStartPayload }
  | { type: 'run:end'; payload: RunEndPayload }
  | { type: 'test:start'; payload: TestStartPayload }
  | { type: 'test:pass'; payload: TestPassPayload }
  | { type: 'test:fail'; payload: TestFailPayload }
  | { type: 'test:retry'; payload: TestRetryPayload }
  | { type: 'hook:start'; payload: HookStartPayload }
  | { type: 'hook:end'; payload: HookEndPayload }
  | { type: 'hook:fail'; payload: HookFailPayload }
  | { type: 'config:resolved'; payload: ConfigResolvedPayload }
  | { type: 'discovery:start'; payload: DiscoveryStartPayload }
  | { type: 'discovery:file'; payload: DiscoveryFilePayload }
  | { type: 'discovery:end'; payload: DiscoveryEndPayload };

export type EventType = EvaliphyEvent['type'];

export type ExtractPayload<T extends EventType> = Extract<
  EvaliphyEvent,
  { type: T }
>['payload'];

export type EventListener<T extends EventType> = (
  payload: ExtractPayload<T>
) => void | Promise<void>;
