import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function usePdfGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async (elementRef, fileName = 'recipe.pdf') => {
    if (!elementRef.current) return;

    setIsGenerating(true);

    try {
      const element = elementRef.current;
      
      // 1. Konfiguracja Canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Wysoka jakość
        useCORS: true,
        logging: false,
        backgroundColor: '#fffbf2'
      });

      // 2. Wymiary
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Lekka kompresja
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();   // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // 3. Pierwsza strona
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // 4. Kolejne strony (pętla)
      // POPRAWKA: Zmieniliśmy warunek z (heightLeft > 0) na (heightLeft >= 1)
      // Dzięki temu ignorujemy resztki mniejsze niż 1mm (błędy zaokrągleń)
      while (heightLeft >= 1) {
        position = heightLeft - imgHeight; 
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(fileName);

    } catch (error) {
      console.error('Błąd generowania PDF:', error);
      alert('Wystąpił błąd podczas tworzenia pliku PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePdf, isGenerating };
}