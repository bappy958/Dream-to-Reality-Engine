import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { getVideoProvider } from '@/lib/video-provider'

/**
 * GET /api/dreams/video-status?dream_id=xxx
 * Poll video generation status
 * 
 * Returns: { video_status, video_url, video_error }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dream_id = searchParams.get('dream_id')

    if (!dream_id) {
      return NextResponse.json(
        { error: 'dream_id is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const auth = await getAuthenticatedUser(request) || await getUserFromSession()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, supabase } = auth

    // Fetch dream with video data
    const { data: dream, error: dreamError } = await supabase
      .from('dreams')
      .select('video_id, video_job_id, video_status, video_url')
      .eq('id', dream_id)
      .eq('user_id', userId) // Ensure user owns the dream
      .single()

    if (dreamError || !dream) {
      return NextResponse.json(
        { error: 'Dream not found or access denied' },
        { status: 404 }
      )
    }

    // If no video job, return current status
    const jobId = dream.video_job_id || dream.video_id
    if (!jobId) {
      return NextResponse.json({
        success: true,
        video_status: dream.video_status || null,
        video_url: dream.video_url || null,
      })
    }

    // If already completed or failed, return cached status
    if (dream.video_status === 'completed' || dream.video_status === 'failed') {
      return NextResponse.json({
        success: true,
        video_status: dream.video_status,
        video_url: dream.video_url || null,
      })
    }

    // Check status with video provider
    const videoProvider = getVideoProvider()
    const statusResult = await videoProvider.checkStatus(jobId)

    // Update database if status changed
    const updateData: any = {
      video_status: statusResult.status,
    }

    if (statusResult.video_url) {
      updateData.video_url = statusResult.video_url
    }

    if (statusResult.error && statusResult.status === 'failed') {
      // Optionally store error message
      updateData.video_error = statusResult.error
    }

    // Only update if something changed
    if (
      statusResult.status !== dream.video_status ||
      (statusResult.video_url && statusResult.video_url !== dream.video_url)
    ) {
      const { error: updateError } = await supabase
        .from('dreams')
        .update(updateData)
        .eq('id', dream_id)
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error updating video status:', updateError)
        // Continue to return status even if update fails
      }
    }

    return NextResponse.json({
      success: true,
      video_status: statusResult.status,
      video_url: statusResult.video_url || dream.video_url || null,
      video_error: statusResult.error || null,
    })
  } catch (error) {
    console.error('Unexpected error checking video status:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

