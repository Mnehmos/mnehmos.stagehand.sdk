import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Reconstructed Stagehand core conformance harness.
// This is NOT a verbatim copy of any host implementation. It encodes portable
// invariants recovered from LLM-Chess, Clio, Virtual Classroom, and VCB.

class StagehandSyntaxError extends Error {
  constructor(message, raw) { super(message); this.name = 'StagehandSyntaxError'; this.raw = raw; }
}

function tokenizeCommand(raw) {
  const tokens = [];
  let value = '', eqAt = -1, quote = null, open = false, atValueStart = true;
  const flush = () => {
    if (open) tokens.push({ value, eqAt });
    value = ''; eqAt = -1; quote = null; open = false; atValueStart = true;
  };
  for (const ch of raw.trim()) {
    if (quote) {
      if (ch === quote) { quote = null; atValueStart = false; }
      else value += ch;
      continue;
    }
    if (atValueStart && (ch === '"' || ch === "'")) {
      quote = ch; open = true; atValueStart = false; continue;
    }
    if (/\s/.test(ch)) { flush(); continue; }
    if (ch === '=' && eqAt === -1) {
      eqAt = value.length; value += ch; open = true; atValueStart = true; continue;
    }
    value += ch; open = true; atValueStart = false;
  }
  if (quote) throw new StagehandSyntaxError(`Unterminated ${quote} quote`, raw);
  flush();
  return tokens;
}

function parseCommandString(raw, schema) {
  const tokens = tokenizeCommand(raw);
  if (!tokens.length) return null;
  const action = tokens[0].value;
  const flat = [];
  for (let i = 1; i < tokens.length; i++) {
    let { value, eqAt } = tokens[i];
    let next = tokens[i+1];
    if (eqAt === -1 && next && next.value.startsWith('=')) {
      value += next.value; eqAt = value.indexOf('='); i++; next = tokens[i+1];
    }
    if (eqAt === value.length - 1 && next && next.eqAt === -1 && !next.value.startsWith('=')) {
      value += next.value; i++;
    }
    flat.push({ value, eqAt });
  }
  const knownKeys = schema ? new Set([...schema.requiredKwargs, ...Object.keys(schema.optionalKwargs ?? {})]) : null;
  if (knownKeys) {
    const args = [], kwargs = {};
    let currentKey = null;
    for (const { value, eqAt } of flat) {
      if (eqAt >= 0) {
        const key = value.slice(0, eqAt);
        kwargs[key] = value.slice(eqAt + 1);
        currentKey = knownKeys.has(key) ? key : null;
      } else if (currentKey !== null && !knownKeys.has(value)) {
        kwargs[currentKey] = kwargs[currentKey] ? `${kwargs[currentKey]} ${value}` : value;
      } else {
        args.push(value); currentKey = null;
      }
    }
    return { action, args, kwargs, raw: `[${raw}]` };
  }
  const args = [], kwargs = {};
  for (const { value, eqAt } of flat) {
    if (eqAt >= 0) kwargs[value.slice(0, eqAt)] = value.slice(eqAt+1);
    else args.push(value);
  }
  return { action, args, kwargs, raw: `[${raw}]` };
}

const schemas = new Map([
  ['avatar.move', { minArgs:1,maxArgs:1,requiredKwargs:[],optionalKwargs:{speed:'walk'} }],
  ['avatar.gesture', { minArgs:1,maxArgs:1,requiredKwargs:[],optionalKwargs:{} }],
  ['whiteboard.text', { minArgs:0,maxArgs:0,requiredKwargs:['id'],optionalKwargs:{text:'',latex:'',size:'md',region:''} }],
  ['whiteboard.math', { minArgs:0,maxArgs:0,requiredKwargs:['id'],optionalKwargs:{latex:'',region:''} }],
  ['map.highlight', { minArgs:0,maxArgs:1,requiredKwargs:[],optionalKwargs:{entity:'',color:'#ef4444'} }],
  ['map.timecursor', { minArgs:0,maxArgs:0,requiredKwargs:['at'],optionalKwargs:{} }],
  ['source.show', { minArgs:0,maxArgs:0,requiredKwargs:[],optionalKwargs:{id:'',text:'',confidence:'0.5'} }],
]);

