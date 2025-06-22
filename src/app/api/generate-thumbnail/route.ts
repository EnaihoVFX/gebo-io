import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, videoTitle } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const replicateApiKey = process.env.REPLICATE_API_KEY;
    if (!replicateApiKey) {
      // Return fallback images if no API key
      return NextResponse.json({
        images: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop&crop=center',
        ],
        prompt: prompt,
        fallback: true
      });
    }

    // Enhanced prompt with better instructions
    const enhancedPrompt = videoTitle 
      ? `${prompt}, professional YouTube thumbnail for video titled "${videoTitle}", high quality, eye-catching, vibrant colors, professional lighting, cinematic style, 16:9 aspect ratio, no text, no logos, photorealistic`
      : `${prompt}, professional YouTube thumbnail, high quality, eye-catching, vibrant colors, professional lighting, cinematic style, 16:9 aspect ratio, no text, no logos, photorealistic`;

    // Using a current, reliable model - Stable Diffusion XL
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // Stable Diffusion XL
        input: {
          prompt: enhancedPrompt,
          negative_prompt: "black background, solid black, dark background, blurry, low quality, distorted, watermark, text, logo, monochrome, grayscale, ugly, deformed, noisy, blurry, low quality, text, watermark, glitch, deformed, mutated, ugly, disgusting",
          width: 1280,
          height: 720,
          num_outputs: 3,
          guidance_scale: 7.5,
          num_inference_steps: 25,
          scheduler: "K_EULER",
          seed: Math.floor(Math.random() * 1000000),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Replicate API error:', errorData);
      
      // Return fallback images on API error
      return NextResponse.json({
        images: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop&crop=center',
        ],
        prompt: enhancedPrompt,
        fallback: true,
        error: 'API error, using fallback images'
      });
    }

    const prediction = await response.json();
    
    // Poll for completion
    let result = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check prediction status');
      }

      result = await statusResponse.json();

      if (result.status === 'succeeded') {
        break;
      } else if (result.status === 'failed') {
        throw new Error('Image generation failed');
      }

      // Wait 1 second before next check
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result || result.status !== 'succeeded') {
      // Return fallback images on timeout
      return NextResponse.json({
        images: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop&crop=center',
        ],
        prompt: enhancedPrompt,
        fallback: true,
        error: 'Generation timeout, using fallback images'
      });
    }

    console.log('Full Replicate result:', JSON.stringify(result, null, 2));

    // Check if generated images are valid (not black)
    const validImages = result.output.filter((url: string) => {
      // For now, just return all images and let the frontend handle display
      return url && url.startsWith('http');
    });

    console.log('Replicate API response:', {
      status: result.status,
      output: result.output,
      validImages: validImages
    });

    if (validImages.length === 0) {
      // Return fallback images if all generated images are invalid
      return NextResponse.json({
        images: [
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop&crop=center',
        ],
        prompt: enhancedPrompt,
        fallback: true,
        error: 'Generated images invalid, using fallback images'
      });
    }

    // For now, return the original URLs but add a note about potential CORS issues
    console.log('Returning original Replicate URLs:', validImages);
    
    return NextResponse.json({
      images: validImages,
      prompt: enhancedPrompt,
      note: 'Images may take a moment to load from Replicate delivery'
    });

  } catch (error) {
    console.error('Thumbnail generation error:', error);
    
    // Return fallback images on any error
    return NextResponse.json({
      images: [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1280&h=720&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop&crop=center',
      ],
      prompt: prompt,
      fallback: true,
      error: 'Generation failed, using fallback images'
    });
  }
} 