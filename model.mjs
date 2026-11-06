/** Original category-level planning guidance. Prices are illustrative allocations, NOT live offers. */
export const MISSIONS = {
  commute: { label:'City commute', subtitle:'A composed, low-friction weekday carry.', ids:['wallet','keys','cable','power','notebook','pouch','light','water'] },
  founder: { label:'Work anywhere', subtitle:'Move between meetings, desks and airports without friction.', ids:['wallet','keys','cable','power','notebook','pouch','stand','water'] },
  travel: { label:'Travel day', subtitle:'Keep essentials accessible and checkpoints simple.', ids:['wallet','keys','cable','power','documents','pouch','water','notebook'] },
  events: { label:'Concerts & events', subtitle:'Small, useful essentials that respect venue rules.', ids:['wallet','keys','cable','power','earplugs','pouch','water','light'] },
  field: { label:'Field & long days', subtitle:'Durable organization and practical contingency supplies.', ids:['wallet','keys','light','firstaid','power','pouch','water','notebook'] }
};
export const ITEMS = {
 wallet:{name:'Slim wallet',cost:18,weight:'Pocket',benefit:'ID, payment and one backup card. Choose simple and durable.'},
 keys:{name:'Key system',cost:12,weight:'Pocket',benefit:'Quiet, repeatable key organization. Avoid extra bulk.'},
 cable:{name:'Short USB-C cable',cost:10,weight:'Pocket',benefit:'A dependable short cable, compatible with your devices.'},
 power:{name:'Compact power bank',cost:30,weight:'Small bag',benefit:'Reliable capacity and genuine electrical safety markings. Check airline limits.'},
 notebook:{name:'Pocket notebook + pen',cost:9,weight:'Pocket',benefit:'Capture an idea when a screen is inconvenient.'},
 pouch:{name:'Slim organizer pouch',cost:20,weight:'Small bag',benefit:'Gives every loose essential a predictable location.'},
 light:{name:'Small flashlight',cost:18,weight:'Pocket',benefit:'A practical light with a simple control and replaceable or rechargeable power.'},
 water:{name:'Reusable water bottle',cost:22,weight:'Bag',benefit:'Leak-resistant and easy to clean; refill rather than carry disposable bottles.'},
 stand:{name:'Pack-flat device stand',cost:14,weight:'Small bag',benefit:'Improves mobile desk ergonomics without full workstation weight.'},
 documents:{name:'Document sleeve',cost:15,weight:'Small bag',benefit:'Separates passport, travel confirmations and essential records.'},
 earplugs:{name:'Reusable hearing protection',cost:20,weight:'Pocket',benefit:'Check fit and acoustic protection claims; respect venue bag rules.'},
 firstaid:{name:'Compact first-aid basics',cost:18,weight:'Small bag',benefit:'Personal supplies chosen for real needs and permitted uses.'}
};
const CARRY_CAPS = { pockets:1, sling:2, backpack:3 };
const LOAD = { 'Pocket':1, 'Small bag':2, 'Bag':3 };
export function buildKit({mission='commute',carry='sling',budget=150}={}) {
  const m = MISSIONS[mission] || MISSIONS.commute;
  const cap = CARRY_CAPS[carry] || CARRY_CAPS.sling;
  const max = Math.max(0, Number(budget)||0);
  const included=[]; const skipped=[];
  let total=0;
  for(const id of m.ids) {
    const item=ITEMS[id];
    if(LOAD[item.weight]>cap) { skipped.push({id,reason:'More space required'}); continue; }
    if(total+item.cost>max) { skipped.push({id,reason:'Outside allocation'}); continue; }
    included.push({id,...item}); total+=item.cost;
  }
  return {mission:m.label,subtitle:m.subtitle,carry,budget:max,total,remaining:max-total,included,skipped};
}
/** Scenario calculation only. Not a sales or conversion forecast. */
export function estimateRevenue({visitors=5000,clickRate=.18,shopperPurchaseRate=.04,averageBasket=70,commission=.03,digitalBuyRate=.005,digitalPrice=19,paymentPercent=.079,paymentFixed=.30,monthlyFixed=0}={}) {
  const visits=Math.max(0,Number(visitors));
  const referredOrders=visits*clickRate*shopperPurchaseRate;
  const affiliate=referredOrders*averageBasket*commission;
  const digitalOrders=visits*digitalBuyRate;
  const digitalNet=Math.max(0,digitalPrice*(1-paymentPercent)-paymentFixed)*digitalOrders;
  return {referredOrders,digitalOrders,affiliate,digitalNet,total:affiliate+digitalNet-monthlyFixed};
}
