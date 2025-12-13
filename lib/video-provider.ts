/**
 * Video Provider Abstraction
 * 
 * Abstracted interface for video generation providers
 * Can be swapped between different providers (Runway, Pika, etc.)
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

export interface VideoGenerationRequest {
  prompt: string
  style?: string
  duration?: number // in seconds
}

export interface VideoGenerationResponse {
  success: boolean
  video_url?: string
  video_id?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
}

/**
 * Abstract video provider interface
 */
export interface VideoProvider {
  generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse>
  checkStatus(videoId: string): Promise<VideoGenerationResponse>
}

/**
 * Mock video provider (for development/testing)
 */
export class MockVideoProvider implements VideoProvider {
  private videos: Map<string, { status: string; url?: string }> = new Map()

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    // Simulate async video generation
    const videoId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store as pending
    this.videos.set(videoId, { status: 'pending' })

    // Simulate processing delay (in real app, this would be async)
    setTimeout(() => {
      this.videos.set(videoId, {
        status: 'completed',
        url: `https://example.com/videos/${videoId}.mp4`, // Mock URL
      })
    }, 5000) // 5 seconds for demo

    return {
      success: true,
      video_id: videoId,
      status: 'pending',
    }
  }

  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    const video = this.videos.get(videoId)

    if (!video) {
      return {
        success: false,
        status: 'failed',
        error: 'Video not found',
      }
    }

    return {
      success: video.status === 'completed',
      video_url: video.url,
      status: video.status as 'pending' | 'processing' | 'completed' | 'failed',
    }
  }
}

/**
 * Get video provider instance
 * Returns mock provider if no API key is configured
 */
export function getVideoProvider(): VideoProvider {
  // Check for video API key (e.g., RUNWAY_API_KEY, PIKA_API_KEY, etc.)
  const runwayApiKey = process.env.RUNWAY_API_KEY
  const videoApiKey = process.env.VIDEO_API_KEY || runwayApiKey || process.env.PIKA_API_KEY

  if (!videoApiKey) {
    console.warn('No video API key found. Using mock video provider.')
    return new MockVideoProvider()
  }

  // Use Runway if RUNWAY_API_KEY is set
  if (runwayApiKey) {
    try {
      const { RunwayVideoProvider } = require('./video-providers/runway')
      return new RunwayVideoProvider(runwayApiKey)
    } catch (error) {
      console.error('Failed to load Runway provider:', error)
      return new MockVideoProvider()
    }
  }

  // Fallback to mock for other providers (can be extended)
  return new MockVideoProvider()
}

