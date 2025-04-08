
import { listDepots } from './list.js';
import { createMergeRequest } from './merge_request.js';
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
  {
    name: 'create_merge_request',
    description: '创建合并请求。需要提供工作目录路径，会自动从指定目录的 Git 仓库获取仓库信息。如果不指定源分支，将使用当前分支；如果不指定目标分支，将使用 master。仓库路径会自动从 Git 远程仓库地址中解析。',
    inputSchema: {
      type: 'object',
      properties: {
        workingDirectory: {
          type: 'string',
          description: '工作目录路径，指定要创建合并请求的 Git 仓库目录',
        },
        title: {
          type: 'string',
          description: '合并请求标题',
        },
        content: {
          type: 'string',
          description: '合并请求的详情描述',
        },
        srcBranch: {
          type: 'string',
          description: '（可选）源分支名称，如不提供将使用当前分支',
        },
        destBranch: {
          type: 'string',
          description: '（可选）目标分支名称，如不提供将使用 master',
        }
      },
      required: ['workingDirectory', 'title', 'content'],
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
    createMergeRequest: (args: {
      workingDirectory: string;
      title: string;
      content: string;
      srcBranch?: string;
      destBranch?: string;
    }) => createMergeRequest(args, config),
    definitions,
  }),
  definitions,
};