/**
 * Simple PDF text extraction using PDF.js
 * This runs on the client side to extract text from PDFs
 */

interface PDFPage {
  getTextContent(): Promise<{
    items: Array<{ str: string }>;
  }>;
}

interface PDFDocument {
  numPages: number;
  getPage(pageNum: number): Promise<PDFPage>;
}

declare global {
  interface Window {
    pdfjsLib?: {
      getDocument(data: { data: Uint8Array }): { promise: Promise<PDFDocument> };
      GlobalWorkerOptions?: {
        workerSrc: string;
      };
    };
  }
}

// CDN for PDF.js worker
const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/**
 * Load PDF.js library dynamically
 */
async function loadPDFJS(): Promise<void> {
  if (typeof window === "undefined") return;
  
  // If already loaded, just set worker
  if (window.pdfjsLib) {
    if (window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    }
    return;
  }

  // Load PDF.js from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      if (window.pdfjsLib?.GlobalWorkerOptions) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
      }
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });
}

/**
 * Extract text from a PDF file
 * @param file - The PDF file to extract text from
 * @returns The extracted text content
 */
export async function extractPDFText(file: File): Promise<string> {
  if (typeof window === "undefined") {
    return `[PDF Document: ${file.name}]`;
  }

  try {
    await loadPDFJS();
    
    if (!window.pdfjsLib) {
      throw new Error("PDF.js library not loaded");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);
    
    const pdf = await window.pdfjsLib.getDocument({ data: pdfData }).promise;
    let fullText = "";
    
    // Extract text from first 20 pages (to avoid timeout with large PDFs)
    const maxPages = Math.min(pdf.numPages, 20);
    
    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: { str: string }) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      } catch (pageError) {
        console.warn(`Error extracting text from page ${i}:`, pageError);
      }
    }
    
    // Clean up the text
    fullText = fullText
      .replace(/\s+/g, " ")  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, "\n\n")  // Clean up multiple newlines
      .trim();
    
    if (!fullText || fullText.length < 50) {
      return `[PDF Document: ${file.name}]\n\nThis PDF appears to be image-based or scanned. Text extraction was not possible. You can still ask general questions about the document.`;
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return `[PDF Document: ${file.name}]\n\nPDF uploaded successfully. Text extraction encountered an error, but you can still ask questions about this document.`;
  }
}

/**
 * Extract text from various document types
 * @param file - The file to extract text from
 * @returns The extracted text content
 */
export async function extractDocumentText(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractPDFText(file);
  } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return file.text();
  } else if (fileType === "text/markdown" || fileName.endsWith(".md")) {
    return file.text();
  } else if (fileType.includes("word") || fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
    // For Word documents, we'll return a placeholder since parsing .docx in browser is complex
    return `[Word Document: ${file.name}]\n\nWord document uploaded. Full text extraction is limited for this format. You can ask questions about the document, and I'll use the available information.`;
  } else {
    return `[File: ${file.name}]\n\nFile uploaded successfully.`;
  }
}
