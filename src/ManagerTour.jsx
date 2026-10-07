import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ArrowRight, ArrowLeft, X, Check, Play, Layers3, Zap, ShieldCheck, ChartNoAxesCombined, RotateCcw, CircleHelp} from 'lucide-react';
import './tour.css';

export const managerSteps = [
 {title:'Welcome to BasePort, Binaya.',chapter:'THE BIG IDEA',description:'One enterprise front door for finding, requesting, and managing data services. Follow a team’s journey from a new project to a ready-to-use service.',next:'Take the tour'},
 {title:'One place to see the whole picture.',chapter:'01 · A CONNECTED WORKSPACE',description:'Teams see their services, open requests, and platform health together. BasePort is a gateway across existing data platforms; each platform continues to do the work it is built for.',benefit:'A shared view helps engineers find what they need and gives managers visibility into demand and service health.',target:'.stats-grid',next:'Explore the platforms'},
 {title:'Choice for teams. Standards for the enterprise.',chapter:'02 · THE SERVICE CATALOG',description:'Oracle, SQL Server, Db2, PostgreSQL, MongoDB, and Cloudera share one request experience. Choose a platform below for this demo.',benefit:'An approved catalog could reduce one-off requests and make supported versions, backup policies, and security defaults easier to understand.',target:'.full-catalog-grid',next:'Configure a demo service'},
 {title:'Turn a request into a clear specification.',chapter:'03 · SELF-SERVICE REQUESTS',description:'Our example team needs a development service for business insights. The request captures a name, environment, owning team, and resource size.',benefit:'A consistent request gives the platform team the information it needs upfront, with fewer clarification messages and manual hand-offs.',target:'.request-form',next:'Review the request'},
 {title:'Self-service with a review point.',chapter:'04 · GOVERNANCE IN THE FLOW',description:'Before submission, the team can review ownership and resources. The concept makes backup, encryption, and monitoring expectations visible alongside the request.',benefit:'An integrated approval process could preserve enterprise controls while giving teams a simpler path to a service.',target:'.review-step',next:'Submit demo request'},
 {title:'Everyone knows what happens next.',chapter:'05 · REQUEST VISIBILITY',description:'The demo request now appears as “In review.” Teams can track progress through review, provisioning, and readiness in the same portal.',benefit:'Visible status and ownership could reduce follow-up messages and help managers identify where requests are waiting.',target:'[data-tour="demo-request"]',next:'Simulate approval & provisioning'},
 {title:'A usable service, with a clear owner.',chapter:'06 · THE SERVICE LIFECYCLE',description:'We’ve simulated approval and provisioning. The service now has an owning team, resource details, and a connection endpoint. Engineers can return here to view and manage it.',benefit:'A central inventory gives teams a consistent handover and helps platform owners maintain visibility after provisioning.',target:'.detail-drawer',next:'See the workspace insights'},
 {title:'Make the footprint visible.',chapter:'07 · MANAGEMENT INSIGHTS',description:'Usage views bring resource utilization and the mix of data platforms into one place. The figures shown here are illustrative, not live operational measurements.',benefit:'Connected metrics could support capacity planning and reveal services that need attention or further investigation.',target:'.insights-grid',next:'See the business case'},
 {title:'A simpler path from project to platform.',chapter:'THE TAKEAWAY',description:'BasePort brings discovery, requests, governance, and service visibility into one experience. The value to validate is a faster, clearer service journey with consistent enterprise controls.',next:'Finish & explore'},
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
 return <div className={`manager-tour ${centered?'tour-centered':''} ${index===6?'tour-left':''}`}>
  {centered?<div className="tour-shade"/>:rect?<div className="tour-spotlight" style={rect}/>:<div className="tour-shade"/>}
  <section className="tour-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description">
   <div className="tour-topline"><span className="tour-badge"><Play size={11} fill="currentColor"/>GUIDED MANAGER DEMO</span><button className="tour-close" aria-label="Exit guided demo" onClick={onClose}><X size={18}/></button></div>
   <div className="tour-progress" aria-label={`Step ${index+1} of ${managerSteps.length}`}>{managerSteps.map((_,i)=><span key={i} className={i<=index?'done':''}/>)}</div>
   <div className="tour-chapter">{step.chapter}</div>
   {centered&&<span className="tour-main-icon">{index===0?<Layers3 size={28}/>:<Check size={28}/>}</span>}
   <h2 id="tour-title" tabIndex={-1}>{step.title}</h2>
   <p id="tour-description" className="tour-description">{step.description}</p>
   {index===0&&<><div className="tour-promise"><span><Zap size={16}/>Self-service for teams</span><span><ShieldCheck size={16}/>A consistent process</span><span><ChartNoAxesCombined size={16}/>Visibility for leaders</span></div><div className="tour-scenario"><strong>Your scenario</strong><p>A team needs a data service for a business insights project. Watch how BasePort could guide it from discovery to readiness.</p></div></>}
   {index===2&&<div className="tour-platform-picker" aria-label="Demo platform">{platforms.map(p=><button key={p.id} aria-pressed={selectedPlatform===p.id} className={selectedPlatform===p.id?'selected':''} onClick={()=>onPlatformChange(p.id)}>{p.name}{selectedPlatform===p.id&&<Check size={12}/>}</button>)}</div>}
   {step.benefit&&<div className="tour-benefit"><span><Zap size={14}/>WHY THIS IS USEFUL</span><p>{step.benefit}</p></div>}
   {index===8&&<><div className="tour-outcomes"><div><Zap size={20}/><strong>Less friction for teams</strong><p>Find supported options and submit complete requests in one place.</p></div><div><ShieldCheck size={20}/><strong>Consistency for platform owners</strong><p>Apply a repeatable process across different data technologies.</p></div><div><ChartNoAxesCombined size={20}/><strong>Clarity for leaders</strong><p>See demand, ownership, service health, and resource usage together.</p></div></div><div className="tour-next-phase"><strong>What this POC demonstrates</strong><p>The user experience and simulated service journey.</p><strong>What a production version would need</strong><p>Enterprise identity, approved policies, real platform automation, workflow integration, and live telemetry.</p><strong>How we would measure its value</strong><p>Request lead time, manual hand-offs, policy compliance, and resource utilization.</p></div></>}
   <p className="tour-disclaimer"><CircleHelp size={13}/>{index===0?'About 3 minutes · No setup needed · All data and actions are mocked.':index===8?'No real infrastructure was created. Demo records are removed when you finish.':'Prototype demo · Approvals, provisioning, security, and metrics are simulated.'}</p>
   <div className="tour-controls"><button className="tour-back" onClick={onBack} disabled={index===0}><ArrowLeft size={15}/><span>Back</span></button><span className="tour-step-count">{index+1} / {managerSteps.length}</span><button className="button primary" onClick={onNext}>{step.next}<ArrowRight size={15}/></button></div>
   {index===8&&<button className="tour-restart" onClick={onRestart}><RotateCcw size={13}/>Replay the demo</button>}
  </section>
 </div>
}
