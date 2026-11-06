import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
// file:// URL .pathname produces /C:/... on Windows; use the native filesystem path.
const root = fileURLToPath(new URL('../', import.meta.url));
const html=readFileSync(join(root,'index.html'),'utf8');
const config=readFileSync(join(root,'config.js'),'utf8');
const app=readFileSync(join(root,'app.mjs'),'utf8');
test('commercial activations remain dormant',()=>{
  assert.match(config,/digitalProductUrl:\s*''/);
  assert.match(config,/newsletterUrl:\s*''/);
  assert.match(config,/approvedAffiliateUrl:\s*''/);
  assert.match(config,/amazonAssociateEnabled:false/);
  assert.match(html,/This prelaunch site does not display paid affiliate links/);
});
test('journal links resolve to original local guides',()=>{
  for(const slug of ['carry-audit','travel-day','portable-power','pocket-vs-bag']) {
    assert.match(html,new RegExp(`\\./guides/${slug}\\.html`));
    assert.ok(existsSync(join(root,'guides',slug+'.html')));
    const content=readFileSync(join(root,'guides',slug+'.html'),'utf8');
    assert.match(content,/NO AFFILIATE LINKS/);
    assert.match(content,/<h1>/);
    assert.match(content,/href="\.\.\/index\.html#builder"/);
  }
});
test('navigation inputs and informational links are available',()=>{
  for(const id of ['mission','carry','budget','download','print','share']) assert.match(html,new RegExp(`id="${id}"`));
  for(const id of ['journal','resources','how','builder']) assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,/href="\.\/privacy\.html"/);
  assert.match(app,/window\.location\.search/);
});

test('asset root resolves to a native filesystem path',()=>{
  assert.ok(existsSync(root), 'Public asset directory must exist');
  if (process.platform === 'win32') assert.match(root, /^[A-Za-z]:[\\/]/, 'Windows path must begin with drive letter');
});

test('every page declares an icon so browsers do not request a missing favicon',()=>{
  const pages=['index.html','privacy.html',...['carry-audit','travel-day','portable-power','pocket-vs-bag'].map(s=>join('guides',s+'.html'))];
  for(const page of pages) assert.match(readFileSync(join(root,page),'utf8'),/<link rel="icon" href="[^"]+">/,page);
});
