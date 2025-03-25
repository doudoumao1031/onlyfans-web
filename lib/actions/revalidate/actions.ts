"use server"

import { revalidateTag } from "next/cache"

/**
 * Revalidate profile data
 * This server action can be called from client components to refresh profile-related data
 *
 * Use cases:
 * - After saving/unsaving a post
 * - After updating user profile information
 * - After any other action that modifies profile data
 *
 * @returns Object indicating successful revalidation
 */
export async function revalidateProfileData() {
  // Revalidate tags for profile-related data
  revalidateTag("user-profile")
  return { success: true }
}
