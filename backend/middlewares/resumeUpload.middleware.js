import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop()?.toLowerCase();
  const isPdfMimeType = file.mimetype === "application/pdf";
  const isPdfExtension = extension === "pdf";

  if (isPdfMimeType && isPdfExtension) {
    cb(null, true);
    return;
  }

  cb(new Error("Only PDF resume files are allowed."), false);
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadResume;
