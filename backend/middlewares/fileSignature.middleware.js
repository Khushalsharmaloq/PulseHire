const startsWithBytes = (buffer, bytes) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < bytes.length) {
    return false;
  }

  return bytes.every((byte, index) => buffer[index] === byte);
};

const isPdf = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 5 &&
  buffer.subarray(0, 5).toString("ascii") === "%PDF-";

const isJpeg = (buffer) => startsWithBytes(buffer, [0xff, 0xd8, 0xff]);

const isPng = (buffer) =>
  startsWithBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const isWebp = (buffer) =>
  Buffer.isBuffer(buffer) &&
  buffer.length >= 12 &&
  buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
  buffer.subarray(8, 12).toString("ascii") === "WEBP";

export const validatePdfSignature = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (!isPdf(req.file.buffer)) {
    return res.status(400).json({
      success: false,
      message: "The uploaded resume is not a valid PDF file.",
    });
  }

  next();
};

export const validateImageSignature = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (!isJpeg(req.file.buffer) && !isPng(req.file.buffer) && !isWebp(req.file.buffer)) {
    return res.status(400).json({
      success: false,
      message: "The uploaded file is not a valid JPG, PNG, or WEBP image.",
    });
  }

  next();
};
