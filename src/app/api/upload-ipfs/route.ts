import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      exists: !!file
    });

    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    console.log('File size check:', { fileSize: file.size, maxSize });
    
    if (file.size > maxSize) {
      console.log('File too large');
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      );
    }

    // Check file type - handle cases where file.type might be undefined
    const fileType = file.type || '';
    const fileName = file.name || '';
    
    console.log('File type check:', { fileType, fileName });
    
    // Check if it's a video file or image file by MIME type or file extension
    const isVideoByType = fileType.startsWith('video/');
    const isVideoByExtension = /\.(mp4|mov|avi|webm|mkv|flv|wmv|m4v|3gp|ogv)$/i.test(fileName);
    const isImageByType = fileType.startsWith('image/');
    const isImageByExtension = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
    
    console.log('File validation:', { isVideoByType, isVideoByExtension, isImageByType, isImageByExtension });
    
    if (!isVideoByType && !isVideoByExtension && !isImageByType && !isImageByExtension) {
      console.log('Invalid file type');
      return NextResponse.json(
        { error: 'Invalid file type. Only video and image files are allowed' },
        { status: 400 }
      );
    }

    // For now, return a mock IPFS hash
    // In production, you would upload to IPFS here
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    console.log('Upload successful, returning hash:', mockHash);
    
    return NextResponse.json({
      hash: mockHash,
      size: file.size,
      name: file.name,
      type: fileType || 'video/mp4', // Provide fallback type
      success: true
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 