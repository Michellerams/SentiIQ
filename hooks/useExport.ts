
import { RefObject } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AnalysisResult } from '../types';

export const useExport = (
  elementRef: RefObject<HTMLDivElement>,
  data: AnalysisResult[]
) => {
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportToJSON = () => {
    if (data.length === 0) return;
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, 'sentiment_analysis_results.json', 'application/json');
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    const headers = ['text', 'sentiment', 'confidence', 'keywords', 'explanation'];
    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        `"${row.text.replace(/"/g, '""')}"`,
        row.sentiment,
        row.confidence,
        `"${row.keywords.join('; ')}"`,
        `"${row.explanation.replace(/"/g, '""')}"`,
      ].join(','))
    ];
    const csvString = csvRows.join('\n');
    downloadFile(csvString, 'sentiment_analysis_results.csv', 'text/csv');
  };

  const exportToPDF = async () => {
    const element = elementRef.current;
    if (!element || data.length === 0) return;
    
    // Temporarily increase resolution for better quality
    const scale = 2;
    const canvas = await html2canvas(element, {
        scale,
        backgroundColor: '#1e293b', // bg-slate-800
        useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / scale, canvas.height / scale]
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('sentiment_analysis_report.pdf');
  };

  return { exportToJSON, exportToCSV, exportToPDF };
};
