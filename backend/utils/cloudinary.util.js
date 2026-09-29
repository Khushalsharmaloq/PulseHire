import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const uploadBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const uploadToCloudinary = (buffer, folder) =>
  uploadBuffer(buffer, {
    folder,
    resource_type: "image",
  });

export const uploadPrivateResumeToCloudinary = (buffer, folder) =>
  uploadBuffer(buffer, {
    folder,
    resource_type: "raw",
    type: "authenticated",
  });

export const createPrivateResumeDownloadUrl = ({
  publicId,
  format = "pdf",
  resourceType = "raw",
  deliveryType = "authenticated",
  expiresInSeconds = 5 * 60,
}) => {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType,
    type: deliveryType,
    expires_at: expiresAt,
  });
};

export const destroyCloudinaryAsset = async ({
  publicId,
  resourceType = "image",
  deliveryType = "upload",
}) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: deliveryType,
    invalidate: true,
  });
};
