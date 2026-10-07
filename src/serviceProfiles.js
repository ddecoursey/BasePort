export const serviceProfiles=[
 {name:'Small',storage:32,description:'Development & small workloads'},
 {name:'Standard',storage:64,description:'Application workloads'},
 {name:'Large',storage:128,description:'Larger data estates'},
 {name:'Expanded',storage:256,description:'Data-intensive services'},
];
export const profileFor=service=>serviceProfiles.find(p=>p.storage===Number(service.storage))?.name||'Custom';
