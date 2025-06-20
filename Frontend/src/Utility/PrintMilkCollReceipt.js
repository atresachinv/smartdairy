// Define layout templates for each printer type
function generateLaserA4(data) {
  return `
      <h1>Laser A4 Receipt</h1>
      <p>Customer: ${data.customer}</p>
      <p>Total: ₹${data.total}</p>
      <p>Date: ${data.date}</p>
    `;
}

function generateLaserA5(data) {
  return `
      <h2 style="text-align:center">Laser A5 Invoice</h2>
      <p>Customer: ${data.customer}</p>
      <p>Amount: ₹${data.total}</p>
    `;
}

function generateDotA4(data) {
  return `
      <pre>
  +-----------------------------+
  |         DOT A4 RECEIPT      |
  | Customer: ${data.customer}           
  | Total:    ₹${data.total}        
  | Date:     ${data.date}       
  +-----------------------------+
      </pre>
    `;
}

function generateThermal58(data) {
  return `
      <p style="text-align:center;">🧾 58mm Thermal Receipt</p>
      <p>Customer: ${data.customer}</p>
      <p>Amt: ₹${data.total}</p>
      <p>${data.date}</p>
    `;
}

function generateThermal80(data) {
  return `
      <p style="text-align:center;">🧾 80mm Thermal Receipt</p>
      <p>Customer: ${data.customer}</p>
      <p>Total: ₹${data.total}</p>
      <p>${data.date}</p>
    `;
}

// Main print function
export function printMilkCollReceipt(printerType, data) {
  const layoutMap = {
    "laser-a4": generateLaserA4,
    "laser-a5": generateLaserA5,
    "dot-a4": generateDotA4,
    "thermal-58": generateThermal58,
    "thermal-80": generateThermal80,
  };

  const generateHTML = layoutMap[printerType];
  if (!generateHTML) {
    alert("Unsupported printer type!");
    return;
  }

  const htmlContent = generateHTML(data);
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write("<html><head><title>Print</title>");
  printWindow.document.write(`
      <style>
        body { font-family: sans-serif; padding: 10px; }
        .laser-a4 { width: 210mm; font-size: 14px; }
        .laser-a5 { width: 148mm; font-size: 12px; }
        .dot-a4 { width: 210mm; font-family: 'Courier New', monospace; font-size: 12px; }
        .thermal-58 { width: 58mm; font-size: 10px; }
        .thermal-80 { width: 80mm; font-size: 11px; }
      </style>
    `);
  printWindow.document.write("</head><body>");
  printWindow.document.write(
    `<div class="receipt ${printerType}">${htmlContent}</div>`
  );
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
