import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ArrowRight, ArrowLeft, X, Check, Play, Layers3, Zap, ShieldCheck, ChartNoAxesCombined, RotateCcw, CircleHelp, GitBranch as GitBranchIcon} from 'lucide-react';
import './tour.css';

export const managerSteps = [
 {title:'Binaya, meet the BasePort control plane.',chapter:'DBAAS · TWO VIEWS',description:'Developers use approved self-service paths. DBREs build automation, govern the estate and keep service facts accurate. Existing tools execute the work.',next:'See the golden paths'},
 {title:'DBREs build once. Teams reuse it.',chapter:'01 · GOLDEN PATHS',description:'Publish a versioned AAP binding with policy, inputs and an evidence contract. Each run pins its revision. Native consoles, giportal and AAP retain their roles.',benefit:'A consistent UX, with change paperwork and approval routing handled by BasePort.',target:'.golden-paths',next:'Choose a platform'},
 {title:'One service record across the stack.',chapter:'02 · INVENTORY',description:'Choose a platform. Ownership, version, recovery provider and provisioning references stay attached to the service.',benefit:'Six platforms share the same service experience; adapters retain engine-specific behavior.',target:'.inventory-panel',next:'Review drift'},
 {title:'Compare intent with fresh facts.',chapter:'03 · POLICY & DRIFT',description:'The selected service reports configuration drift. Expand a service to compare desired and observed values. Missing or stale evidence becomes Unknown.',benefit:'A stale report cannot produce a compliance pass.',target:'.policy-panel',next:'See agentless reporting'},
 {title:'Report from the automation you already run.',chapter:'04 · AGENTLESS EVIDENCE',description:'AAP jobs and pipelines send a small facts envelope. Scheduled read-only reconciliation catches changes made directly in native tools. No resident agent is needed.',benefit:'Stable IDs, timestamps and sequence checks prevent duplicate or older reports from overwriting current state.',target:'.report-builder',next:'Accept demo evidence'},
 {title:'Keep the automation. Remove the paperwork.',chapter:'05 · GOVERNED OPERATIONS',description:'BasePort generates the change record and routes approval. An approved, pinned AAP path runs only after preflight; its callback updates the service evidence.',benefit:'DBREs own playbooks and adapters. BasePort keeps the process consistent.',target:'.lifecycle-plan',next:'See the developer view'},
 {title:'Developers request outcomes.',chapter:'06 · DEVELOPER SELF-SERVICE',description:'An approved specification drives the request. BasePort creates the change, waits for reviewer approval, then invokes giportal and AAP. Try the request after this tour.',benefit:'Developers get a simple service journey without coordinating every execution layer.',target:'.provisioning-workbench',next:'Review the run history'},
 {title:'Every handoff has a record.',chapter:'07 · CHANGE & EVIDENCE',description:'The demo shows reconciliation, change creation, approval and execution together. Open a record after the tour to inspect its context.',benefit:'One history links the service, request, approver, job and evidence.',target:'.audit-panel',next:'See the takeaway'},
 {title:'A lightweight DBaaS control plane.',chapter:'THE TAKEAWAY',description:'Simple UX. Reusable golden paths. Less paperwork. Consistent policy. Agentless facts. Your existing tools keep doing the execution.',next:'Finish & explore'},
];

