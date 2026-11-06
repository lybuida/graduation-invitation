/**
 * Minh Thịnh graduation RSVP → Google Sheets
 * Install as a bound Apps Script project inside your private Google Sheet.
 * Deploy > New deployment > Web app > Execute as Me; Who has access: Anyone.
 * Do not publish your Google Sheet or Apps Script source to GitHub.
 */
const SHEET_NAME = 'RSVP';
const MAX_WISH = 1200;

function doGet() {
  return HtmlService.createHtmlOutput('Graduation RSVP receiver is running.');
}

function doPost(e) {
  let nonce = '';
  try {
    const item = JSON.parse((e && e.parameter && e.parameter.payload) || '{}');
    nonce = String(item.nonce || '').slice(0, 100);
    const name = String(item.name || '').trim().replace(/\s+/g,' ');
    const status = String(item.status || '');
    const wish = String(item.wish || '').trim();
    const responseId = String(item.responseId || '').slice(0,100);
    if (!/^[a-zA-Z0-9.\-]{8,100}$/.test(responseId)) throw new Error('Invalid response ID.');
    if (item.source !== 'graduation-invite-v3') throw new Error('Invalid request.');
    if (name.length < 2 || name.length > 100) throw new Error('Name must be 2–100 characters.');
    if (status !== 'YES' && status !== 'NO') throw new Error('Please choose YES or NO.');
    if (wish.length > MAX_WISH) throw new Error('Wish is too long.');
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) throw new Error('Busy now. Please try again.');
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss) throw new Error('This script must be created from inside your Google Sheet.');
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(['Submitted At', 'Guest Name', 'RSVP', 'Wish', 'Response ID']);
      if(sheet.getRange(1,5).getValue() !== 'Response ID') sheet.getRange(1,5).setValue('Response ID');
      const safe = s => /^[\s]*[=+\-@]/.test(s) ? "'" + s : s;
      const count=sheet.getLastRow()-1;
      const ids=count>0?sheet.getRange(2,5,count,1).getValues().map(r=>String(r[0])):[];
      const index=ids.indexOf(responseId);
      const row=index<0?sheet.getLastRow()+1:index+2;
      sheet.getRange(row,1,1,5).setValues([[new Date(),safe(name),status,safe(wish),responseId]]);
      sheet.getRange(row,1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    } finally { lock.releaseLock(); }
    return reply_(nonce, true, '');
  } catch (err) {
    return reply_(nonce, false, String(err.message || err).slice(0, 200));
  }
}

function reply_(nonce, ok, error) {
  const data = JSON.stringify({type:'GRAD_RSVP_RESPONSE',nonce:nonce,ok:ok,error:error});
  // Escape dangerous HTML characters inside the inline script.
  const escaped = data.replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.top.postMessage(' + escaped + ',"*");<\/script></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
