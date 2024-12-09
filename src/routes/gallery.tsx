import { ImageGallery } from '@/components/image-gallery'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { request } from '@/utils/fetch'
import { GalleryItem } from '@/types/gallery.types'
export const Route = createFileRoute('/gallery')({
  component: RouteComponent
})

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await request.get<GalleryItem[]>('/upload/multiple')
      console.log(response, 'response')
      return response.data
    }
  })
  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-4">
        {/* <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">我们的精美图库</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          探索我们来自世界各地的精彩图片集。每张照片都讲述着独特的故事，捕捉了时间中的一个瞬间。向下滚动以发现更多！
        </p> */}
        <ImageGallery data={data} />
      </div>
    </main>
  )
}
