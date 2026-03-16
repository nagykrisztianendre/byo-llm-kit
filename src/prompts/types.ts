export type PromptArgs = object;

export type PromptBuilder<TArgs extends PromptArgs> = (args: TArgs) => string;

export interface PromptMeta<TName extends string = string> {
  name: TName;
  version: string;
  description: string;
}

export interface PromptDefinition<
  TName extends string = string,
  TArgs extends PromptArgs = PromptArgs,
> {
  name: TName;
  version: string;
  description: string;
  build: PromptBuilder<TArgs>;
}

export type PromptVersionRegistry = Record<
  string,
  PromptDefinition<string, any>
>;

export type PromptRegistry = Record<string, PromptVersionRegistry>;
