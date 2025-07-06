import { formatRupiahForPrint } from './formatter'

interface OrderItem {
  productName: string
  quantity: number
  soldPricePerUnit: string
  totalPrice: string
}

interface InvoiceData {
  order: {
    guid: string
    storeName: string
    orderDate: string
    status: string
    notes?: string
  }
  items: OrderItem[]
}

export const generateThermalPrintContent = (data: InvoiceData) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateTotal = () => {
    return data.items.reduce((total, item) => total + Number(item.totalPrice), 0)
  }

  const total = calculateTotal()

  // Thermal printer content with proper formatting
  const content = `
<div style="width: 280px; font-family: monospace; font-size: 12px; line-height: 1.2;">
  <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px;">
    <h2 style="margin: 0; font-size: 16px; font-weight: bold;">INVOICE</h2>
    <p style="margin: 2px 0;">${data.order.storeName}</p>
    <p style="margin: 2px 0; font-size: 10px;">No: ${data.order.guid}</p>
  </div>

  <div style="margin-bottom: 8px; font-size: 10px;">
    <p style="margin: 2px 0;">Tanggal: ${formatDate(data.order.orderDate)}</p>
    <p style="margin: 2px 0;">Status: ${data.order.status.toUpperCase()}</p>
  </div>

  <div style="border-bottom: 1px dashed #000; margin-bottom: 8px;"></div>

  <div style="margin-bottom: 8px;">
    ${data.items
      .map(
        (item) => `
      <div style="margin-bottom: 6px;">
        <div style="font-weight: bold; font-size: 11px;">${item.productName}</div>
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <span>${item.quantity} x Rp ${formatRupiahForPrint(item.soldPricePerUnit)}</span>
          <span>Rp ${formatRupiahForPrint(item.totalPrice)}</span>
        </div>
      </div>
    `,
      )
      .join('')}
  </div>

  <div style="border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px;">
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px;">
      <span>TOTAL:</span>
      <span>Rp ${formatRupiahForPrint(total)}</span>
    </div>
  </div>

  ${
    data.order.notes
      ? `
    <div style="margin-top: 8px; font-size: 10px;">
      <p style="margin: 2px 0;">Catatan: ${data.order.notes}</p>
    </div>
  `
      : ''
  }

  <div style="text-align: center; margin-top: 12px; font-size: 10px;">
    <p style="margin: 2px 0;">Terima kasih atas pembelian Anda</p>
    <p style="margin: 2px 0;">Printed: ${new Date().toLocaleString('id-ID')}</p>
  </div>
</div>
  `.trim()

  return content
}

export const printThermalInvoice = (data: InvoiceData) => {
  const content = generateThermalPrintContent(data)

  // Create new window for printing
  const printWindow = window.open('', '_blank', 'width=300,height=600')

  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${data.order.guid}</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 8px;
              }
            }
            body {
              margin: 0;
              padding: 8px;
              background: white;
            }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}
