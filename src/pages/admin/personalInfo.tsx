import { Layout } from '@/layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/personalInfo')({
  component: RouteComponent
})

// 用户信息类型定义
interface UserInfo {
  username: string
  email?: string // 邮箱地址（可选）
  phone?: string // 手机号（可选）
  avatar?: string // 头像URL（可选）
}

function RouteComponent() {
  // 模拟用户数据
  const user: UserInfo = {
    username: '张三',
    email: 'zhangsan@example.com', // 模拟邮箱已绑定
    // phone: '13800138000', // 模拟手机号未绑定
    avatar: 'https://example.com/avatar.jpg' // 模拟用户头像
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">个人设置</h1>

        {/* 头像显示 */}
        {user.avatar && (
          <div className="mb-4">
            <img src={user.avatar} alt="用户头像" className="w-24 h-24 rounded-full" />
          </div>
        )}

        {/* 用户名 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">用户名</label>
          <p className="mt-1 text-lg">{user.username}</p>
        </div>

        {/* 邮箱地址 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
          {user.email ? (
            <p className="mt-1 text-lg">{user.email}</p>
          ) : (
            <div className="mt-1">
              <p className="text-lg text-red-500">未绑定邮箱，请前往绑定</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  // 跳转到绑定邮箱页面
                  window.location.href = '/bind-email'
                }}
              >
                绑定邮箱
              </button>
            </div>
          )}
        </div>

        {/* 手机号 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">手机号</label>
          {user.phone ? (
            <p className="mt-1 text-lg">{user.phone}</p>
          ) : (
            <div className="mt-1">
              <p className="text-lg text-red-500">未绑定手机号，请前往绑定</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  // 跳转到绑定手机号页面
                  window.location.href = '/bind-phone'
                }}
              >
                绑定手机号
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
