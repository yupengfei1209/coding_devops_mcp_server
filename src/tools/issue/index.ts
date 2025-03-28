
import { listIssues } from './list.js';
import { createIssue } from './create.js';
import { deleteIssue } from './delete.js';
import { CodingDevOpsConfig } from '../../config/environment.js';

const definitions = [
  {
    name: 'list_issues',
    description: '查询我最近更新的工作项，可以根据其中IssueType查询，默认查询limit为20条',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: '项目名称',
        },
        issueType: {
          type: 'string',
          description: '事项类型，可选值为： ALL - 全部事项 DEFECT - 缺陷 REQUIREMENT - 需求 MISSION - 任务 EPIC - 史诗',
        },
        limit: {
          type: 'string',
          description: '事项数量，默认为20条',
        }
      },
      required: ['projectName'],
    }
  },
  {
    name: 'create_issue',
    description: '创建新的工作项',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: '项目名称',
        },
        name: {
          type: 'string',
          description: '事项标题',
        },
        type: {
          type: 'string',
          description: '事项类型，可选值为： DEFECT - 缺陷 REQUIREMENT - 需求 MISSION - 任务 EPIC - 史诗',
        },
        priority: {
          type: 'string',
          description: '优先级，可选值为：0 - 低 1 - 中 2 - 高 3 - 紧急',
        },
        description: {
          type: 'string',
          description: '事项描述',
        }
      },
      required: ['projectName', 'name', 'type', 'priority', 'description'],
    }
  },
  {
    name: 'delete_issue',
    description: '删除工作项',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: '项目名称',
        },
        issueCode: {
          type: 'number',
          description: '事项编号',
        }
      },
      required: ['projectName', 'issueCode'],
    }
  }
];

export const issueTools = {
  initialize: (config: CodingDevOpsConfig) => ({
    listIssues: (args: { 
      projectName: string;
      issueType?: string;
      limit?: string;
    }) => listIssues(args, config),
    createIssue: (args: {
      projectName: string;
      name: string;
      type: string;
      priority: string;
      description: string;
    }) => createIssue (args, config),
    deleteIssue: (args: {
      projectName: string;
      issueCode: number;
    }) => deleteIssue(args, config),
    definitions,
  }),
  definitions,
};