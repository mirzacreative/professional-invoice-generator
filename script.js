const currencies = [
  ['USD', '$', 'US Dollar'], ['EUR', 'EUR', 'Euro'], ['GBP', 'GBP', 'British Pound'],
  ['CAD', 'C$', 'Canadian Dollar'], ['AUD', 'A$', 'Australian Dollar'], ['NZD', 'NZ$', 'New Zealand Dollar'],
  ['PKR', 'PKR', 'Pakistani Rupee'], ['INR', 'INR', 'Indian Rupee'], ['AED', 'AED', 'UAE Dirham'],
  ['SAR', 'SAR', 'Saudi Riyal'], ['QAR', 'QAR', 'Qatari Riyal'], ['KWD', 'KD', 'Kuwaiti Dinar'],
  ['TRY', 'TRY', 'Turkish Lira'], ['JPY', 'JPY', 'Japanese Yen'], ['CNY', 'CNY', 'Chinese Yuan'],
  ['SGD', 'S$', 'Singapore Dollar'], ['CHF', 'CHF', 'Swiss Franc'], ['SEK', 'kr', 'Swedish Krona'],
  ['NOK', 'kr', 'Norwegian Krone'], ['DKK', 'kr', 'Danish Krone'], ['PLN', 'PLN', 'Polish Zloty'],
  ['RON', 'lei', 'Romanian Leu'], ['BRL', 'R$', 'Brazilian Real'], ['MXN', '$', 'Mexican Peso'],
  ['ZAR', 'R', 'South African Rand']
];

const $ = id => document.getElementById(id);
let logoData = '';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function lines(value, fallback) {
  return escapeHtml(value || fallback).replace(/\n/g, '<br>');
}

function fillCurrencies() {
  const select = $('currency');
  if (!select) return;
  currencies.forEach(currency => {
    const option = document.createElement('option');
    option.value = currency[0];
    option.textContent = `${currency[0]} - ${currency[1]} ${currency[2]}`;
    select.appendChild(option);
  });
  select.value = 'USD';
}

function sym() {
  const selected = currencies.find(currency => currency[0] === $('currency').value);
  return selected ? selected[1] : '$';
}

