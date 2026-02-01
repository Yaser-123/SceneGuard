import mammoth from 'mammoth';

// Dynamic import for pdfjs-dist to handle ES module issues
let pdfjsLib: any = null;

/**
 * Parse uploaded file and extract plain text
 */
export async function parseFileToText(file: File): Promise<string> {
  const fileExtension = file.name.toLowerCase().split('.').pop();

  if (fileExtension === 'pdf') {
    return parsePDF(file);
  } else if (fileExtension === 'docx' || fileExtension === 'doc') {
    return parseDOCX(file);
  } else {
    throw new Error('Unsupported file type. Only PDF and DOC/DOCX files are supported.');
  }
}

/**
 * Parse PDF file and extract text using pdfjs-dist
 */
async function parsePDF(file: File): Promise<string> {
  try {
    // Load pdfjs-dist dynamically if not already loaded
    if (!pdfjsLib) {
      pdfjsLib = await import('pdfjs-dist');
      // Set the worker source to local file
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const loadingTask = pdfjsLib.getDocument(uint8Array);
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse DOCX file and extract text
 */
async function parseDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Split text into chunks for LLM processing
 */
export function chunkText(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    // If adding this sentence would exceed the limit, save current chunk
    if (currentChunk.length + trimmedSentence.length + 1 > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}