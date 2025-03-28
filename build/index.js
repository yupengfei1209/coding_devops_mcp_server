#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
// 导入所有工具
import { issueTools } from './tools/issue/index.js';
import { projectTools } from './tools/project/index.js';
import { createConfig } from './config/environment.js';
// 类型验证
function validateArgs(args, errorMessage) {
    if (!args) {
        throw new McpError(ErrorCode.InvalidParams, errorMessage);
    }
    return args;
}
// 响应格式化
function formatResponse(data) {
    if (data && typeof data === 'object' && 'content' in data) {
        return data;
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}
// 服务器
class CodingDevOpsServer {
    server;
    config;
    toolDefinitions;
    constructor(options) {
        this.config = createConfig(options);
        // 使用配置初始化工具
        const toolInstances = {
            issue: issueTools.initialize(this.config),
            project: projectTools.initialize(this.config),
        };
        // 合并所有工具定义
        this.toolDefinitions = [
            ...toolInstances.issue.definitions,
            ...toolInstances.project.definitions,
        ];
        this.server = new Server({
            name: 'coding-devops-mcp-server',
            version: '0.1.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers(toolInstances);
        // 错误处理
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers(tools) {
        // 列出可用工具
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: this.toolDefinitions,
        }));
        // 处理工具调用
        this.server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
            try {
                let result;
                switch (request.params.name) {
                    // 项目工具
                    case 'list_projects':
                        result = await tools.project.listProjects(request.params.arguments);
                        break;
                    // 工作项工具
                    case 'list_work_items':
                        result = await tools.issue.listIssues(request.params.arguments);
                        break;
                    case 'create_work_item':
                        result = await tools.issue.createIssue(request.params.arguments);
                        break;
                    case 'delete_work_item':
                        result = await tools.issue.deleteIssue(request.params.arguments);
                        break;
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `未知工具: ${request.params.name}`);
                }
                // 确保响应格式一致
                const response = formatResponse(result);
                return {
                    _meta: request.params._meta,
                    ...response
                };
            }
            catch (error) {
                if (error instanceof McpError)
                    throw error;
                const errorMessage = error instanceof Error ? error.message : '未知错误';
                throw new McpError(ErrorCode.InternalError, `CODING DevOps API 错误: ${errorMessage}`);
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('CODING DevOps MCP 服务器正在通过 stdio 运行');
    }
}
// 允许通过构造函数或环境变量进行配置
const server = new CodingDevOpsServer();
server.run().catch(console.error);
