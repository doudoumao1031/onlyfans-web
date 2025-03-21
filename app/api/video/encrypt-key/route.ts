
import fs from "fs"
import path from "path"

import { NextRequest, NextResponse } from "next/server"

// In a real application, you would want to:
// 1. Authenticate the request
// 2. Check authorization for this specific video
// 3. Potentially log the access
// 4. Maybe use a different key per user/session

export async function GET(_request: NextRequest) {
  try {
    // Read the encryption key from the public directory
    const keyPath = path.join(process.cwd(), "public", "keys", "encrypt.key")
    const keyData = fs.readFileSync(keyPath)

    // Set appropriate headers for binary data
    return new NextResponse(keyData, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=\"encrypt.key\"",
        // Prevent caching to ensure fresh keys
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })
  } catch (error) {
    console.error("Error serving encryption key:", error)
    return NextResponse.json(
      { error: "Failed to serve encryption key" },
      { status: 500 }
    )
  }
}
