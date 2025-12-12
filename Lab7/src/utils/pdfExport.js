import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(boardElement, filename = 'kanban-board') {
  try {
    if (!boardElement) {
      throw new Error('Board element not found')
    }

    const canvas = await html2canvas(boardElement, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: boardElement.scrollWidth,
      height: boardElement.scrollHeight,
      windowWidth: boardElement.scrollWidth,
      windowHeight: boardElement.scrollHeight
    })

    if (!canvas) {
      throw new Error('Failed to create canvas')
    }

    const imgData = canvas.toDataURL('image/png', 1.0)
    
    if (!imgData || imgData === 'data:,') {
      throw new Error('Failed to convert canvas to image')
    }

    const pdf = new jsPDF('landscape', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgScaledWidth = imgWidth * ratio * 0.264583
    const imgScaledHeight = imgHeight * ratio * 0.264583
    const xOffset = (pdfWidth - imgScaledWidth) / 2
    const yOffset = (pdfHeight - imgScaledHeight) / 2

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight)
    pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`)
    
    return true
  } catch (error) {
    console.error('PDF export failed:', error)
    throw error
  }
}
