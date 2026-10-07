import React from 'react';
import {ArrowLeft,ArrowRight,Layers3} from 'lucide-react';
import {Modal} from './ui.jsx';
import {platforms} from './data.js';
const steps=[
 ['DBaaS across the enterprise stack','Binaya, teams choose a database offering and manage it as a service. BasePort brings provisioning, recovery, schema delivery and lifecycle work into one experience.'],
 ['Choose the service your team needs','Six database offerings share service profiles and an enterprise baseline. Provisioning follows giportal and Ansible; the service then stays in BasePort for its full lifecycle.'],
 ['Everything in context','Ownership, recovery, schema changes and history live with the service. Developers use safe self-service paths; DBREs manage policy and lifecycle actions.'],
 ['Paperwork follows the work','A request prepares the change record, waits for explicit approval, then calls the existing execution layer. Results and job references return to the same record.'],
 ['Build once. Reuse consistently.','DBREs own the automation. Versioned paths pin approved bindings. Agentless job callbacks and scheduled read-only collection keep the service record accurate.'],
 ['One front door for both teams','Developers see their team’s services and requests. DBREs govern the estate. BasePort can launch from giportal or live within it; the value is the shared service layer.']
];
export default function Tour({step,platform,onChange,onClose}){return <Modal title="BasePort · manager tour" onClose={onClose}><div className="tour-card"><span className="tour-eyebrow"><Layers3 size={16}/>For Binaya · {step+1} of {steps.length}</span><h3>{steps[step][0]}</h3><p>{steps[step][1]}</p>{step===1&&<label>Try a platform<select value={platform} onChange={e=>onChange({platform:e.target.value})}>{platforms.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}<div className="tour-dots">{steps.map((_,i)=><i key={i} className={i===step?'active':''}/>)}</div></div><div className="modal-actions"><button className="button secondary" onClick={()=>onChange({step:step===0?0:step-1})} disabled={step===0}><ArrowLeft size={14}/>Back</button><div className="tour-end">{step===5&&<button className="text-button" onClick={()=>onChange({step:0})}>Replay</button>}<button className="button primary" onClick={step===5?onClose:()=>onChange({step:step+1})}>{step===5?'Explore BasePort':'Next'}<ArrowRight size={15}/></button></div></div></Modal>}
