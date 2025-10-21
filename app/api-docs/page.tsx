'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function ApiDocsPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    if (isScriptLoaded && typeof window !== 'undefined') {
      const SwaggerUIBundle = (window as any).SwaggerUIBundle

      if (SwaggerUIBundle) {
        SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
        })
      }
    }
  }, [isScriptLoaded])

  return (
    <>
      {/* Load Swagger UI CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
      />

      <div className="min-h-screen bg-white">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              B2B Credit API Documentation
            </h1>
            <p className="text-gray-600">
              Interactive API documentation powered by Swagger UI
            </p>
          </div>

          {/* Swagger UI Container */}
          <div id="swagger-ui"></div>
        </div>
      </div>

      {/* Load Swagger UI from CDN using Next.js Script component */}
      <Script
        src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
    </>
  )
}
