// =============================================================================
// File Validation Service
// =============================================================================
// Verifies extension, MIME (via magic-byte sniffing where possible), and size.
// Throws structured errors that the controller converts to 400 responses.

export type SupportedFileType = "pdf" | "docx";

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB
const MIN_PDF_WORD_COUNT = 30; // Below this we treat the PDF as scanned/image.

const EXT_TO_TYPE: Record<string, SupportedFileType> = {
  ".pdf": "pdf",
  ".docx": "docx",
};

const MIME_TO_TYPE: Record<string, SupportedFileType> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export class FileValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export interface ValidatedFile {
  type: SupportedFileType;
  buffer: Buffer;
  size: number;
  originalName: string;
}

export class FileValidationService {
  async validate(file: {
    originalname?: string;
    mimetype?: string;
    buffer?: Buffer;
    size?: number;
  }): Promise<ValidatedFile> {
    if (!file || !file.buffer) {
      throw new FileValidationError("Không có file được tải lên.");
    }

    const size = file.size ?? file.buffer.length;
    if (size > MAX_FILE_BYTES) {
      throw new FileValidationError(
        `File quá lớn. Kích thước tối đa là ${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB.`,
        413
      );
    }

    const name = (file.originalname || "").toLowerCase();
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
    const extType = EXT_TO_TYPE[ext];
    const mimeType = MIME_TO_TYPE[(file.mimetype || "").toLowerCase()];

    let detectedType: SupportedFileType | undefined = extType || mimeType;

    // Sniff magic bytes when possible (defence against extension spoofing).
    try {
      const fileTypeMod = await import("file-type");
      const sniffed = await fileTypeMod.fileTypeFromBuffer(file.buffer);
      if (sniffed) {
        const sniffedType = MIME_TO_TYPE[sniffed.mime];
        if (sniffedType) {
          detectedType = sniffedType;
        }
      }
    } catch {
      // Magic-byte sniff is best-effort; fall back to extension/MIME.
    }

    if (!detectedType) {
      throw new FileValidationError(
        "Định dạng file không được hỗ trợ. Chỉ chấp nhận .pdf hoặc .docx."
      );
    }

    return {
      type: detectedType,
      buffer: file.buffer,
      size,
      originalName: file.originalname || `import.${detectedType}`,
    };
  }

  /**
   * Run after PDF extraction so we can reject files that look like scans.
   * DOCX is exempt — a DOCX with very little text is just an empty doc.
   */
  assertPdfHasEnoughText(fileType: SupportedFileType, wordCount: number): void {
    if (fileType !== "pdf") return;
    if (wordCount < MIN_PDF_WORD_COUNT) {
      throw new FileValidationError(
        "File PDF có vẻ là bản scan hoặc dạng ảnh. Chỉ hỗ trợ PDF dạng text."
      );
    }
  }
}

export const fileValidationService = new FileValidationService();
