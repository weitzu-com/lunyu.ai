import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('src/lib/game-account.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const empty = () => ({ version: 1, answers: {}, reflections: {}, lastChapter: 0 });
const progress = text => ({ ...empty(), reflections: { 'the-first-question': text } });
const clone = value => JSON.parse(JSON.stringify(value));
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function storage() { const items = new Map(); return { getItem: k => items.get(k) ?? null, setItem: (k,v) => items.set(k,String(v)), removeItem: k => items.delete(k) }; }
function setup(initial = empty(), initialOwner = null) {
  let current = clone(initial);
  let user = null;
  let readSnapshot;
  let pendingWrite = null;
  const clouds = new Map();
  const calls = [];
  const local = storage(), session = storage();
  if (initialOwner) local.setItem('lunyu-journey-owner-v2', initialOwner);
  const progressListeners = new Set(), windowListeners = new Map(), documentListeners = new Map();
  const events = map => ({ addEventListener(k,v) { if(!map.has(k)) map.set(k,new Set()); map.get(k).add(v); }, removeEventListener(k,v) { map.get(k)?.delete(v); }, dispatchEvent(e) { for(const f of map.get(e.type) ?? []) f(e); } });
  const fakeWindow = events(windowListeners), fakeDocument = { ...events(documentListeners), visibilityState:'visible' };
  const exports = {};
  const response = (status,data) => ({ status, ok:status >=200 && status<300, json:async()=>clone(data) });
  const context = {
    exports, require(name) {
      if(name==='react') return { useEffect(f) { f(); }, useSyncExternalStore(subscribe,get) { subscribe(()=>{}); readSnapshot=get; return get(); } };
      if(name==='@/lib/game-progress') return { emptyProgress:empty(), getProgressSnapshot:()=>current, parseGameProgress:raw=>raw?JSON.parse(raw):empty(), saveProgress(p) {current=clone(p); for(const f of progressListeners)f();}, subscribeProgress(f){progressListeners.add(f);return()=>progressListeners.delete(f);} };
      throw new Error(`Unexpected import ${name}`);
    },
    window:fakeWindow, document:fakeDocument, localStorage:local, sessionStorage:session, Event, setTimeout, clearTimeout,
    async fetch(url, options) {
      const path=url.split('/').at(-1), body=options.body?JSON.parse(options.body):null;
      const requestUser=user?.id;
      calls.push({path,body,user:requestUser});
      if(path==='session') return response(200,{configured:true,user});
      if(path==='login'||path==='register') {user={id:body.email,email:body.email,name:body.email};return response(path==='register'?201:200,{user,requiresEmailConfirmation:false});}
      if(!user) return response(401,{code:'unauthenticated',error:'login required'});
      if(options.headers['X-Lunyu-Account-Id'] && options.headers['X-Lunyu-Account-Id']!==user.id) return response(409,{code:'account_changed',error:'changed'});
      if(path==='logout') {user=null;return response(200,{ok:true});}
      if(path==='progress'&&options.method==='GET')return response(200,{save:clouds.get(user.id)??null});
      if(path==='progress') {
        const cloud=clouds.get(requestUser);
        if((cloud?.revision??null)!==body.expectedRevision)return response(409,{code:'conflict',save:cloud??null});
        if(pendingWrite){const wait=pendingWrite;pendingWrite=null;await wait;}
        const save={progress:body.progress,revision:(cloud?.revision??0)+1,updatedAt:new Date().toISOString()};clouds.set(requestUser,clone(save));return response(200,{save});
      }
      throw new Error(`Unexpected request ${url}`);
    },
  };
  vm.runInNewContext(source,context);
  exports.useGameAccount();
  return {api:exports,clouds,calls,local,session,window:fakeWindow,get current(){return clone(current);},get state(){return readSnapshot();},setUser(u){user=u;},edit(p){current=clone(p);for(const f of progressListeners)f();},delayWrite(p){pendingWrite=p;}};
}
async function until(f,message){for(let i=0;i<100;i++){if(f())return;await tick();}throw new Error(message);}

// A local draft and a cloud draft require an explicit choice, then immediate
// logout flushes the last edit before restoring the guest's original journey.
const a=setup(progress('guest draft'));
await until(()=>a.state.status==='guest','initialize guest');
a.clouds.set('A',{progress:progress('cloud A'),revision:3,updatedAt:new Date().toISOString()});
await a.api.signInAccount('A','password');
assert.equal(a.state.status,'conflict');
assert.equal(a.clouds.get('A').progress.reflections['the-first-question'],'cloud A');
await a.api.resolveAccountProgress('local');
a.edit(progress('private A latest'));
await a.api.signOutAccount();
assert.equal(a.clouds.get('A').progress.reflections['the-first-question'],'private A latest');
assert.equal(a.current.reflections['the-first-question'],'guest draft');
await a.api.signInAccount('B','password');
assert.equal(a.clouds.get('B').progress.reflections['the-first-question'],'guest draft');
assert.notEqual(a.current.reflections['the-first-question'],'private A latest');

// Edits made while a save is in flight are included in the logout flush.
let release;
a.edit(progress('first pending edit'));
a.delayWrite(new Promise(resolve=>{release=resolve;}));
const flush=a.api.flushAccountProgress();
await until(()=>a.state.status==='saving','start delayed save');
a.edit(progress('edit while saving'));
const signout=a.api.signOutAccount();
release();
await Promise.all([flush,signout]);
assert.equal(a.clouds.get('B').progress.reflections['the-first-question'],'edit while saving');
assert.equal(a.state.user,null);

// Another tab may have already changed both the cookie and shared local cache.
// Refreshing an old tab must preserve the new account's still-unsaved draft.
const b=setup();
await until(()=>b.state.status==='guest','initialize another tab');
await b.api.signInAccount('A','password');
b.setUser({id:'B',email:'B',name:'B'});
b.local.setItem('lunyu-journey-owner-v2','B');
b.edit(progress('B unsaved in another tab'));
b.window.dispatchEvent({type:'storage',key:'lunyu-account-session-v2'});
await until(()=>b.state.user?.id==='B' && b.state.status==='synced','observe cross-tab account change');
await b.api.flushAccountProgress();
assert.equal(b.current.reflections['the-first-question'],'B unsaved in another tab');
assert.equal(b.clouds.get('B').progress.reflections['the-first-question'],'B unsaved in another tab');
assert.ok(!b.calls.some(call=>call.path==='progress'&&call.body?.progress.reflections['the-first-question']==='B unsaved in another tab'&&call.user==='A'));

// Expiration first restores the visitor, then a later login must recover the
// account's private draft before reading an older cloud save.
const c=setup();
await until(()=>c.state.status==='guest','initialize expired-session scenario');
await c.api.signInAccount('A','password');
c.edit(progress('cloud A before expiration'));
await c.api.flushAccountProgress();
c.edit(progress('private A not yet synced'));
c.setUser(null);
c.window.dispatchEvent({type:'storage',key:'lunyu-account-session-v2'});
await until(()=>c.state.status==='guest','observe expired session');
assert.equal(c.current.reflections['the-first-question'],undefined);
assert.equal(JSON.parse(c.session.getItem('lunyu-account-draft-v2:A')).reflections['the-first-question'],'private A not yet synced');
c.edit(progress('guest after expiration'));
await c.api.signInAccount('A','password');
assert.equal(c.state.status,'conflict');
assert.equal(c.current.reflections['the-first-question'],'private A not yet synced');
assert.equal(c.clouds.get('A').progress.reflections['the-first-question'],'cloud A before expiration');
await c.api.resolveAccountProgress('local');
await c.api.signOutAccount();
assert.equal(c.current.reflections['the-first-question'],'guest after expiration');

// After a browser reload there is no previous in-memory user, but the owner
// marker must still protect its cache from the initial anonymous session.
const d=setup(progress('private A before reload'),'A');
await until(()=>d.state.status==='guest','reload with expired cookie');
assert.equal(d.current.reflections['the-first-question'],undefined);
assert.equal(JSON.parse(d.session.getItem('lunyu-account-draft-v2:A')).reflections['the-first-question'],'private A before reload');
d.clouds.set('A',{progress:progress('older cloud A'),revision:1,updatedAt:new Date().toISOString()});
await d.api.signInAccount('A','password');
assert.equal(d.state.status,'conflict');
assert.equal(d.current.reflections['the-first-question'],'private A before reload');
await d.api.resolveAccountProgress('local');

// A deliberate empty draft also needs a conflict choice, rather than being
// mistaken for a new visitor and replaced by an older populated cloud save.
d.edit(empty());
d.setUser(null);
d.window.dispatchEvent({type:'storage',key:'lunyu-account-session-v2'});
await until(()=>d.state.status==='guest','expire with intentionally cleared draft');
await d.api.signInAccount('A','password');
assert.equal(d.state.status,'conflict');
assert.deepEqual(d.current.reflections,{});
assert.equal(d.clouds.get('A').progress.reflections['the-first-question'],'private A before reload');
await d.api.signOutAccount({discardUnsynced:true});
console.log('PASS: conflict choice, immediate logout flush, edits during save, guest restoration, account isolation, cross-tab preservation, and draft recovery after session expiry or reload.');
