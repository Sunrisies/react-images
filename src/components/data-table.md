我来为这个 DataTable 组件编写一个详细的文档：

# DataTable 组件文档

## 概述

DataTable 是一个功能完整的表格组件，集成了搜索、分页、操作等功能，适用于展示和管理列表数据。

## 特性

- 🔍 内置搜索功能
- 📄 集成分页组件
- 🎨 支持自定义列渲染
- 🔧 灵活的操作按钮配置
- 📱 响应式设计
- 🎯 完整的 TypeScript 支持
- ⚡ 优化的加载状态处理

## API 参考

### Props

| 属性       | 类型               | 默认值 | 说明           |
| ---------- | ------------------ | ------ | -------------- |
| columns    | `Column<T>[]`      | -      | 表格列配置     |
| data       | `T[]`              | -      | 表格数据源     |
| loading    | `boolean`          | false  | 加载状态       |
| pagination | `PaginationConfig` | -      | 分页配置       |
| search     | `SearchConfig`     | -      | 搜索配置       |
| actions    | `ActionsConfig`    | -      | 操作列配置     |
| className  | `string`           | -      | 自定义样式类名 |

### 类型定义

```typescript
interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface PaginationConfig {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

interface SearchConfig {
  placeholder?: string;
  onSearch: (value: string) => void;
}

interface ActionsConfig<T> {
  title?: string;
  render: (record: T) => React.ReactNode;
}
```

## 使用示例

### 基础用法

```tsx
import { DataTable } from "@/components/data-table";

const columns = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "名称",
  },
];

function MyComponent() {
  return <DataTable columns={columns} data={data} />;
}
```

### 带搜索和分页

```tsx
function MyComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  return (
    <DataTable
      columns={columns}
      data={data}
      search={{
        placeholder: "搜索...",
        onSearch: setSearch,
      }}
      pagination={{
        current: page,
        total: 100,
        pageSize: 10,
        onChange: setPage,
      }}
    />
  );
}
```

### 自定义列渲染

```tsx
const columns = [
  {
    key: "status",
    title: "状态",
    render: (value) => (
      <span className={`status-${value}`}>
        {value === "active" ? "激活" : "禁用"}
      </span>
    ),
  },
];
```

### 带操作按钮

```tsx
function MyComponent() {
  const handleEdit = (record) => {
    // 编辑逻辑
  };

  const handleDelete = (record) => {
    // 删除逻辑
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      actions={{
        title: "操作",
        render: (record) => (
          <>
            <Button onClick={() => handleEdit(record)}>编辑</Button>
            <Button onClick={() => handleDelete(record)}>删除</Button>
          </>
        ),
      }}
    />
  );
}
```

### 完整示例

```tsx
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
}

function UserList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const columns = [
    {
      key: "id",
      title: "ID",
    },
    {
      key: "name",
      title: "姓名",
    },
    {
      key: "email",
      title: "邮箱",
    },
    {
      key: "status",
      title: "状态",
      render: (value: string) => (
        <span className={`status-${value}`}>
          {value === "active" ? "激活" : "禁用"}
        </span>
      ),
    },
  ];

  return (
    <DataTable<User>
      columns={columns}
      data={users}
      loading={loading}
      search={{
        placeholder: "搜索用户...",
        onSearch: (value) => {
          setSearch(value);
          setPage(1);
        },
      }}
      actions={{
        title: "操作",
        render: (record) => (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/users/${record.id}` })}
            >
              查看
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
          </>
        ),
      }}
      pagination={{
        current: page,
        total: total,
        pageSize: 10,
        onChange: (newPage) => {
          setPage(newPage);
          navigate({
            search: { page: newPage, search },
          });
        },
      }}
    />
  );
}
```

## 最佳实践

1. **数据类型定义**

   - 始终为表格数据定义明确的接口
   - 使用 TypeScript 泛型确保类型安全

2. **性能优化**

   - 对于大数据量，考虑实现虚拟滚动
   - 使用 React.memo 优化渲染性能

3. **样式定制**

   - 通过 className 属性自定义样式
   - 使用 CSS 变量实现主题定制

4. **错误处理**
   - 实现错误边界处理异常情况
   - 添加空状态提示

## 注意事项

1. 确保数据源中的字段名与 columns 中的 key 匹配
2. 分页时注意更新 URL 参数
3. 搜索功能建议添加防抖处理
4. 操作按钮建议添加确认提示

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础表格功能
- 集成搜索和分页
- 支持自定义操作按钮

---

这个文档涵盖了组件的所有主要功能和使用场景，你可以根据需要进行调整和补充。需要添加其他内容吗？
