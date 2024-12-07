import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryImages, GalleryImage } from '@/data/gallery-images'
import { Image } from 'antd'
const IMAGES_PER_PAGE = 12

export const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [page, setPage] = useState(1)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
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
    const newImages = galleryImages.slice(0, page * IMAGES_PER_PAGE)
    setImages(newImages)
  }, [page])

  const openLightbox = (image: GalleryImage) => setSelectedImage(image)
  const closeLightbox = () => setSelectedImage(null)

  const goToPrevious = () => {
    const currentIndex = images.findIndex((img) => img.id === selectedImage?.id)
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setSelectedImage(images[prevIndex])
  }

  const goToNext = () => {
    const currentIndex = images.findIndex((img) => img.id === selectedImage?.id)
    const nextIndex = (currentIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
  }

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
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105 group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            <Image src={image.src} alt={image.alt} loading="lazy" />
            <motion.div
              className="absolute bottom-0 left-0 right-0 opacity-0 bg-black bg-opacity-0 flex items-center justify-center group-hover:opacity-100 group-hover:bg-opacity-50"
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-sm p-2 text-center">{image.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      {images.length < galleryImages.length && <div ref={loaderRef} className="h-10 mt-8" />}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white" onClick={goToPrevious}>
                &#10094;
              </button>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white" onClick={goToNext}>
                &#10095;
              </button>
              <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto" />
              <p className="mt-4 text-center text-lg text-white">{selectedImage.description}</p>
              <button className="absolute right-4 top-4 text-white text-2xl" onClick={closeLightbox}>
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
