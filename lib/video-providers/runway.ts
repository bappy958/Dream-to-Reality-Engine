/**
 * Runway ML Video Provider
 * 
 * Production-ready implementation for Runway ML video generation API
 * 
 * Developed by Bappy Ahmmed (itznobita958@gmail.com)
 */

import { VideoProvider, VideoGenerationRequest, VideoGenerationResponse } from '../video-provider'

export class RunwayVideoProvider implements VideoProvider {
  private apiKey: string
  private baseUrl = 'https://api.runwayml.com/v1'

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Runway API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Generate video using Runway ML API
   * Returns job_id for async processing
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      // Runway ML Gen-2 API endpoint
      const response = await fetch(`${this.baseUrl}/gen2/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration: request.duration || 10, // seconds
          // Additional Runway-specific parameters
          aspect_ratio: '16:9',
          watermark: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Runway API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Runway returns a job_id for async processing
      return {
        success: true,
        video_id: data.id || data.job_id, // Runway may use 'id' or 'job_id'
        status: 'processing', // Always starts as processing
      }
    } catch (error) {
      console.error('Runway video generation error:', error)
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to generate video',
      }
    }
  }

  /**
   * Check video generation status
   */
  async checkStatus(videoId: string): Promise<VideoGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/gen2/status/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            status: 'failed',
            error: 'Video job not found',
          }
        }
        throw new Error(`Runway API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Map Runway status to our status
      const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
        'pending': 'pending',
        'processing': 'processing',
        'running': 'processing',
        'completed': 'completed',
        'succeeded': 'completed',
        'failed': 'failed',
        'error': 'failed',
      }

      const status = statusMap[data.status?.toLowerCase()] || 'processing'

      return {
        success: status === 'completed',
        video_id: videoId,
        video_url: data.output?.[0] || data.video_url || data.url, // Runway may return URL in different fields
        status: status,
        error: status === 'failed' ? (data.error || 'Video generation failed') : undefined,
      }
    } catch (error) {
      console.error('Runway status check error:', error)
      return {
        success: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to check status',
      }
    }
  }
}

