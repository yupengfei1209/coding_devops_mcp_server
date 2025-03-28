# CODING DevOps MCP Server

CODING DevOps MCP Server 是一个基于 Model Context Protocol (MCP) 的服务器实现，用于与 CODING DevOps 平台进行交互。它提供了一套标准化的接口，使得用户可以方便地管理 CODING 平台上的项目和工作项。

## 功能特性

- 项目管理
  - 列出用户可访问的项目
  - 按项目名称搜索项目
- 工作项（Issues）管理
  - 创建工作项
  - 列出工作项
  - 删除工作项
  - 支持工作项类型、优先级等属性设置

## 安装

1. Clone this repository:
```bash
git clone https://github.com/yupengfei1209/coding_devops_mcp_server.git
cd coding_devops_mcp_server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## 配置

服务器需要以下配置项：

1. CODING Personal Access Token (必需)
2. 项目名称 (可选)


### 添加到 MCP Client

```json
{
  "mcpServers": {
    "coding-devops": {
      "command": "node",
      "args": [
        "/your_path/coding_devops_mcp_server/build/index.js"
      ],
      "env": {
        "CODING_TOKEN": "coding-token",
        "PROJECT": "default project" // 默认项目,可选配置
      },
      "disabled": false,
      "autoApprove": []
    },
  }
}
```



## 功能

### 项目管理

- `list_projects`: 列出用户可访问的项目
  ```typescript
  // 可选参数
  {
    projectName?: string; // 按项目名称筛选
  }
  ```

### 工作项管理

- `list_work_items`: 列出工作项
  ```typescript
  // 参数
  {
    projectName: string;
    issueType?: string;
    limit?: string;
    offset?: string;
    sortKey?: string;
    sortValue?: string;
  }
  ```

- `create_work_item`: 创建工作项
  ```typescript
  // 参数
  {
    projectName: string;
    name: string;
    type: string;
    priority: string;
    description: string;
  }
  ```

- `delete_work_item`: 删除工作项
  ```typescript
  // 参数
  {
    projectName: string;
    issueCode: number;
  }
  ```

## 开发

### 项目结构

```
src/
├── api/               # API 实现
├── config/            # 配置相关
├── tools/            # 工具实现
│   ├── issue/        # 工作项相关功能
│   └── project/      # 项目相关功能
├── errors.ts         # 错误定义
└── index.ts         # 主入口文件
```

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。