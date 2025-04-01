import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { join } from "path"

import { NextRequest, NextResponse } from "next/server"

// Correct typescript interface for dynamic route params
interface RouteParams {
  params: Promise<unknown>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const pathSegments = (await params as { path: string[] }).path || []
  const fullPath = join(process.cwd(), "public", "uploads", "hls", ...pathSegments)

  try {
    if (!existsSync(fullPath)) {
      console.error(`HLS file not found: ${fullPath}`)
      return new NextResponse("File not found", { status: 404 })
    }

    const fileContent = await readFile(fullPath)

    // Set the correct content type based on file extension
    const contentType = fullPath.endsWith(".m3u8")
      ? "application/vnd.apple.mpegurl"
      : fullPath.endsWith(".ts")
        ? "video/mp2t"
        : "application/octet-stream"

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    })
  } catch (error) {
    console.error(`Error serving HLS file: ${error}`)
    return new NextResponse("Error serving file", { status: 500 })
  }
}
