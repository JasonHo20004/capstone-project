"""
RAG Service - PDF Text Extractor
"""

import fitz  # PyMuPDF
from io import BytesIO


def extract_text_from_pdf(file_bytes: bytes) -> tuple[str, int]:
    """
    Extract all text from a PDF file.
    Returns (text, page_count).
    """
    doc = fitz.open(stream=BytesIO(file_bytes), filetype="pdf")
    pages = []
    for page in doc:
        pages.append(page.get_text())
    doc.close()
    full_text = "\n\n".join(pages)
    return full_text.strip(), len(pages)


def extract_text_from_txt(file_bytes: bytes) -> tuple[str, int]:
    """
    Read plain text file.
    Returns (text, 1).
    """
    text = file_bytes.decode("utf-8", errors="ignore")
    return text.strip(), 1