export default function ManagerTour({index,onNext,onBack,onClose,onRestart,platforms,selectedPlatform,onPlatformChange}) {
 const step=managerSteps[index],panel=useRef(null),[rect,setRect]=useState(null);
 const centered=index===0||index===managerSteps.length-1;
 useLayoutEffect(()=>{
  if(!step.target){setRect(null);return}
  const target=document.querySelector(step.target);
  if(!target){setRect(null);return}
  if(!target.closest('.overlay'))target.scrollIntoView({block:innerWidth<=760?'start':'center',behavior:'instant'});
  const update=()=>{
   const r=target.getBoundingClientRect(),bounds=target.closest('.modal')?.getBoundingClientRect();
   const top=Math.max(8,r.top-6,bounds?bounds.top+2:8);
   const left=Math.max(8,r.left-6);
   const bottom=Math.min(r.bottom+6,innerHeight-8,bounds?bounds.bottom-2:innerHeight-8,innerWidth<=760?(panel.current?.getBoundingClientRect().top||innerHeight)-12:innerHeight-8);
   setRect({top,left,width:Math.max(16,Math.min(r.right+6,innerWidth-8)-left),height:Math.max(16,bottom-top)});
  };
  update();const frame=requestAnimationFrame(update);
  window.addEventListener('resize',update);window.addEventListener('scroll',update,true);
  const observer=new ResizeObserver(update);observer.observe(target);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true)};
 },[index,step.target,selectedPlatform]);
 useEffect(()=>{panel.current?.querySelector('h2')?.focus({preventScroll:true})},[index]);
 useEffect(()=>{
  const handler=e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();onClose();return}
   if(e.key==='Tab'){
    const items=[...panel.current.querySelectorAll('button:not(:disabled),a[href],select')];
    if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&(document.activeElement===first||document.activeElement.tagName==='H2')){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&(document.activeElement===last||document.activeElement.tagName==='H2')){e.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',handler,true);return()=>document.removeEventListener('keydown',handler,true);
 },[onClose]);
 return <div className={`manager-tour ${centered?'tour-centered':''} `}>
  {centered?<div className="tour-shade"/>:rect?<div className="tour-spotlight" style={rect}/>:<div className="tour-shade"/>}
  <section className="tour-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description">
   <div className="tour-topline"><span className="tour-badge"><Play size={11} fill="currentColor"/>GUIDED MANAGER DEMO</span><button className="tour-close" aria-label="Exit guided demo" onClick={onClose}><X size={18}/></button></div>
   <div className="tour-progress" aria-label={`Step ${index+1} of ${managerSteps.length}`}>{managerSteps.map((_,i)=><span key={i} className={i<=index?'done':''}/>)}</div>
   <div className="tour-chapter">{step.chapter}</div>
   {centered&&<span className="tour-main-icon">{index===0?<Layers3 size={28}/>:<Check size={28}/>}</span>}
   <h2 id="tour-title" tabIndex={-1}>{step.title}</h2>
   <p id="tour-description" className="tour-description">{step.description}</p>
   {index===0&&<><div className="tour-promise"><span><Zap size={16}/>Golden paths</span><span><ShieldCheck size={16}/>Governed workflows</span><span><ChartNoAxesCombined size={16}/>Agentless evidence</span></div><div className="tour-scenario"><strong>Your scenario</strong><p>Follow a fictional MetLife service from drift detection to governed automation, then switch to developer self-service.</p></div></>}
   {index===2&&<div className="tour-platform-picker" aria-label="Demo platform">{platforms.map(p=><button key={p.id} aria-pressed={selectedPlatform===p.id} className={selectedPlatform===p.id?'selected':''} onClick={()=>onPlatformChange(p.id)}>{p.name}{selectedPlatform===p.id&&<Check size={12}/>}</button>)}</div>}
   {step.benefit&&<div className="tour-benefit"><span><Zap size={14}/>WHY THIS IS USEFUL</span><p>{step.benefit}</p></div>}
   {index===8&&<div className="tour-outcomes"><div><GitBranchIcon/><strong>DBREs build</strong><p>Versioned automation & per-engine adapters.</p></div><div><ShieldCheck size={20}/><strong>BasePort governs</strong><p>Policy, change, approval & evidence.</p></div><div><ChartNoAxesCombined size={20}/><strong>Developers ship</strong><p>Approved paths & service self-service.</p></div></div>}

   <p className="tour-disclaimer"><CircleHelp size={13}/>{index===0?'2 minutes · MetLife demo · Mock data.':index===8?'No real infrastructure was created. Demo changes are removed when you finish.':'Frontend demo · All actions simulated.'}</p>
   <div className="tour-controls"><button className="tour-back" onClick={onBack} disabled={index===0}><ArrowLeft size={15}/><span>Back</span></button><span className="tour-step-count">{index+1} / {managerSteps.length}</span><button className="button primary" onClick={onNext}>{step.next}<ArrowRight size={15}/></button></div>
   {index===8&&<button className="tour-restart" onClick={onRestart}><RotateCcw size={13}/>Replay the demo</button>}
  </section>
 </div>
}
