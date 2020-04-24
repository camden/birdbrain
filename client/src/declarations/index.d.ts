declare module 'react-fastclick';
declare module '@kennethormandy/react-fittext';
declare module 'react-textfit';
declare module 'string-to-color';
declare module 'humaninput/dist/humaninput-1.1.15-full.min';
declare module 'humaninput/dist/humaninput-1.1.15-full';

interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): void;
}

declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(name: string): void;
