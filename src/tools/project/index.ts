import { listProjects } from './list.js';
import { CodingDevOpsConfig } from '../../config/environment.js';

const definitions = [
  {
    name: 'list_projects',
    description: 'List current User projects in the CODING DevOps',
    inputSchema: {
      type: 'object',
      properties: {projectName: { type: 'string', description: '项目名称,模糊匹配' }},
      required: [],
    },
  },
];

export const projectTools = {
  initialize: (config: CodingDevOpsConfig) => ({
    listProjects: (args?: Record<string, unknown>) => listProjects(args, config),
    definitions,
  }),
  definitions,
};