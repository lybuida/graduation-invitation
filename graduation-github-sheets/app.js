'use strict';
const $ = id => document.getElementById(id);
const endpoint = String(window.INVITATION_CONFIG?.appsScriptUrl || '').trim();
const live = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(endpoint);
let guest = null, choice = null, processing = false;
const normalize = s => s.trim().replace(/\s+/g, ' ');
function stage(id) { ['welcome','invitation','result'].forEach(s => $(s).hidden = s !== id); window.scrollTo({top:0,behavior:'smooth'}); }
function error(id, msg) { $(id).textContent = msg; $(id).hidden = !msg; }
function localKey(name) { return 'grad-rsvp-v3-' + name.normalize('NFD').toLowerCase(); }
function previewLoad(name) { try { return JSON.parse(localStorage.getItem(localKey(name)) || '{}'); } catch { return {}; } }
function saveData(status, wish) {
  if (!live) {
    localStorage.setItem(localKey(guest.name), JSON.stringify({status,wish}));
    return Promise.resolve({status,wish, preview:true});
  }
  // A cross-origin HTML FORM works with Apps Script despite CORS restrictions.
  // Script replies inside the hidden iframe via postMessage; we wait for a verified ack.
  return new Promise((resolve, reject) => {
    const nonce = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
    const iframe = document.createElement('iframe');
    iframe.name = 'grad-submit-' + nonce.replace(/[^a-zA-Z0-9-]/g,'');
    iframe.style.display = 'none';
    iframe.title = 'RSVP submission';
    const form = document.createElement('form');
    form.method = 'POST'; form.action = endpoint; form.target = iframe.name;
    form.style.display = 'none'; form.acceptCharset = 'utf-8';
    const payload = {responseId: guest.responseId,name:guest.name,status,wish,nonce,source:'graduation-invite-v3'};
    const input = document.createElement('input');
    input.type = 'hidden'; input.name = 'payload'; input.value = JSON.stringify(payload);
    form.append(input);
    let finished = false;
    const cleanup = () => { clearTimeout(timer); window.removeEventListener('message', onMessage); form.remove(); setTimeout(() => iframe.remove(), 500); };
    const finish = (err, data) => { if(finished)return; finished = true; cleanup(); err ? reject(err) : resolve(data); };
    const onMessage = event => {
      // Apps Script may serve HTML from either googleusercontent.com or google.com.
      if (!/^https:\/\/(?:[a-z0-9-]+\.)*(?:googleusercontent\.com|google\.com)$/.test(event.origin)) return;
      if (!event.data || event.data.type !== 'GRAD_RSVP_RESPONSE' || event.data.nonce !== nonce) return;
      if (event.data.ok) finish(null,{status,wish});
      else finish(new Error(event.data.error || 'Could not save your RSVP. Please try again.'));
    };
    const timer = setTimeout(() => finish(new Error('No confirmation from Google Sheets. Please try again, or contact Minh Thinh.')), 25000);
    window.addEventListener('message',onMessage);
    document.body.append(iframe,form);
    form.submit();
  });
}

