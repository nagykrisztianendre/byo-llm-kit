declare module "replicate" {
  export interface ReplicateOptions {
    auth: string;
  }

  export interface ReplicateRunOptions {
    input: Record<string, unknown>;
  }

  export default class Replicate {
    constructor(options: ReplicateOptions);
    run(model: string, options: ReplicateRunOptions): Promise<unknown>;
  }
}
