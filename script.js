const currencies=[['USD','$','US Dollar'],['EUR','â‚¬','Euro'],['GBP','Â£','British Pound'],['CAD','C$','Canadian Dollar'],['AUD','A$','Australian Dollar'],['NZD','NZ$','New Zealand Dollar'],['PKR','â‚¨','Pakistani Rupee'],['INR','â‚¹','Indian Rupee'],['AED','Ø¯.Ø¥','UAE Dirham'],['SAR','ï·¼','Saudi Riyal'],['QAR','ï·¼','Qatari Riyal'],['KWD','KD','Kuwaiti Dinar'],['TRY','â‚º','Turkish Lira'],['JPY','Â¥','Japanese Yen'],['CNY','Â¥','Chinese Yuan'],['SGD','S$','Singapore Dollar'],['CHF','CHF','Swiss Franc'],['SEK','kr','Swedish Krona'],['NOK','kr','Norwegian Krone'],['DKK','kr','Danish Krone'],['PLN','zÅ‚','Polish Zloty'],['RON','lei','Romanian Leu'],['BRL','R$','Brazilian Real'],['MXN','$','Mexican Peso'],['ZAR','R','South African Rand']];
const $=id=>document.getElementById(id);let logoData='';
function fillCurrencies(){const s=$('currency');if(!s)return;currencies.forEach(c=>{let o=document.createElement('option');o.value=c[0];o.textContent=`${c[0]} â€” ${c[1]} ${c[2]}`;s.appendChild(o)});s.value='USD'}
function sym(){let c=currencies.find(x=>x[0]==$('currency').value);return c?c[1]:'$'}
function money(n){return sym()+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function addItem(desc='',qty=1,rate=0){const box=$('items');let div=document.createElement('div');div.className='item';div.innerHTML=`<div><label>Description</label><input class="desc" value="${desc}" placeholder="Website design service"></div><div><label>Qty</label><input class="qty" type="number" min="0" step="0.01" value="${qty}"></div><div><label>Rate</label><input class="rate" type="number" min="0" step="0.01" value="${rate}"></div><div><label>Total</label><input class="lineTotal" readonly></div><button class="btn danger" type="button" onclick="this.parentElement.remove();update()">Ã—</button>`;box.appendChild(div);div.querySelectorAll('input').forEach(i=>i.addEventListener('input',update));update()}
function addAccount(bank='',title='',number='',note=''){const box=$('accounts');let div=document.createElement('div');div.className='account-edit';div.innerHTML=`<div class="row"><div class="field"><label>Bank / Payment Method</label><input class="bank" value="${bank}" placeholder="Bank, PayPal, Wise"></div><div class="field"><label>Account Title</label><input class="accTitle" value="${title}" placeholder="Your name/company"></div></div><div class="field"><label>Account / IBAN / Email</label><input class="accNumber" value="${number}" placeholder="Account number, IBAN, PayPal email"></div><div class="field"><label>Extra Note</label><input class="accNote" value="${note}" placeholder="SWIFT, routing, branch, payment note"></div><button class="btn danger" type="button" onclick="this.parentElement.remove();update()">Remove Account</button>`;box.appendChild(div);div.querySelectorAll('input').forEach(i=>i.addEventListener('input',update));update()}
function update(){if(!$('invoice'))return;document.querySelectorAll('.item').forEach(r=>{r.querySelector('.lineTotal').value=((+r.querySelector('.qty').value||0)*(+r.querySelector('.rate').value||0)).toFixed(2)});let sub=[...document.querySelectorAll('.lineTotal')].reduce((a,i)=>a+(+i.value||0),0);let tax=sub*(+$('tax').value||0)/100;let disc=sub*(+$('discount').value||0)/100;let ship=+$('shipping').value||0;let advance=+$('advance').value||0;let total=sub+tax+ship-disc;let due=total-advance;let tpl=$('template').value;let inv=$('invoice');inv.className='invoice-paper template-'+tpl;let logo=logoData?`<img src="${logoData}" class="inv-logo">`:`<div class="logo-mark">IG</div>`;let items=[...document.querySelectorAll('.item')].map(r=>`<tr><td>${r.querySelector('.desc').value||'Service / Product'}</td><td>${r.querySelector('.qty').value}</td><td>${money(r.querySelector('.rate').value)}</td><td>${money(r.querySelector('.lineTotal').value)}</td></tr>`).join('');let accs=[...document.querySelectorAll('.account-edit')].map(a=>`<div class="account-card"><b>${a.querySelector('.bank').value||'Payment Method'}</b><br>Account Title: ${a.querySelector('.accTitle').value||'-'}<br>Account/IBAN/Email: ${a.querySelector('.accNumber').value||'-'}<br><span class="muted">${a.querySelector('.accNote').value||''}</span></div>`).join('');inv.innerHTML=`<div class="inv-head"><div>${logo}<h3>${$('company').value||'Your Company'}</h3><div class="muted">${($('companyInfo').value||'Company address, email, phone').replaceAll('\n','<br>')}</div></div><div class="inv-title"><h2>INVOICE</h2><b>#${$('invoiceNo').value||'INV-001'}</b><br><span class="muted">Date: ${$('date').value||''}<br>Due: ${$('dueDate').value||''}<br>Currency: ${$('currency').value}</span></div></div><div class="bill-grid"><div><h4>Bill To</h4><b>${$('client').value||'Client Name'}</b><div class="muted">${($('clientInfo').value||'Client address, email, phone').replaceAll('\n','<br>')}</div></div><div><h4>Project / Notes</h4><div class="muted">${($('notes').value||'Thank you for your business.').replaceAll('\n','<br>')}</div></div></div><table class="invoice-table"><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead><tbody>${items}</tbody></table><div class="totals"><div><span>Subtotal</span><b>${money(sub)}</b></div><div><span>Tax (${$('tax').value||0}%)</span><b>${money(tax)}</b></div><div><span>Discount (${$('discount').value||0}%)</span><b>-${money(disc)}</b></div><div><span>Shipping / Other</span><b>${money(ship)}</b></div><div class="grand"><span>Total</span><span>${money(total)}</span></div><div><span>Advance Paid</span><b>${money(advance)}</b></div><div class="grand"><span>Balance Due</span><span>${money(due)}</span></div></div><div class="paybox"><h4>Payment / Bank Details</h4><div class="accounts">${accs||'<span class="muted">No payment details added.</span>'}</div></div><p class="small muted">Generated by Free Professional Invoice Generator.</p>`}
function setup(){fillCurrencies();let d=new Date().toISOString().slice(0,10);if($('date')){$('date').value=d;$('dueDate').value=d;addItem('Website design service',1,250);addItem('SEO setup',1,75);addAccount('Bank Transfer','Your Company','IBAN / Account Number','Add SWIFT or routing details here');document.querySelectorAll('input,textarea,select').forEach(i=>i.addEventListener('input',update));$('logoUpload').addEventListener('change',e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{logoData=r.result;update()};r.readAsDataURL(f)});update()}}
function printInvoice(){window.print()}
function downloadPDF(){
  const el=$('invoice');
  html2canvas(el,{scale:2,useCORS:true,allowTaint:true,backgroundColor:'#ffffff',scrollY:0,windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight}).then(canvas=>{
    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF('p','mm','a4');
    const pageW=210, pageH=297;
    const margin=8;
    const imgW=pageW-(margin*2);
    const imgH=canvas.height*imgW/canvas.width;

    // If invoice is longer than one A4 page, split the canvas into multiple PDF pages
    // so bottom sections like Payment / Bank Details are not cut off.
    const pageCanvasHeight=Math.floor((pageH-(margin*2))*canvas.width/imgW);
    let renderedHeight=0;
    let pageIndex=0;

    while(renderedHeight<canvas.height){
      const sliceHeight=Math.min(pageCanvasHeight,canvas.height-renderedHeight);
      const pageCanvas=document.createElement('canvas');
      pageCanvas.width=canvas.width;
      pageCanvas.height=sliceHeight;
      const ctx=pageCanvas.getContext('2d');
      ctx.fillStyle='#ffffff';
      ctx.fillRect(0,0,pageCanvas.width,pageCanvas.height);
      ctx.drawImage(canvas,0,renderedHeight,canvas.width,sliceHeight,0,0,canvas.width,sliceHeight);

      if(pageIndex>0) pdf.addPage();
      const pageImg=pageCanvas.toDataURL('image/png');
      const slicePdfH=sliceHeight*imgW/canvas.width;
      pdf.addImage(pageImg,'PNG',margin,margin,imgW,slicePdfH);
      renderedHeight+=sliceHeight;
      pageIndex++;
    }
    pdf.save(($('invoiceNo').value||'invoice')+'.pdf');
  });
}
window.addEventListener('DOMContentLoaded',setup);
