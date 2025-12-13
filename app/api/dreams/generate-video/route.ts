import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserFromSession } from '@/lib/supabase-server'
import { generateVideoPrompt } from '@/lib/video-prompt-generator'
import { getVideoProvider } from '@/lib/video-provider'

/**
 * POST /api/dreams/generate-video
 * Generate AI video for a dream
 * 
 * Body: { dream_id: string, style?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dream_id, style } = body

    // Validate input
    if (!dream_id || typeof dream_id !== 'string') {
      return NextResponse.json(
        { error: 'dream_id is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const auth = await getAuthenticatedUser(request) || await getUserFromSession()

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const { userId, supabase } = auth

    // Fetch dream data
    const { data: dream, error: dreamError } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', dream_id)
      .eq('user_id', userId) // Ensure user owns the dream
      .single()

    if (dreamError || !dream) {
      return NextResponse.json(
        { error: 'Dream not found or access denied' },
        { status: 404 }
      )
    }

    // Check if video already exists
    if (dream.video_url && dream.video_status === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'Video already generated',
        video_url: dream.video_url,
        video_prompt: dream.video_prompt,
        video_status: dream.video_status,
      })
    }

    // Generate video prompt
    const videoPromptData = generateVideoPrompt({
      dream_text: dream.dream_text,
      emotion: dream.emotion,
      style: style || dream.style,
      analysis: dream.analysis as any,
    })

    // Get video provider
    const videoProvider = getVideoProvider()

    // Generate video (async - may return pending status)
    const videoResult = await videoProvider.generateVideo({
      prompt: videoPromptData.prompt,
      style: style || dream.style || 'cinematic',
      duration: 10, // 10 seconds default
    })

    // Update dream with video generation data
    const updateData: any = {
      video_prompt: videoPromptData.prompt,
      video_status: videoResult.status || 'processing',
    }

    if (videoResult.video_id) {
      updateData.video_id = videoResult.video_id
      updateData.video_job_id = videoResult.video_id // Store as job_id for async processing
    }

    if (videoResult.video_url) {
      updateData.video_url = videoResult.video_url
    }

    const { error: updateError } = await supabase
      .from('dreams')
      .update(updateData)
      .eq('id', dream_id)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating dream with video data:', updateError)
      return NextResponse.json(
        { error: 'Failed to save video generation data', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      video_id: videoResult.video_id,
      video_url: videoResult.video_url,
      video_prompt: videoPromptData.prompt,
      video_status: videoResult.status,
      message: videoResult.status === 'pending' 
        ? 'Video generation started. It may take a few minutes.'
        : 'Video generated successfully',
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/dreams/generate-video?dream_id=xxx
 * Check video generation status
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

    // Fetch dream
    const { data: dream, error: dreamError } = await supabase
      .from('dreams')
      .select('video_id, video_status, video_url')
      .eq('id', dream_id)
      .eq('user_id', userId)
      .single()

    if (dreamError || !dream) {
      return NextResponse.json(
        { error: 'Dream not found' },
        { status: 404 }
      )
    }

    // If video is pending/processing, check status with provider
    if (dream.video_id && (dream.video_status === 'pending' || dream.video_status === 'processing')) {
      const videoProvider = getVideoProvider()
      const statusResult = await videoProvider.checkStatus(dream.video_id)

      // Update if status changed
      if (statusResult.status !== dream.video_status || statusResult.video_url) {
        const updateData: any = {
          video_status: statusResult.status,
        }

        if (statusResult.video_url) {
          updateData.video_url = statusResult.video_url
        }

        await supabase
          .from('dreams')
          .update(updateData)
          .eq('id', dream_id)
          .eq('user_id', userId)
      }

      return NextResponse.json({
        success: true,
        video_status: statusResult.status,
        video_url: statusResult.video_url || dream.video_url,
      })
    }

    // Return current status
    return NextResponse.json({
      success: true,
      video_status: dream.video_status || null,
      video_url: dream.video_url || null,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

