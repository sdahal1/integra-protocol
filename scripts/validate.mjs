import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';

const course=JSON.parse(fs.readFileSync('docs/data/course.json','utf8'));
const pages=JSON.parse(fs.readFileSync('docs/data/pages.json','utf8'));
const report=JSON.parse(fs.readFileSync('provenance/extraction-report.json','utf8'));
assert.equal(pages.length,127);
assert.equal(course.modules.length,12);
assert.equal(course.examples.length,9);
assert.equal(course.affirmations.length,14);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('docs/library/integra-protocol-v1.1.pdf')).digest('hex'),report.sha256);
assert.ok(report.crossExtractorChecks.every(p=>p.match));
assert.ok(pages[0].method.includes('Manual transcription'));
for(const [i,p] of pages.entries()){
  assert.equal(p.page,i+1);assert.ok(p.text.trim().length>0);assert.equal(p.characters,p.text.length);
  assert.ok(fs.readFileSync('docs/library/integra-protocol-full-text.txt','utf8').includes(`===== PDF PAGE ${p.page} =====\n\n${p.text}`));
  assert.ok(fs.readFileSync('docs/library/integra-protocol-full-text.md','utf8').includes(`## PDF page ${p.page}\n\n${p.text}`));
}
assert.equal(report.words,pages.reduce((n,p)=>n+p.words,0));
assert.ok(pages[2].text.includes('Copyright 2015 by Vladimir Stojakovic'));
for(const m of course.modules){
  assert.ok(m.concepts.length>=4);assert.ok(m.cheat.length>=4);assert.ok(m.quiz.options[m.quiz.answer]);
  for(const n of [...m.pages,...(m.story?.pages||[])])assert.ok(Number.isInteger(n)&&n>=1&&n<=127);
}
assert.deepEqual(course.examples.flatMap(e=>Array.from({length:e.end-e.start+1},(_,i)=>e.start+i)),Array.from({length:39},(_,i)=>53+i));
assert.deepEqual(course.sections.flatMap(e=>Array.from({length:e.end-e.start+1},(_,i)=>e.start+i)),Array.from({length:127},(_,i)=>1+i));
for(const name of ['docs/index.html','docs/styles.css','docs/icon.svg','docs/.nojekyll','.github/workflows/pages.yml','Start Local Preview.command','scripts/serve.py'])assert.ok(fs.existsSync(name));
const html=fs.readFileSync('docs/index.html','utf8'),code=fs.readFileSync('docs/app.js','utf8').replace(/\ninit\(\);\s*$/,'');
assert.ok(!/(?:src|href)="\/(?!\/)/.test(html));
assert.ok(!/fetch\(['"]https?:/.test(code));
assert.ok(fs.readFileSync('.github/workflows/pages.yml','utf8').includes('path: docs'));
console.log('PASS: all 127 source pages, matching PDF hash, complete TXT/Markdown, 12 modules, 9 complete transcripts, source references and portable assets.');

const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{textContent:'',value:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},focus(){this.focused=true;},select(){this.selected=true;},scrollIntoView(){}});return elements.get(id);}
let saved,clipboardText,downloadedBlob,downloadedAnchor,storageFails=false;
const navigator={clipboard:{writeText:async value=>{clipboardText=value;}}};
class TestURL extends URL{static createObjectURL(blob){downloadedBlob=blob;return 'blob:test';}static revokeObjectURL(){}}
const document={querySelector:element,querySelectorAll:()=>[],addEventListener(){},createElement(){return {click(){downloadedAnchor=this;},remove(){}};},body:{appendChild(){}}};
const context=vm.createContext({testCourse:course,testPages:pages,console,URL:TestURL,Blob,Date,Math,Intl,navigator,document,localStorage:{getItem:()=>saved,setItem:(key,value)=>{if(storageFails)throw new Error('storage denied');saved=value;}},location:{hash:''},window:{addEventListener(){},scrollTo(){},scrollY:0},setTimeout,clearTimeout});
vm.runInContext(code,context);
const run=script=>vm.runInContext(script,context);
run('course=testCourse;pages=testPages;state=freshState();');
const evaluateWith=(name,value,expression)=>{context[name]=value;return run(expression);};
let largest=0;
for(const m of course.modules){
  const text=run(`buildHandoff('learn:${m.id}')`);
  for(const n of m.pages)assert.ok(text.includes(pages[n-1].text));
  for(const c of m.concepts)assert.ok(text.includes(c.body));
  assert.ok(text.includes('[Not provided]'));assert.ok(!text.includes('undefined'));
  assert.ok(run(`moduleView(course.modules.find(m=>m.id==='${m.id}'))`).includes(`data-handoff="learn:${m.id}"`));
  largest=Math.max(largest,text.split(/\s+/).length);
}
for(const e of course.examples){const text=run(`buildHandoff('example:${e.id}')`);for(let n=e.start;n<=e.end;n++)assert.ok(text.includes(pages[n-1].text));assert.ok(text.includes('No personal session notes'));}
assert.throws(()=>run("buildHandoff('session:missing')"));
for(const name of ['learnView','practiceView','examplesView','libraryView','journalView','aboutView'])assert.ok(run(`${name}().length`)>500);

run("newSession('protocol');routeId=state.current;");
assert.equal(run("advanceSession(currentSession(),'begin')"),false);
run("currentSession().situation='MY ORIGINAL TOPIC';currentSession().initialReaction='A little tension';advanceSession(currentSession(),'begin');");
assert.equal(run('currentSession().stage'),'content');
for(const [action,stage] of [['to-identity','identity'],['to-goal','goal'],['no-goal','intention'],['no-intention','message'],['to-next','next'],['clarify','clarify'],['no-identity','check-goal'],['retest','retest'],['anything','anything'],['wanted','wanted'],['reflect','reflect']]){
  run(`advanceSession(currentSession(),'${action}')`);assert.equal(run('currentSession().stage'),stage);assert.ok(run('sessionView(currentSession()).length')>500);
}
assert.equal(run('currentSession().situation'),'MY ORIGINAL TOPIC');
run("advanceSession(currentSession(),'finish');");assert.equal(run('currentSession().status'),'finished');
assert.ok(run("buildHandoff('session:'+state.current)").includes('Do not restart the protocol automatically'));

// An iteration preserves only voluntarily entered notes; quiet iterations fabricate none.
run("newSession('protocol');routeId=state.current;currentSession().situation='CURRENT TOPIC';advanceSession(currentSession(),'begin');advanceSession(currentSession(),'to-identity');advanceSession(currentSession(),'to-goal');advanceSession(currentSession(),'to-next');advanceSession(currentSession(),'another-loop');");
assert.equal(run('currentSession().rounds.length'),0);
assert.equal(run('currentSession().stage'),'identity');
run("currentSession().notesEnabled=true;currentSession().live.identity='A perspective I noticed';currentSession().live.goal='MY OWN AIM';currentSession().live.next='New feeling';advanceSession(currentSession(),'another-loop');");
assert.equal(run('currentSession().rounds[0].goal'),'MY OWN AIM');assert.equal(run('currentSession().live.content'),'New feeling');assert.equal(run('currentSession().live.goal'),'');
run("advanceSession(currentSession(),'to-goal');advanceSession(currentSession(),'pause');");assert.equal(run('currentSession().status'),'paused');
assert.ok(run("buildHandoff('session:'+state.current)").includes('Do not resume inward practice automatically'));
run("advanceSession(currentSession(),'resume');");assert.equal(run('currentSession().stage'),'goal');
run("advanceSession(currentSession(),'no-goal');currentSession().live.intention='A noticed intention';advanceSession(currentSession(),'intention-found');");assert.equal(run('currentSession().live.goal'),'A noticed intention');
run("advanceSession(currentSession(),'no-goal');advanceSession(currentSession(),'no-intention');currentSession().live.message='A noticed message';advanceSession(currentSession(),'message-found');");assert.equal(run('currentSession().live.goal'),'A noticed message');
run("currentSession().notesEnabled=false;advanceSession(currentSession(),'restart');");
assert.equal(run('currentSession().stage'),'content');
assert.equal(run('currentSession().situation'),'CURRENT TOPIC');
assert.equal(run('currentSession().rounds.at(-1).goal'),'A noticed message');
run("currentSession().live.next='Previously written note';advanceSession(currentSession(),'another-loop');");
assert.equal(run('currentSession().rounds.at(-1).next'),'Previously written note');

for(const mode of ['elements','identity','affirmations']){
  run(`newSession('${mode}');routeId=state.current;currentSession().situation='Intro ${mode}';advanceSession(currentSession(),'begin');`);
  const steps=run(`introSteps('${mode}').length`);
  assert.equal(steps,{elements:14,identity:22,affirmations:14}[mode]);
  for(let i=0;i<steps;i++){assert.equal(run('currentSession().index'),i);assert.ok(run('sessionView(currentSession())').includes(`${i+1} / ${steps}`));run("advanceSession(currentSession(),'intro-next')");}
  assert.equal(run('currentSession().stage'),'reflect');
  const text=run("buildHandoff('session:'+state.current)");for(const n of course.introPages)assert.ok(text.includes(pages[n-1].text));
}

// The selected session cannot contaminate an older Journal handoff.
run("state.sessions[0].after='OLDER NOTE </textarea><script>literal only</script>';currentSession().after='CURRENT SECRET';state.studyNotes.begin={reflection:'MODULE ONLY',question:'A question',updated:new Date().toISOString()};");
const before=run('JSON.stringify({state,routeId,view})');
run("openHandoff('session:'+state.sessions[0].id)");
const text=element('#handoff-preview').value;
assert.ok(text.includes('OLDER NOTE </textarea><script>literal only</script>'));assert.ok(text.includes('MY ORIGINAL TOPIC'));
assert.ok(!text.includes('CURRENT SECRET'));assert.ok(!text.includes('MODULE ONLY'));
assert.equal(run('JSON.stringify({state,routeId,view})'),before);
assert.ok(!run('journalView()').includes('<script>literal only</script>'));
assert.equal(await run('copyHandoff()'),true);assert.equal(clipboardText,text);
navigator.clipboard.writeText=async()=>{throw new Error('Denied');};
assert.equal(await run('copyHandoff()'),false);assert.ok(element('#handoff-preview').selected);
navigator.clipboard=undefined;assert.equal(await run('copyHandoff()'),false);
run('downloadHandoff()');assert.equal(await downloadedBlob.text(),text);assert.ok(downloadedAnchor.download.startsWith('integra-session-'));
assert.equal(run('JSON.stringify({state,routeId,view})'),before);

// Immediate notes, safe import, and storage errors preserve data in memory.
run("currentSession().gptRecap='LATEST IN-MEMORY RECAP';");assert.ok(run("buildHandoff('session:'+state.current)").includes('LATEST IN-MEMORY RECAP'));
run('save();');const backup=JSON.parse(saved);assert.equal(evaluateWith('incoming',backup,'sanitizeState(incoming).sessions.length'),backup.sessions.length);
const bad=structuredClone(backup);bad.sessions[0].id='__proto__';assert.throws(()=>evaluateWith('incoming',bad,'sanitizeState(incoming)'));
const invalid=structuredClone(backup);invalid.sessions[0].situation={html:'bad'};assert.throws(()=>evaluateWith('incoming',invalid,'sanitizeState(incoming)'));
const newer=structuredClone(backup);newer.sessions[0].after='IMPORTED NEWER';newer.sessions[0].updated='2099-01-01T00:00:00.000Z';
context.importFile={size:100,text:async()=>JSON.stringify(newer)};await run('importBackup(importFile)');assert.equal(run('state.sessions[0].after'),'IMPORTED NEWER');
context.importFile={size:100,text:async()=>JSON.stringify(backup)};await run('importBackup(importFile)');assert.equal(run('state.sessions[0].after'),'IMPORTED NEWER');
const preInvalid=run('JSON.stringify(state)');context.importFile={size:100,text:async()=>'{bad json'};await run('importBackup(importFile)');assert.equal(run('JSON.stringify(state)'),preInvalid);
storageFails=true;run('save()');assert.equal(run('storageOK'),false);assert.ok(run('JSON.stringify(state)').includes('LATEST IN-MEMORY RECAP'));storageFails=false;
run('save();state=freshState();loadState();');assert.equal(run('state.sessions[0].after'),'IMPORTED NEWER');
run('clearTimeout(toastTimer)');
largest=Math.max(largest,run("buildHandoff('session:'+state.sessions[0].id).split(/\\s+/).length"));
console.log(`PASS: every learning/transcript handoff, 4 practice modes, 50 introductory instructions, protocol clarification/retest branches, pause/resume, older-entry isolation, exact notes, clipboard fallback, TXT download, safe merge/import and storage round-trip. Largest tested handoff: ${largest.toLocaleString()} words.`);
