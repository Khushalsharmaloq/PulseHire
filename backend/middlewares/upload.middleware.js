import multer from "multer";

const storage = multer.memoryStorage();

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const fileFilter = (req, file, cb) => {
  const fileExtension = file.originalname.split(".").pop()?.toLowerCase();

  const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

  const isValidMimeType = allowedImageTypes.has(file.mimetype);
  const isValidExtension = allowedExtensions.has(fileExtension);

  if (isValidMimeType && isValidExtension) {
    cb(null, true);
    return;
  }

  cb(
    new Error("Only JPG, JPEG, PNG, and WEBP image files are allowed."),
    false,
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