function validateCommand(cmd) {
  const schema = schemas.get(cmd.action);
  if (!schema) return { ok:false, layer:'registry', errors:[`Unknown Stagehand action: ${cmd.action}`] };
  const errors = [];
  if (cmd.args.length < schema.minArgs || cmd.args.length > schema.maxArgs) errors.push('arity');
  for (const k of schema.requiredKwargs) if (!(k in cmd.kwargs) || cmd.kwargs[k] === '') errors.push(`missing:${k}`);
  const allowed = new Set([...schema.requiredKwargs, ...Object.keys(schema.optionalKwargs)]);
  for (const k of Object.keys(cmd.kwargs)) if (!allowed.has(k)) errors.push(`unknown-kwarg:${k}`);
  return errors.length ? {ok:false,layer:'registry',errors} : {ok:true,command:cmd};
}

const compoundSpecs = new Map([
  ['batch', {type:'batch', close:'/batch'}],
  ['sequence', {type:'sequence', close:'/sequence'}],
  ['parallel', {type:'parallel', close:'/parallel'}],
  ['beat', {type:'beat', close:'/beat'}],
]);
const closeActions = new Set([...compoundSpecs.values()].map(s=>s.close));

function parseScript(script) {
  const rough = [];
  const re = /\[([^\]]+)\]/g;
  let last = 0, m;
  const pushText = t => { const s=t.trim(); if(s) rough.push({type:'text',content:s}); };
  while ((m = re.exec(script))) {
    pushText(script.slice(last,m.index));
    const raw=m[1].trim(); const action=tokenizeCommand(raw)[0]?.value;
    const cmd=parseCommandString(raw, schemas.get(action));
    if(cmd) rough.push({type:'command',...cmd});
    last=re.lastIndex;
  }
  pushText(script.slice(last));
  return foldCompounds(rough);
}

function foldCompounds(segments) {
  const root=[], stack=[];
  const sink=()=>stack.length ? stack[stack.length-1].children : root;
  const closeFrame=(raw)=>{
    const f=stack.pop(); if(!f) return;
    const commands=[]; const narration=[];
    const harvest=(x)=>{ if(x.type==='command') commands.push({...x}); else if(x.type==='text') narration.push(x.content); else if(x.commands) commands.push(...x.commands); };
    f.children.forEach(harvest);
    const seg={type:f.spec.type,commands,raw:[f.opener.raw,raw].join(' ')};
    if(f.spec.type==='batch') seg.mode=f.opener.args[0]||f.opener.kwargs.mode||'atomic';
    if(f.spec.type==='sequence') {
      const v=f.opener.kwargs.pause ?? f.opener.kwargs.pause_ms; if(v!==undefined) seg.pauseMs=Number(v);
    }
    if(f.spec.type==='beat') { seg.beatId=f.opener.kwargs.id||f.opener.args[0]||''; seg.visualIntent=f.opener.kwargs.intent||''; seg.narration=narration.join('\n'); }
    sink().push(seg);
  };
  for(const seg of segments){
    if(seg.type==='command' && compoundSpecs.has(seg.action)){
      stack.push({spec:compoundSpecs.get(seg.action), opener:seg, children:[]}); continue;
    }
    if(seg.type==='command' && seg.action==='end'){ if(stack.length) closeFrame(seg.raw); continue; }
    if(seg.type==='command' && closeActions.has(seg.action)){
      const idx=stack.findLastIndex(f=>f.spec.close===seg.action);
      if(idx>=0){ while(stack.length>idx) closeFrame(seg.raw); }
      continue;
    }
    sink().push(seg);
  }
  while(stack.length){
    const f=stack.pop(); const target=sink(); target.push(f.opener,...f.children);
  }
  return root;
}

function validateCompound(seg){
  const inner=seg.commands.map(validateCommand); const ok=inner.every(r=>r.ok);
  return {ok,kind:seg.type,inner,errors:inner.flatMap((r,i)=>r.ok?[]:r.errors.map(e=>`${seg.type}:${i}:${e}`))};
}

