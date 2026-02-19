-- Add file_data column to sources table for storing base64-encoded PDF/DOC content
ALTER TABLE sources ADD COLUMN IF NOT EXISTS file_data TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN sources.file_data IS 'Base64-encoded file content for PDFs and documents sent directly to AI';