function money(value) {
  return sym() + Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function addItem(desc = '', qty = 1, rate = 0) {
  const box = $('items');
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `<div><label>Description</label><input class="desc" placeholder="Website design service"></div><div><label>Qty</label><input class="qty" type="number" min="0" step="0.01"></div><div><label>Rate</label><input class="rate" type="number" min="0" step="0.01"></div><div><label>Total</label><input class="lineTotal" readonly></div><button class="btn danger" type="button" onclick="this.parentElement.remove();update()">x</button>`;
  box.appendChild(div);
  div.querySelector('.desc').value = desc;
  div.querySelector('.qty').value = qty;
  div.querySelector('.rate').value = rate;
  div.querySelectorAll('input').forEach(input => input.addEventListener('input', update));
  update();
}

function addAccount(bank = '', title = '', number = '', note = '') {
  const box = $('accounts');
  const div = document.createElement('div');
  div.className = 'account-edit';
  div.innerHTML = `<div class="row"><div class="field"><label>Bank / Payment Method</label><input class="bank" placeholder="Bank, PayPal, Wise"></div><div class="field"><label>Account Title</label><input class="accTitle" placeholder="Your name/company"></div></div><div class="field"><label>Account / IBAN / Email</label><input class="accNumber" placeholder="Account number, IBAN, PayPal email"></div><div class="field"><label>Extra Note</label><input class="accNote" placeholder="SWIFT, routing, branch, payment note"></div><button class="btn danger" type="button" onclick="this.parentElement.remove();update()">Remove Account</button>`;
  box.appendChild(div);
  div.querySelector('.bank').value = bank;
  div.querySelector('.accTitle').value = title;
  div.querySelector('.accNumber').value = number;
  div.querySelector('.accNote').value = note;
  div.querySelectorAll('input').forEach(input => input.addEventListener('input', update));
  update();
}

function update() {
  if (!$('invoice')) return;

  document.querySelectorAll('.item').forEach(row => {
    const qty = +row.querySelector('.qty').value || 0;
    const rate = +row.querySelector('.rate').value || 0;
    row.querySelector('.lineTotal').value = (qty * rate).toFixed(2);
  });

  const sub = [...document.querySelectorAll('.lineTotal')].reduce((total, input) => total + (+input.value || 0), 0);
  const tax = sub * (+$('tax').value || 0) / 100;
  const discount = sub * (+$('discount').value || 0) / 100;
  const shipping = +$('shipping').value || 0;
  const advance = +$('advance').value || 0;
  const total = sub + tax + shipping - discount;
  const due = total - advance;
  const template = $('template').value;
  const invoice = $('invoice');
  invoice.className = 'invoice-paper template-' + template;

  const logo = logoData ? `<img src="${logoData}" class="inv-logo" alt="Invoice logo">` : '<div class="logo-mark">IG</div>';
  const items = [...document.querySelectorAll('.item')].map(row => {
    const desc = escapeHtml(row.querySelector('.desc').value || 'Service / Product');
    const qty = escapeHtml(row.querySelector('.qty').value);
    const rate = money(row.querySelector('.rate').value);
    const lineTotal = money(row.querySelector('.lineTotal').value);
    return `<tr><td>${desc}</td><td>${qty}</td><td>${rate}</td><td>${lineTotal}</td></tr>`;
  }).join('');

  const accounts = [...document.querySelectorAll('.account-edit')].map(account => {
    const bank = escapeHtml(account.querySelector('.bank').value || 'Payment Method');
    const title = escapeHtml(account.querySelector('.accTitle').value || '-');
    const number = escapeHtml(account.querySelector('.accNumber').value || '-');
    const note = escapeHtml(account.querySelector('.accNote').value || '');
    return `<div class="account-card"><b>${bank}</b><br>Account Title: ${title}<br>Account/IBAN/Email: ${number}<br><span class="muted">${note}</span></div>`;
  }).join('');

  invoice.innerHTML = `<div class="inv-head"><div>${logo}<h3>${escapeHtml($('company').value || 'Your Company')}</h3><div class="muted">${lines($('companyInfo').value, 'Company address, email, phone')}</div></div><div class="inv-title"><h2>INVOICE</h2><b>#${escapeHtml($('invoiceNo').value || 'INV-001')}</b><br><span class="muted">Date: ${escapeHtml($('date').value || '')}<br>Due: ${escapeHtml($('dueDate').value || '')}<br>Currency: ${escapeHtml($('currency').value)}</span></div></div><div class="bill-grid"><div><h4>Bill To</h4><b>${escapeHtml($('client').value || 'Client Name')}</b><div class="muted">${lines($('clientInfo').value, 'Client address, email, phone')}</div></div><div><h4>Project / Notes</h4><div class="muted">${lines($('notes').value, 'Thank you for your business.')}</div></div></div><table class="invoice-table"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${items}</tbody></table><div class="totals"><div><span>Subtotal</span><b>${money(sub)}</b></div><div><span>Tax (${escapeHtml($('tax').value || 0)}%)</span><b>${money(tax)}</b></div><div><span>Discount (${escapeHtml($('discount').value || 0)}%)</span><b>-${money(discount)}</b></div><div><span>Shipping / Other</span><b>${money(shipping)}</b></div><div class="grand"><span>Total</span><span>${money(total)}</span></div><div><span>Advance Paid</span><b>${money(advance)}</b></div><div class="grand"><span>Balance Due</span><span>${money(due)}</span></div></div><div class="paybox"><h4>Payment / Bank Details</h4><div class="accounts">${accounts || '<span class="muted">No payment details added.</span>'}</div></div><p class="small muted">Generated by Free Invoice Generator.</p>`;
}

function setup() {
  fillCurrencies();
  const today = new Date().toISOString().slice(0, 10);
  if (!$('date')) return;
  $('date').value = today;
  $('dueDate').value = today;
  addItem('Website design service', 1, 250);
  addItem('SEO setup', 1, 75);
  addAccount('Bank Transfer', 'Your Company', 'IBAN / Account Number', 'Add SWIFT or routing details here');
  document.querySelectorAll('input,textarea,select').forEach(input => input.addEventListener('input', update));
  $('logoUpload').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      logoData = reader.result;
      update();
    };
    reader.readAsDataURL(file);
  });
  update();
}

function printInvoice() {
  window.print();
}

function downloadPDF() {
  const element = $('invoice');
  html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scrollY: 0,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight
  }).then(canvas => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210;
    const pageH = 297;
    const margin = 8;
    const imgW = pageW - (margin * 2);
    const pageCanvasHeight = Math.floor((pageH - (margin * 2)) * canvas.width / imgW);
    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
      const sliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeight;
      const ctx = pageCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, renderedHeight, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      if (pageIndex > 0) pdf.addPage();
      const pageImg = pageCanvas.toDataURL('image/png');
      const slicePdfH = sliceHeight * imgW / canvas.width;
      pdf.addImage(pageImg, 'PNG', margin, margin, imgW, slicePdfH);
      renderedHeight += sliceHeight;
      pageIndex++;
    }
    pdf.save(($('invoiceNo').value || 'invoice') + '.pdf');
  });
}

window.addEventListener('DOMContentLoaded', setup);
