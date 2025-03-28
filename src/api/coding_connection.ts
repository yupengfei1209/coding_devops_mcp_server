
import axios from 'axios';
import { CodingDevOpsConfig } from '../config/environment.js';

interface CodingUser {
  Id: number;
  Status: number;
  Email: string;
  GlobalKey: string;
  Name: string;
}

interface CodingProject {
  Id: number;
  Name: string;
  DisplayName: string;
  Description: string;
  Icon: string;
  CreatedAt: number;
  UpdatedAt: number;
}

interface CodingIssue {
  Type: string;
  Name: string;
  Description: string;
  Code: number;
  [key: string]: any; // 其他可能的字段
}

interface CodingUserResponse {
  Response: {
    User: CodingUser;
    RequestId: string;
  };
}

interface CodingProjectsResponse {
  Response: {
    ProjectList: CodingProject[];
    RequestId: string;
  };
}

interface CodingIssuesResponse {
  Response: {
    IssueList: CodingIssue[];
    RequestId: string;
  };
}

export class CodingConnection {
  private static instance: CodingConnection | null = null;
  private static config: CodingDevOpsConfig;
  private userId: number | null = null;

  private constructor(config: CodingDevOpsConfig) {
    CodingConnection.config = config;
  }

  public static initialize(config: CodingDevOpsConfig): void {
    CodingConnection.config = config;
    CodingConnection.instance = null;
  }

  public static getInstance(): CodingConnection {
    if (!this.config) {
      throw new Error('CodingConnection must be initialized with config before use');
    }

    if (!this.instance) {
      this.instance = new CodingConnection(this.config);
    }
    return this.instance;
  }

  private async getCurrentUser(): Promise<number> {
    if (this.userId) return this.userId;

    const response = await axios.post<CodingUserResponse>(
      CodingConnection.config.apiUrl,
      {
        Action: 'DescribeCodingCurrentUser'
      },
      {
        headers: {
          'Authorization': `token ${CodingConnection.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    this.userId = response.data.Response.User.Id;
    return this.userId;
  }

  public async listProjects(projectName?: string): Promise<CodingProject[]> {
    const userId = await this.getCurrentUser();

    const requestBody: Record<string, unknown> = {
      Action: 'DescribeUserProjects',
      UserId: userId
    };

    if (projectName) {
      requestBody.ProjectName = projectName;
    }

    const response = await axios.post<CodingProjectsResponse>(
      CodingConnection.config.apiUrl,
      requestBody,
      {
        headers: {
          'Authorization': `token ${CodingConnection.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.Response.ProjectList;
  }

  public async createIssue(params: {
    projectName: string;
    name: string;
    type: string;
    priority: string;
    description: string;
  }): Promise<CodingIssue> {
    const requestBody = {
      Action: 'CreateIssue',
      ProjectName: params.projectName,
      Name: params.name,
      Type: params.type,
      Priority: params.priority,
      Description: params.description
    };

    const response = await axios.post<{
      Response: {
        Issue: CodingIssue;
        RequestId: string;
      };
    }>(
      CodingConnection.config.apiUrl,
      requestBody,
      {
        headers: {
          'Authorization': `token ${CodingConnection.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.Response.Issue;
  }

  public async listIssues(params: {
    projectName: string;
    issueType?: string;
    limit?: string;
    offset?: string;
    sortKey?: string;
    sortValue?: string;
  }): Promise<CodingIssue[]> {
    const requestBody = {
      Action: 'DescribeIssueList',
      ProjectName: params.projectName,
      IssueType: params.issueType || 'ALL',
      Limit: params.limit || '20',
      Offset: params.offset || '0',
      SortKey: params.sortKey || 'UPDATED_AT',
      SortValue: params.sortValue || 'DESC'
    };

    const response = await axios.post<CodingIssuesResponse>(
      CodingConnection.config.apiUrl,
      requestBody,
      {
        headers: {
          'Authorization': `token ${CodingConnection.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    return response.data.Response.IssueList;
  }

  public async deleteIssue(params: {
    projectName: string;
    issueCode: number;
  }): Promise<void> {
    const requestBody = {
      Action: 'DeleteIssue',
      ProjectName: params.projectName,
      IssueCode: params.issueCode
    };

    await axios.post(
      CodingConnection.config.apiUrl,
      requestBody,
      {
        headers: {
          'Authorization': `token ${CodingConnection.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
  }
}
