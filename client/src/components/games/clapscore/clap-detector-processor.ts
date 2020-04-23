class ClapDetectorProcessor extends AudioWorkletProcessor {
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ) {}
}

registerProcessor('clap-detector-processor');

export default ClapDetectorProcessor;
