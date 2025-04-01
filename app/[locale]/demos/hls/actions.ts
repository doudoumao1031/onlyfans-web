"use server"

import type { FormData } from "node-fetch"

export async function convertToHLS(formData: FormData) {
  // Start timing the conversion process
  const startTime = Date.now()

  const file = formData.get("video") as File
  if (!file) {
    return { success: false, error: "No file uploaded" }
  }

  // Check if encryption is requested (default to true for security)
  const enableEncryption = formData.get("encrypt") !== "false"

  try {
    // Import Node.js modules dynamically in server action
    const crypto = await import("crypto")
    const fs = await import("fs/promises")
    const path = await import("path")
    const { execSync } = await import("child_process")

    const uploadId = crypto.randomBytes(8).toString("hex")
    const publicDir = path.join(process.cwd(), "public")
    const uploadsDir = path.join(publicDir, "uploads")
    const hlsDir = path.join(uploadsDir, "hls", uploadId)

    // Ensure directories exist
    try {
      await fs.stat(uploadsDir)
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true })
    }

    try {
      await fs.stat(path.join(uploadsDir, "hls"))
    } catch {
      await fs.mkdir(path.join(uploadsDir, "hls"), { recursive: true })
    }

    await fs.mkdir(hlsDir, { recursive: true })

    // Save the uploaded file
    const buffer = Buffer.from(await file.arrayBuffer())
    const tempFilePath = path.join(hlsDir, "input.mp4")
    await fs.writeFile(tempFilePath, buffer)

    // Get video dimensions to maintain aspect ratio
    const probeCommand = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${tempFilePath}"`
    const dimensions = execSync(probeCommand).toString().trim()
    const [width, height] = dimensions.split("x").map(Number)
    const aspectRatio = width / height

    // Check if the video has audio
    const audioCheckCommand = `ffprobe -i "${tempFilePath}" -show_streams -select_streams a -loglevel error`
    const hasAudio = execSync(audioCheckCommand, { stdio: ["pipe", "pipe", "ignore"] }).toString().trim().length > 0

    // Calculate dimensions for 240p and 720p while maintaining aspect ratio
    const height240 = 240
    const width240 = Math.round(height240 * aspectRatio / 2) * 2 // Ensure even number

    const height720 = 720
    const width720 = Math.round(height720 * aspectRatio / 2) * 2 // Ensure even number

    // Create encryption keys and IV if encryption is enabled
    let keyInfoOption = ""
    let keyUrl = ""
    let ivHex = ""

    // if (enableEncryption) {
    if (false) {
      // Generate random key and IV
      const key = crypto.randomBytes(16) // 128 bits for AES-128
      const iv = crypto.randomBytes(16)

      // Save key and IV to files
      const keyPath = path.join(hlsDir, "enc.key")
      const ivHexString = iv.toString("hex")

      await fs.writeFile(keyPath, key)

      // Create key info file for FFmpeg
      const keyInfoPath = path.join(hlsDir, "keyinfo")
      keyUrl = `/uploads/hls/${uploadId}/enc.key`

      // Write the key info file with the format expected by FFmpeg:
      // Line 1: Path to the key file on disk
      // Line 2: URI for the key file (used in the playlist)
      // Line 3: IV (optional)
      await fs.writeFile(
        keyInfoPath,
        `${keyPath}\nenc.key\n${ivHexString}`
      )

      // Get IV hex for later use
      ivHex = ivHexString

      // Add the key info option to the FFmpeg command
      keyInfoOption = `-hls_key_info_file ${keyInfoPath}`
    }

    // Build the FFmpeg command for multi-resolution with only 240p and 720p
    let command = `ffmpeg -i "${tempFilePath}" -filter_complex "[v:0]split=2[v1][v2]; [v1]scale=w=${width240}:h=${height240}:flags=lanczos[v1out]; [v2]scale=w=${width720}:h=${height720}:flags=lanczos[v2out]" -map "[v1out]" -c:v:0 libx264 -preset faster -profile:v main -crf 23 -b:v 250k -maxrate 300k -bufsize 600k -map "[v2out]" -c:v:1 libx264 -preset faster -profile:v main -crf 22 -b:v 2500k -maxrate 3000k -bufsize 6000k`

    // Add audio mapping only if the video has audio
    if (hasAudio) {
      command += " -map a:0 -c:a:0 aac -ar 48000 -b:a 96k -map a:0 -c:a:1 aac -ar 48000 -b:a 128k -var_stream_map \"v:0,a:0 v:1,a:1\""
    } else {
      command += " -var_stream_map \"v:0 v:1\""
    }

    // Add the rest of the command
    command += ` -master_pl_name master.m3u8 -hls_time 4 -hls_playlist_type vod -hls_list_size 0 -hls_segment_type mpegts -hls_flags independent_segments -hls_segment_filename ${hlsDir}/stream_%v_%03d.ts ${keyInfoOption} -threads 0 -f hls ${hlsDir}/stream_%v.m3u8`

    try {
      // Check if FFmpeg is available
      try {
        execSync("ffmpeg -version", { stdio: "ignore" })
      } catch (_) {
        throw new Error("FFmpeg is not installed or not available in the system PATH. Please install FFmpeg to use this feature.")
      }

      // Log the command for debugging
      console.log(`Running FFmpeg command:\n${command}`)

      // Execute the FFmpeg command
      execSync(command, { stdio: "inherit" })

      // Update m3u8 files with the correct key URL if encryption is enabled
      if (enableEncryption) {
        // Get all m3u8 files
        const files = await fs.readdir(hlsDir)
        const m3u8Files = files.filter(file => file.endsWith(".m3u8"))

        for (const file of m3u8Files) {
          const filePath = path.join(hlsDir, file)
          let content = await fs.readFile(filePath, "utf8")

          // Replace the relative key path with the absolute web URL
          // The pattern to look for is: #EXT-X-KEY:METHOD=AES-128,URI="enc.key"
          content = content.replace(
            /#EXT-X-KEY:METHOD=AES-128,URI="enc.key"/g,
            `#EXT-X-KEY:METHOD=AES-128,URI="${keyUrl}",IV=0x${ivHex}`
          )

          // Write the updated content back
          await fs.writeFile(filePath, content)
        }
      }
    } catch (error) {
      console.error("FFmpeg error:", error)
      throw new Error(`FFmpeg conversion failed: ${(error as Error).message || "Unknown error"}`)
    }

    // Return the path to the master playlist
    const _masterPlaylistPath = path.join(hlsDir, "master.m3u8")
    const masterPlaylistUrl = `/uploads/hls/${uploadId}/master.m3u8`

    // Calculate the total time taken
    const endTime = Date.now()
    const conversionTimeMs = endTime - startTime

    return {
      success: true,
      hlsUrl: masterPlaylistUrl,
      hasAudio,
      dimensions: {
        width,
        height
      },
      encrypted: enableEncryption,
      conversionTimeMs,
      resolutions: {
        "240p": `${width240}x${height240}`,
        "720p": `${width720}x${height720}`
      }
    }
  } catch (error) {
    console.error("Error generating HLS:", error)
    return { success: false, error: String(error) }
  }
}