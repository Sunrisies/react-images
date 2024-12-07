import { ImageGallery } from '@/components/image-gallery';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          我们的精美图库
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          探索我们来自世界各地的精彩图片集。每张照片都讲述着独特的故事，捕捉了时间中的一个瞬间。向下滚动以发现更多！
        </p>
        <ImageGallery />
      </div>
    </main>
  );
}
