import React from 'react';
import {ArrowLeft,ArrowRight,Layers3} from 'lucide-react';
import {Modal} from './ui.jsx';
import {platforms} from './data.js';
const steps=[
 ['One portal. The right space.','Binaya, BasePort gives each audience the DBaaS experience they need. Spaces scope the data, navigation and actions across the same database estate.'],
 ['Personal, platform and fleet','Developers see their assigned databases. DBREs operate an assigned platform. Management sees the whole fleet through read-only portfolio summaries.'],
 ['Access follows responsibility','A space carries both scope and capabilities. Database operations stay in personal and platform spaces; management gets business ownership, protection coverage and lifecycle demand.'],
 ['Governed work stays connected','Technical spaces prepare change context, route explicit approval and track execution through giportal, AAP, recovery providers and schema tooling. Management sees aggregate demand.'],
 ['Consistent platforms. Clear summaries.','DBREs maintain their platform’s golden paths and agentless facts. Management sees coverage and attention counts, with no endpoints, SQL or job details.'],
 ['Same estate. Different perspectives.','BasePort connects existing enterprise tools. Shared service records support personal self-service, platform operations and executive visibility without requiring everyone to use the technical interface.']
];
export default function Tour({step,platform,persona,onChange,onClose}){return <Modal title="BasePort · manager tour" onClose={onClose}><div className="tour-card"><span className="tour-eyebrow"><Layers3 size={16}/>For Binaya · {step+1} of {steps.length}</span><h3>{steps[step][0]}</h3><p>{steps[step][1]}</p>{step===1&&persona==='DBRE'&&<label>Try a platform space<select value={platform} onChange={e=>onChange({platform:e.target.value})}>{platforms.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}<div className="tour-dots">{steps.map((_,i)=><i key={i} className={i===step?'active':''}/>)}</div></div><div className="modal-actions"><button className="button secondary" onClick={()=>onChange({step:step===0?0:step-1})} disabled={step===0}><ArrowLeft size={14}/>Back</button><div className="tour-end">{step===5&&<button className="text-button" onClick={()=>onChange({step:0})}>Replay</button>}<button className="button primary" onClick={step===5?onClose:()=>onChange({step:step+1})}>{step===5?'Explore BasePort':'Next'}<ArrowRight size={15}/></button></div></div></Modal>}
