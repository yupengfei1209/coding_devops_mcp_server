import axios from 'axios';
export class CodingConnection {
    static instance = null;
    static config;
    userId = null;
    constructor(config) {
        CodingConnection.config = config;
    }
    static initialize(config) {
        CodingConnection.config = config;
        CodingConnection.instance = null;
    }
    static getInstance() {
        if (!this.config) {
            throw new Error('CodingConnection must be initialized with config before use');
        }
        if (!this.instance) {
            this.instance = new CodingConnection(this.config);
        }
        return this.instance;
    }
    async getCurrentUser() {
        if (this.userId)
            return this.userId;
        const response = await axios.post(CodingConnection.config.apiUrl, {
            Action: 'DescribeCodingCurrentUser'
        }, {
            headers: {
                'Authorization': `token ${CodingConnection.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        this.userId = response.data.Response.User.Id;
        return this.userId;
    }
    async listProjects(projectName) {
        const userId = await this.getCurrentUser();
        const requestBody = {
            Action: 'DescribeUserProjects',
            UserId: userId
        };
        if (projectName) {
            requestBody.ProjectName = projectName;
        }
        const response = await axios.post(CodingConnection.config.apiUrl, requestBody, {
            headers: {
                'Authorization': `token ${CodingConnection.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data.Response.ProjectList;
    }
    async createIssue(params) {
        const requestBody = {
            Action: 'CreateIssue',
            ProjectName: params.projectName,
            Name: params.name,
            Type: params.type,
            Priority: params.priority,
            Description: params.description
        };
        const response = await axios.post(CodingConnection.config.apiUrl, requestBody, {
            headers: {
                'Authorization': `token ${CodingConnection.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data.Response.Issue;
    }
    async listIssues(params) {
        const requestBody = {
            Action: 'DescribeIssueList',
            ProjectName: params.projectName,
            IssueType: params.issueType || 'ALL',
            Limit: params.limit || '20',
            Offset: params.offset || '0',
            SortKey: params.sortKey || 'UPDATED_AT',
            SortValue: params.sortValue || 'DESC'
        };
        const response = await axios.post(CodingConnection.config.apiUrl, requestBody, {
            headers: {
                'Authorization': `token ${CodingConnection.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data.Response.IssueList;
    }
    async deleteIssue(params) {
        const requestBody = {
            Action: 'DeleteIssue',
            ProjectName: params.projectName,
            IssueCode: params.issueCode
        };
        await axios.post(CodingConnection.config.apiUrl, requestBody, {
            headers: {
                'Authorization': `token ${CodingConnection.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }
}
