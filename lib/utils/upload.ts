// This file is used by client components, so it uses the API route for uploads
// instead of directly importing @vercel/blob which is server-side only

export interface UploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  uploadedAt: string;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  prefix?: string; // folder prefix
}

export async function uploadImage(
  file: File,
  userId: string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
  } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    );
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
  }

  try {
    // Upload via API route to keep @vercel/blob on server-side only
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (options.prefix) {
      formData.append("prefix", options.prefix);
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload image");
    }

    const result = await response.json();
    return {
      url: result.url,
      downloadUrl: result.url,
      pathname: result.filename,
      contentType: file.type,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Note: Delete functionality would need a separate API route
    console.warn("Delete functionality requires server-side implementation");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export function getImageUrl(filename: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BLOB_BASE_URL || "";
  return `${baseUrl}/${filename}`;
}

export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit.`,
    };
  }

  return { isValid: true };
}