function recoverBare(script){
  // Minimal reconstructed safety rule: registered command syntax at paragraph head is control, never narration.
  const words=script.trim().split(/\s+/); const commands=[]; let spoken=[]; let i=0;
  while(i<words.length){
    const schema=schemas.get(words[i]);
    if(!schema){ spoken.push(words[i++]); continue; }
    const action=words[i++], args=[], kwargs={};
    while(i<words.length && args.length<schema.maxArgs && !words[i].includes('=') && !schemas.has(words[i])) args.push(words[i++]);
    while(i<words.length && words[i].includes('=')){
      const [k,...rest]=words[i].split('=');
      const allowed=new Set([...schema.requiredKwargs,...Object.keys(schema.optionalKwargs)]);
      if(!allowed.has(k)) break;
      kwargs[k]=rest.join('='); i++;
    }
    commands.push({action,args,kwargs,raw:`<recovered:${action}>`});
    // after a recovered control command, ordinary text is narration until another registered action
    while(i<words.length && !schemas.has(words[i])) spoken.push(words[i++]);
  }
  return {commands,text:spoken.join(' ').trim()};
}

class ReadinessGate {
  constructor(){this.channels=new Map();this.generation=0;}
  mark(k){let resolve; const pending=new Promise(r=>resolve=r); this.channels.set(k,{pending,resolve});}
  settle(k){const c=this.channels.get(k); if(c?.resolve)c.resolve(); this.channels.set(k,{pending:null,resolve:null});}
  invalidate(){this.generation++; for(const k of this.channels.keys())this.settle(k); this.channels.clear();}
  async wait(keys,timeoutMs){
    const gen=this.generation, start=Date.now(); const pending=keys.map(k=>this.channels.get(k)?.pending).filter(Boolean);
    if(!pending.length)return{settled:true,outstanding:[],waitedMs:0,stale:false};
    let timer; const deadline=new Promise(r=>timer=setTimeout(()=>r('timeout'),timeoutMs));
    const outcome=await Promise.race([Promise.all(pending).then(()=> 'settled'), deadline]); clearTimeout(timer);
    return {settled:outcome==='settled',outstanding:keys.filter(k=>this.channels.get(k)?.pending),waitedMs:Date.now()-start,stale:this.generation!==gen};
  }
}

class EventBus {
  constructor(){this.publicEvents=[];this.productionEvents=[];}
  emitPublic(e){this.publicEvents.push(e);}
  emitPrivate(e){this.productionEvents.push(e);}
}

function buildDigest(){return [...schemas].map(([action,s])=>`${action}|${s.minArgs}-${s.maxArgs}|${[...s.requiredKwargs,...Object.keys(s.optionalKwargs)].join(',')}`).join('\n');}

const tests=[];
function test(id,name,kind,fn){tests.push({id,name,kind,fn});}

