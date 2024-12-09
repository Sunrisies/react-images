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
        <ImageGallery data={data} />
      </div>
    </main>
  )
}
