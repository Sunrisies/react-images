import { galleryImages } from '@/data/gallery-images'
import { GalleryItem } from '@/types/gallery.types'
import { Image } from 'antd'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
const IMAGES_PER_PAGE = 12

export const ImageGallery: React.FC<{ data: GalleryItem[] }> = ({ data }) => {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [page, setPage] = useState(1)
  const loaderRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const newImages = data.slice(0, page * IMAGES_PER_PAGE)
    setImages(newImages)
  }, [page])


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">图片画廊</h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {images.map((image) => (
          <motion.div
            key={image.url}
            className="relative aspect-square overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105 group hover:shadow-lg hover:transition-transform"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Image src={image.url} alt={image.url} loading="lazy" />
            <motion.div
              className="absolute bottom-0 left-0 right-0 opacity-0 bg-black bg-opacity-0 flex items-center justify-center group-hover:opacity-100 group-hover:bg-opacity-50"
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-sm p-2 text-center">{image.url}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      {images.length < galleryImages.length && <div ref={loaderRef} className="h-10 mt-8" />}
    </div>
  )
}
