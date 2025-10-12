'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface UploadedImage {
  url: string
  filename: string
  originalName: string
  size: number
  type: string
  uploadedAt?: string
}

interface ImageManagerProps {
  onImageSelect: (url: string) => void
  editor?: any
}

export default function ImageManager({ onImageSelect, editor }: ImageManagerProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showModal) {
      fetchImages()
    }
  }, [showModal])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/upload/image')

      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      } else {
        console.error('Failed to fetch images')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (image: UploadedImage) => {
    onImageSelect(image.url)

    if (editor) {
      editor.chain().focus().setImage({ src: image.url }).run()
    }

    setShowModal(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded hover:bg-white/10"
        title="Image Library"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>

      {/* Image Library Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <h3 className="text-xl font-semibold text-white">Image Library</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-white/70">Loading images...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/70 mb-4">No images uploaded yet</p>
                  <p className="text-white/50 text-sm">Use the image upload button to add images to your content</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => handleImageSelect(image)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={image.url}
                          alt={image.originalName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-white text-center">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-sm">Insert</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <p className="text-white/90 text-sm font-medium truncate" title={image.originalName}>
                          {image.originalName}
                        </p>
                        <p className="text-white/50 text-xs">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/20 flex justify-between items-center">
              <p className="text-white/60 text-sm">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}