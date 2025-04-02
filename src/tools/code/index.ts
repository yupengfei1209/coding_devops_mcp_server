
import { listDepots } from './list.js';
import { CodingDevOpsConfig } from '../../config/environment.js';

const definitions = [
  {
    name: 'list_depots',
    description: '查询某项目的仓库列表',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: '项目ID',
        },
        PageNumber: {
          type: 'string',
          description: '分页查询的页数，默认为1',
        },
        PageSize: {
          type: 'string',
          description: '分页查询的大小，默认为20',
        }
      },
      required: ['projectId'],
    }
  },
];

export const codeTools = {
  initialize: (config: CodingDevOpsConfig) => ({
    listDepots: (args: { 
      projectId: string;
      PageNumber?: string;
      PageSize?: string;
    }) => listDepots(args, config),
    definitions,
  }),
  definitions,
};