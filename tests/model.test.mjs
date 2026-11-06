import test from 'node:test';import assert from 'node:assert/strict';
import {buildKit,estimateRevenue,MISSIONS} from '../model.mjs';
test('all mission profiles work and never overspend',()=>{for(const mission of Object.keys(MISSIONS))for(const carry of ['pockets','sling','backpack'])for(const budget of [50,100,150,500]){const r=buildKit({mission,carry,budget});assert.ok(r.total<=budget);assert.equal(r.remaining,budget-r.total);assert.ok(new Set(r.included.map(x=>x.id)).size===r.included.length);}});
test('pocket carry does not include larger bag items',()=>{const r=buildKit({mission:'travel',carry:'pockets',budget:500});assert.ok(r.included.every(x=>x.weight==='Pocket'));});
test('invalid mission safely reverts to commute',()=>assert.equal(buildKit({mission:'bad'}).mission,'City commute'));
test('revenue model has no implied guaranteed outcomes',()=>{assert.equal(estimateRevenue({visitors:0}).total,0);const s=estimateRevenue();assert.equal(s.referredOrders,36);assert.equal(s.digitalOrders,25);assert.ok(s.total>0);});
