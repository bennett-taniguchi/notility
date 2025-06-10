// pages/api/pdf/extract.js
import pdf from 'pdf-parse';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  
  try {
    const [fields, files] = await form.parse(req);
    const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    
    if (!pdfFile) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const pdfBuffer = fs.readFileSync(pdfFile.filepath);
    const data = await pdf(pdfBuffer);
    
    // Cleanup temp file
    fs.unlinkSync(pdfFile.filepath);
    
    res.json({ 
      text: data.text,
      pages: data.numpages 
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    res.status(500).json({ error: 'PDF processing failed' });
  }
}