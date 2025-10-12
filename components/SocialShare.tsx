'use client'

import { useState } from 'react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  variant?: 'horizontal' | 'vertical' | 'floating'
  className?: string
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  variant = 'horizontal',
  className = ''
}) => {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?title=${encodedTitle}&url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform]
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const baseClasses = 'inline-flex items-center justify-center transition-colors'

  if (variant === 'floating') {
    return (
      <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-3 ${className}`}>
        {Object.entries(shareLinks).map(([platform, link]) => (
          <button
            key={platform}
            onClick={() => handleShare(platform as keyof typeof shareLinks)}
            className={`${baseClasses} w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl`}
            title={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
          >
            <SocialIcon platform={platform} />
          </button>
        ))}

        <button
          onClick={handleCopyLink}
          className={`${baseClasses} w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl`}
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col space-y-3 ${className}`}>
        <p className="text-sm font-medium text-white/90 text-center mb-2">Share this post</p>
        <div className="flex flex-col space-y-2">
          {Object.entries(shareLinks).map(([platform, link]) => (
            <button
              key={platform}
              onClick={() => handleShare(platform as keyof typeof shareLinks)}
              className={`${baseClasses} w-full px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium`}
            >
              <SocialIcon platform={platform} className="w-4 h-4 mr-2" />
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}

          <button
            onClick={handleCopyLink}
            className={`${baseClasses} w-full px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  // Default horizontal variant
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm text-white/70">Share:</span>

      {Object.entries(shareLinks).map(([platform, link]) => (
        <button
          key={platform}
          onClick={() => handleShare(platform as keyof typeof shareLinks)}
          className={`${baseClasses} w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white`}
          title={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
        >
          <SocialIcon platform={platform} />
        </button>
      ))}

      <button
        onClick={handleCopyLink}
        className={`${baseClasses} w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white`}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}

interface SocialIconProps {
  platform: string
  className?: string
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-5 h-5' }) => {
  switch (platform) {
    case 'twitter':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    case 'reddit':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12.017 0 16.4 2.331 20.183 5.816 22.234c.41.074.537-.178.537-.396 0-.194-.008-.708-.008-1.39-2.178.473-2.642-1.052-2.642-1.052-.356-.904-.868-1.144-.868-1.144-.711-.485.054-.475.054-.475.786.055 1.201.806 1.201.806.699 1.2 1.834.853 2.279.652.07-.508.273-.853.496-1.02-.356-.039-.711-.118-1.053-.174-.229-.06-.49-.16-.711-.16-.314 0-.663.097-.92.271-.254.174-.438.419-.438.738 0 .508.191.958.436 1.257.246.3.546.536.872.65-.079.33-.217.659-.391.952-.174.293-.421.536-.722.65-.301.114-.635.163-.964.163-1.148 0-2.096-.88-2.096-1.979 0-1.099.948-1.979 2.096-1.979.558 0 1.072.214 1.448.574.376-.36.79-.574 1.448-.574 1.148 0 2.096.88 2.096 1.979 0 1.099-.948 1.979-2.096 1.979-.658 0-1.29-.214-1.448-.574-.376.36-.79.574-1.448.574zM24 12.017C24 5.396 18.624 0 12 0S0 5.396 0 12.017C0 18.64 5.376 24 12 24s12-5.36 12-11.983z"/>
        </svg>
      )
    case 'email':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    default:
      return null
  }
}

export default SocialShare