import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

interface GenerateDocumentParams<T> {
  path: string; // Path to the template file
  data: T; // Data to populate the template
}

/**
 * Generates a Word document using a template and provided data.
 * @template T - The type of the data object.
 * @param {GenerateDocumentParams<T>} params - Parameters containing the template path and data.
 * @returns {Buffer} - Buffer containing the content of the generated file.
 * @throws {Error} - If an error occurs while processing the template.
 */
function generateDocument<T>(params: GenerateDocumentParams<T>): Buffer {
  try {
    // Validate that the template path and data are provided
    if (!params?.path || !params?.data) {
      throw new Error("Template path and data are required.");
    }

    // Read the template file in binary format
    const content = fs.readFileSync(params.path, "binary");

    // Create an instance of PizZip with the file content
    const zip = new PizZip(content);

    // Initialize Docxtemplater with the necessary configuration
    const docx = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Assign the provided data to the document
    docx.setData(params.data);

    // Render the document with the provided data
    docx.render();

    // Generate the final file as a buffer
    return docx.getZip().generate({ type: "nodebuffer" });
  } catch (error) {
    console.error("Error generating the document:", error);
    throw error;
  }
}

export default generateDocument;