test('G-001','valid bracketed command','golden',()=>{const c=parseCommandString('map.highlight entity="country:iran" color="#ff0000"',schemas.get('map.highlight'));assert.equal(validateCommand(c).ok,true);});
test('G-002','quoted values preserve spaces','golden',()=>{const c=parseCommandString('whiteboard.text id=t text="heat boils water"',schemas.get('whiteboard.text'));assert.equal(c.kwargs.text,'heat boils water');});
test('G-003','apostrophe remains literal','golden',()=>{const c=parseCommandString("whiteboard.text id=t text=Newton's",schemas.get('whiteboard.text'));assert.equal(c.kwargs.text,"Newton's");});
test('G-004','LaTeX backslashes survive','golden',()=>{const c=parseCommandString(String.raw`whiteboard.math id=k latex="\\frac{a}{b}"`,schemas.get('whiteboard.math'));assert.equal(c.kwargs.latex,String.raw`\\frac{a}{b}`);});
test('G-005','spaces around equals normalize','golden',()=>{const c=parseCommandString('whiteboard.text id = t text = hello',schemas.get('whiteboard.text'));assert.equal(c.kwargs.id,'t');assert.equal(c.kwargs.text,'hello');});
test('G-006','schema-aware unquoted multiword recovery','golden',()=>{const c=parseCommandString('whiteboard.text id=t text=If exactly one split size=md',schemas.get('whiteboard.text'));assert.equal(c.kwargs.text,'If exactly one split');assert.equal(c.kwargs.size,'md');});
test('G-007','nested compound support','golden',()=>{const s=parseScript('[sequence][parallel][map.highlight entity=x][source.show id=s][end][end]');assert.equal(s[0].type,'sequence');assert.equal(s[0].commands.length,2);});
test('G-008','universal end closes innermost','golden',()=>{const s=parseScript('[sequence][map.highlight entity=x][end]');assert.equal(s[0].type,'sequence');});
test('G-009','unmatched opener degrades visibly','golden',()=>{const s=parseScript('[sequence][map.highlight entity=x]');assert.equal(s[0].type,'command');assert.equal(s[0].action,'sequence');});
test('G-010','orphan closer does not execute','golden',()=>{const s=parseScript('hello [/sequence] world');assert.equal(s.filter(x=>x.type==='command').length,0);});
test('A-001','unknown action rejected','adversarial',()=>{const c=parseCommandString('root.shell rm=-rf',null);assert.equal(validateCommand(c).ok,false);});
test('A-002','missing-bracket control not spoken as control','adversarial',()=>{const r=recoverBare('avatar.move teacher.home speed=stroll Hello student');assert.equal(r.commands[0].action,'avatar.move');assert.equal(r.text,'Hello student');});
test('A-003','compound atomicity fails on invalid inner','adversarial',()=>{const s=parseScript('[batch atomic][map.highlight entity=x][evil.run x=1][/batch]')[0];const r=validateCompound(s);assert.equal(r.ok,false);});
test('A-004','unterminated quote hard fails','adversarial',()=>{assert.throws(()=>parseCommandString('whiteboard.text id=t text="oops',schemas.get('whiteboard.text')),StagehandSyntaxError);});
test('A-005','claim.show contract drift remains rejected','adversarial',()=>{const c=parseCommandString('claim.show id=x',null);const r=validateCommand(c);assert.equal(r.ok,false);assert.match(r.errors[0],/Unknown/);});
test('A-006','timecursor missing at is rejected by pinned schema','adversarial',()=>{const c=parseCommandString('map.timecursor',schemas.get('map.timecursor'));const r=validateCommand(c);assert.equal(r.ok,false);assert.ok(r.errors.includes('missing:at'));});
test('A-007','readiness timeout resolves rather than deadlocks','adversarial',async()=>{const g=new ReadinessGate();g.mark('camera');const r=await g.wait(['camera'],15);assert.equal(r.settled,false);});
test('A-008','readiness invalidation marks stale waiter','adversarial',async()=>{const g=new ReadinessGate();g.mark('camera');const p=g.wait(['camera'],100);setTimeout(()=>g.invalidate(),5);const r=await p;assert.equal(r.stale,true);});
test('A-009','public/private trace partition','adversarial',()=>{const b=new EventBus();b.emitPrivate({type:'command.rejected'});b.emitPublic({type:'caption'});assert.deepEqual(b.publicEvents.map(x=>x.type),['caption']);assert.deepEqual(b.productionEvents.map(x=>x.type),['command.rejected']);});
test('A-010','schema registry generates authoring digest','adversarial',()=>{const d1=buildDigest();schemas.set('test.temp',{minArgs:0,maxArgs:0,requiredKwargs:[],optionalKwargs:{}});const d2=buildDigest();assert.notEqual(d1,d2);assert.match(d2,/test.temp/);schemas.delete('test.temp');});
test('A-011','generic core schema contains no host state namespaces','adversarial',()=>{const forbidden=['lesson.','projector.','piece.','room.'];for(const a of schemas.keys())for(const f of forbidden)assert.equal(a.startsWith(f),false);});

const results=[];
for(const t of tests){
  const started=performance.now();
  try { await t.fn(); results.push({id:t.id,name:t.name,kind:t.kind,status:'pass',duration_ms:+(performance.now()-started).toFixed(3)}); }
  catch(err){ results.push({id:t.id,name:t.name,kind:t.kind,status:'fail',duration_ms:+(performance.now()-started).toFixed(3),error:String(err?.stack||err)}); }
}
const summary={total:results.length,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length,golden:results.filter(r=>r.kind==='golden').length,adversarial:results.filter(r=>r.kind==='adversarial').length};
const out={harness:'reconstructed-stagehand-core',provenance:'source-derived, independently implemented for Pass 7 conformance; not original host execution',node:process.version,generated_at:new Date().toISOString(),summary,results};
const outPath=process.argv[2]||'conformance_results.json';
fs.writeFileSync(outPath,JSON.stringify(out,null,2));
console.log(JSON.stringify(summary));
if(summary.failed) process.exit(1);
