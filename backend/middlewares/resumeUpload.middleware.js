import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
    return;
  }

  const extension = file.originalname
    .split(".")
    .pop()
    ?.toLowerCase();

  if (extension === "pdf") {
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