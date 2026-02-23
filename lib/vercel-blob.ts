// This file re-exports upload utilities from lib/utils/upload for backward compatibility
// The actual @vercel/blob import is only used in server-side API routes

export {
  uploadImage,
  deleteImage,
  validateImageFile,
  type UploadResult,
  type UploadOptions,
} from "./utils/upload";

/**
 * Generate a unique filename for an image upload
 * @param originalFilename - The original filename
 * @param userId - The user ID for organization
 * @returns A unique filename
 */
export function generateUniqueFilename(
  originalFilename: string,
  userId: string,
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFilename.split(".").pop() || "jpg";
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload a base64 image to Vercel Blob storage
 * @param base64String - The base64 encoded image string
 * @param filename - The filename for the uploaded image
 * @returns Upload result with URL and metadata
 */
export async function uploadBase64Image(
  base64String: string,
  filename: string,
): Promise<import("./utils/upload").UploadResult> {
  try {
    // Remove the data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const file = new File([buffer], filename, { type: "image/jpeg" });

    const { uploadImage } = await import("./utils/upload");
    return await uploadImage(file, filename);
  } catch (error) {
    console.error("Error uploading base64 image to Vercel Blob:", error);
    throw new Error("Failed to upload base64 image to Vercel Blob");
  }
}
