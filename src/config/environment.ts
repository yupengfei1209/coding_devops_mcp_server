import { env } from 'process';
import { ConfigurationError } from '../errors.js';

export interface CodingDevOpsConfig {
  token: string;
  project: string;
  apiUrl: string;
}

function validateConfigValue(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new ConfigurationError(
      `${name} is required and must be provided either through environment variables or constructor options`
    );
  }
  return value.trim();
}

export function createConfig(options?: Partial<CodingDevOpsConfig>): CodingDevOpsConfig {
  const PAT = validateConfigValue(
    options?.token ?? env.CODING_TOKEN,
    'Personal Access Token (token)'
  );
  const PROJECT = validateConfigValue(
    options?.project ?? env.PROJECT,
    'Project (project)'
  );

  return {
    token: PAT,
    project: PROJECT,
    apiUrl: `https://e.coding.net/open-api`,
  };
}