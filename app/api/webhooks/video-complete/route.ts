import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

/**
 * POST /api/webhooks/video-complete
 * Webhook handler for video generation completion
 * 
 * Optional: Can be called by video provider when video is ready
 * Body: { dream_id, video_id, video_url, status }
 * 
 * Security: Should verify webhook signature in production
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.VIDEO_WEBHOOK_SECRET

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { dream_id, video_id, video_url, status } = body

    // Validate input
    if (!dream_id || !video_id) {
      return NextResponse.json(
        { error: 'dream_id and video_id are required' },
        { status: 400 }
      )
    }

    if (!video_url && status !== 'failed') {
      return NextResponse.json(
        { error: 'video_url is required for completed status' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Admin client not available' },
        { status: 500 }
      )
    }

    // Update dream with video data
    const updateData: any = {
      video_status: status || 'completed',
    }

    if (video_url) {
      updateData.video_url = video_url
    }

    // Ensure video_id matches
    const { data, error } = await supabase
      .from('dreams')
      .update(updateData)
      .eq('id', dream_id)
      .eq('video_id', video_id) // Ensure video_id matches for security
      .select('id, user_id')

    if (error) {
      console.error('Error updating dream from webhook:', error)
      return NextResponse.json(
        { error: 'Failed to update dream', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Dream not found or video_id mismatch' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Video status updated',
    })
  } catch (error) {
    console.error('Unexpected error in webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

