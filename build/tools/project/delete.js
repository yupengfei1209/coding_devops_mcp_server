import { CodingConnection } from '../../api/coding_connection.js';
export async function deleteProject(args, config) {
    CodingConnection.initialize(config);
    const connection = CodingConnection.getInstance();
    await connection.deleteProject({
        ProjectId: args.projectId
    });
    return {
        content: [
            {
                type: 'text',
                text: `Successfully deleted project with ID: ${args.projectId}`,
            },
        ],
    };
}
