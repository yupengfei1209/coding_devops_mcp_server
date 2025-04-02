import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { CodingConnection } from '../../api/coding_connection.js';
export async function listProjects(args, config) {
    CodingConnection.initialize(config);
    const connection = CodingConnection.getInstance();
    try {
        const projectName = args?.projectName;
        const projects = await connection.listProjects(projectName);
        return {
            content: [
                {
                    type: 'text',
                    text: `**Projects**\n${projects.map(project => `- **${project.Name}** (${project.DisplayName || 'No display name'})
          - ID: ${project.Id || 'N/A'}
          - Description: ${project.Description || 'No description provided'}\n`).join('\n')}`,
                },
            ],
        };
    }
    catch (error) {
        if (error instanceof McpError)
            throw error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new McpError(ErrorCode.InternalError, `Failed to list projects: ${errorMessage}`);
    }
}