const friends = [
 ['Nguyễn Khắc Nam Thi','The bestie of my life','friend-5.png'],
 ['Lê Minh Thư','My Day–one bestie','friend-minh-thu.png'],
 ['Lê Hoàng Yến Nhi','The lifelong bestie','friend-6.png'],
 ['Nguyễn Ngọc Minh Hằng','My baby kuu','friend-7.png'],
 ['Trần Ngọc Anh Thư','The lốp of my life','friend-8.png'],
 ['Châu Thụy Cát Tường','Best mama of ages','friend-9.jpeg']
];
const withoutAccents = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
const matchName = s => normalize(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
let friend = null;
$('nameForm').addEventListener('submit', ev => {
 ev.preventDefault();
 const name=normalize($('guestName').value);
 if(name.length<2)return error('lookupError','Please enter your full name.');
 const sameGuest=guest && matchName(guest.name)===matchName(name);
 const draftWish=sameGuest?$('wishText').value:null;
 guest={name,...previewLoad(name)};guest.responseId=guest.responseId||(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random());friend=friends.find(f=>matchName(f[0])===matchName(name));
 $('recipientName').textContent=withoutAccents(name);
 $('recipientName').style.fontSize=(Math.max(2.8,Math.min(8.2,125/name.length)))+'cqw';
 $('specialTitle').textContent=friend?withoutAccents(friend[1]):'Espcecially for you';
 $('dearName').textContent=withoutAccents(name);
 $('letterMemory').hidden=!(friend && friend[2]);
 if(friend && friend[2]){$('letterMemoryPhoto').src='assets/'+friend[2];$('letterMemoryPhoto').alt='A memory with '+withoutAccents(name);}
 else{$('letterMemoryPhoto').removeAttribute('src');}
 $('existingAnswer').hidden=true;
 $('wishText').value=draftWish!==null?draftWish:(guest.wish||'');
 error('lookupError','');stage('invitation');startMusic();
});
async function persist(wish){
 if(processing)return;
 processing=true;$('sendNoBtn').disabled=true;
 $('saveStatus').textContent=live?'Saving your response…':'Preview: saved on this device only. Google Sheets is not connected.';
 try{await saveData(choice,wish);guest.status=choice;guest.wish=wish;
 localStorage.setItem(localKey(guest.name),JSON.stringify({status:choice,wish,responseId:guest.responseId}));
 $('saveStatus').textContent=live?'Your response has been saved. ♡':'Preview: saved on this device only. Google Sheets is not connected.';
 }catch(e){$('saveStatus').textContent=e.message+' Use the button below to retry.';}
 finally{processing=false;$('sendNoBtn').disabled=false;}
}
function choose(status){
 if(processing)return;choice=status;const yes=status==='YES';
 $('resultIcon').textContent=yes?'✧ ♡ ✧':'♡';
 $('resultEyebrow').textContent='A LITTLE NOTE FOR YOU';
 $('resultTitle').textContent=yes?'Love it ♡':'Sending you a big hug!';
 $('resultMessage').textContent=yes?'So glad that you can make it. I can’t wait to celebrate together!':'You’ll be missed, but your love still means so much to me.';
 $('choiceThanksTitle').textContent='';$('choiceThanksMessage').textContent='';$('yesEventReminder').hidden=true;
 $('wishStep').hidden=false;
 $('sendNoBtn').textContent='Send my wish ♡';
 $('specialMemory').hidden=!friend;
 if(friend){$('memoryTitle').textContent=withoutAccents(friend[1]);$('memoryPhoto').hidden=!friend[2];$('memoryPlaceholder').hidden=!!friend[2];if(friend[2])$('memoryPhoto').src='assets/'+friend[2];else $('memoryPhoto').removeAttribute('src');}
 stage('result');persist($('wishText').value.trim());
}
$('yesBtn').addEventListener('click',()=>choose('YES'));
$('noBtn').addEventListener('click',()=>choose('NO'));
$('sendNoBtn').addEventListener('click',()=>persist($('wishText').value.trim()));
$('editBtn').addEventListener('click',()=>{if(!processing)stage('invitation');});
const thanks=document.createElement('p');thanks.textContent='Thank you for being part of my precious day!';$('resultMessage').after(thanks);
let audio=null,playing=false,musicEnabled=true;
async function startMusic(){
 if(playing || !musicEnabled)return;
 try{
 const url=window.INVITATION_CONFIG?.musicUrl;
 if(!url){$('musicLabel').textContent='Music unavailable';return;}
 audio=audio||new Audio(url);audio.loop=true;audio.volume=.35;
 await audio.play();playing=true;
 $('musicLabel').textContent='Music on';$('musicBtn').setAttribute('aria-pressed','true');
 }catch(e){$('musicLabel').textContent=e.name==='NotAllowedError'?'Music on · tap to play':'Music unavailable';playing=false;}
}
$('musicBtn').addEventListener('click',()=>{
 musicEnabled=!musicEnabled;
 $('musicBtn').setAttribute('aria-pressed',String(musicEnabled));
 if(musicEnabled){$('musicLabel').textContent='Music on';startMusic();}
 else{if(audio)audio.pause();playing=false;$('musicLabel').textContent='Music off';}
});
function resumeMusic(e){if(e.target.closest && e.target.closest('#musicBtn'))return;if(musicEnabled&&!playing)startMusic();}
document.addEventListener('pointerdown',resumeMusic,{passive:true});
document.addEventListener('keydown',resumeMusic);
startMusic();

$('backToWelcome').addEventListener('click',()=>stage('welcome'));
$('backToInvitation').addEventListener('click',()=>stage('invitation'));
