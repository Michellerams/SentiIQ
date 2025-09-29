
// This file relies on scripts loaded in index.html (FileSaver.js and html-docx.js)
// We declare them here to satisfy TypeScript's type checker.
declare const saveAs: (blob: Blob, filename: string) => void;
declare const htmlDocx: {
  asBlob: (html: string, options?: any) => Blob;
};

export const exportHtmlAsDocx = (htmlContent: string, fileName: string): void => {
  try {
    const converted = htmlDocx.asBlob(htmlContent, {
      orientation: 'portrait',
      margins: {
        top: 720, // 1 inch = 720
        right: 720,
        bottom: 720,
        left: 720,
      }
    });
    saveAs(converted, fileName);
  } catch (error) {
    console.error("Error exporting to DOCX:", error);
    alert("Could not export the document. Please ensure your browser allows file downloads.");
  }
};
