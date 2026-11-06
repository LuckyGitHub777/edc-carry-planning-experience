import {buildKit} from './model.mjs';
import {safeExternalUrl} from './url-policy.mjs';
const $=sel=>document.querySelector(sel);
const form=$('#kit-form'), mission=$('#mission'), carry=$('#carry'), budget=$('#budget');
const paramKit = new URLSearchParams(window.location.search);
for (const [key, control] of [['mission', mission], ['carry', carry]]) {
  const val=paramKit.get(key);
  if (val && Array.from(control.options).some(option=>option.value===val)) control.value=val;
}
const paramBudget=Number(paramKit.get('budget'));
if (paramKit.has('budget') && Number.isInteger(paramBudget) && paramBudget>=50 && paramBudget<=500 && paramBudget%10===0) budget.value=String(paramBudget);
const config=window.CARRY_CONFIG||{};
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
let kit;
function render(){
  kit=buildKit({mission:mission.value,carry:carry.value,budget:Number(budget.value)});
  $('#budget-out').textContent=money(kit.budget);
  $('#result-title').textContent=kit.mission;
  $('#result-desc').textContent=kit.subtitle;
  $('#total-cost').textContent=money(kit.total);
  $('#budget-remaining').textContent=money(kit.remaining)+' unallocated';
  const list=$('#item-list');list.replaceChildren();
  kit.included.forEach((item,i)=>{
    const card=document.createElement('article');card.className='item';
    const top=document.createElement('div');top.className='itemtop';
    const h=document.createElement('h4');h.textContent=String(i+1).padStart(2,'0')+' / '+item.name;
    const cost=document.createElement('span');cost.className='cost';cost.textContent=money(item.cost);
    top.append(h,cost);
    const p=document.createElement('p');p.textContent=item.benefit;
    const tag=document.createElement('span');tag.className='tag';tag.textContent=item.weight;
    card.append(top,p,tag);list.append(card);
  });
  $('#skipped').textContent=kit.skipped.length?`${kit.skipped.length} item(s) not included because of space or illustrative budget. The system favors essentials first.`:'Every suggested item fits the chosen space and illustrative allocation.';
}
form.addEventListener('submit',e=>{e.preventDefault();render();$('#results').scrollIntoView({behavior:'smooth',block:'nearest'});});
budget.addEventListener('input',()=>{$('#budget-out').textContent=money(Number(budget.value));});
$('#download').addEventListener('click',()=>{
  const lines=[`CARRY / SYSTEMS — ${kit.mission}`,kit.subtitle,'',`Budget: ${money(kit.budget)} | Planned: ${money(kit.total)} | Remaining: ${money(kit.remaining)}`,'','PLAN'];
  kit.included.forEach((item,i)=>lines.push(`${i+1}. ${item.name} [${money(item.cost)} illustrative] — ${item.benefit}`));
  lines.push('','Before buying: inventory what you own; confirm specs and permitted use; compare retailer offers.','Estimated allocations are NOT live prices.');
  const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='my-carry-system.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('#share').addEventListener('click',async()=>{
  const url=new URL(window.location.href);
  url.search='';
  url.searchParams.set('mission',mission.value);
  url.searchParams.set('carry',carry.value);
  url.searchParams.set('budget',budget.value);
  try {
    await navigator.clipboard.writeText(url.href);
    $('#share-feedback').textContent='Kit link copied — it contains only the three selected kit settings.';
  } catch {
    $('#share-feedback').textContent='Copy this link from the address bar: '+url.href;
    window.history.replaceState(null,'',url.pathname+url.search+url.hash);
  }
});
$('#print').addEventListener('click',()=>window.print());

function enableLink(selector,url,label){const el=$(selector);const href=safeExternalUrl(url);if(!href)return;el.href=href;el.target='_blank';el.rel='noopener noreferrer';el.classList.remove('disabled');el.removeAttribute('aria-disabled');el.textContent=label;}
enableLink('#digital-link',config.digitalProductUrl,'VIEW THE CARRY RESET PACK ↗');
enableLink('#newsletter-link',config.newsletterUrl,'JOIN THE WEEKLY CARRY BRIEF ↗');
if(config.amazonAssociateEnabled){$('#amazon-disclosure').hidden=false;}
render();
