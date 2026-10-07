const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('@playwright/test');
const baseURL=process.env.DEMO_TEST_URL||'http://127.0.0.1:3000/';
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(fs.existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium'}:{})});try{
 for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(baseURL+'?view=dbre');
 const nav=async name=>{if(mobile)await page.getByLabel('Open navigation').click();await page.locator('.sidebar').getByRole('button',{name,exact:true}).click()};
 const overflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal overflow');
 await page.screenshot({path:`/tmp/baseport-metlife-${mobile?'mobile':'desktop'}.png`});await overflow();
 await nav('Connected tools');assert.equal(await page.locator('.tool-card').count(),6);await page.locator('.tool-card').filter({hasText:'Grafana + Elastic'}).getByRole('button').click();
 let modal=page.getByRole('dialog');assert((await modal.textContent()).includes('No external connection'));await modal.getByLabel('Close dialog').click();await overflow();
 if(mobile)await page.getByLabel('Open navigation').click();await page.locator('.persona-switch').getByRole('button',{name:'Developer',exact:true}).click();await nav('Request a service');await page.getByLabel('Service name',{exact:true}).fill('metlife-request-demo');await page.getByLabel('Environment',{exact:false}).selectOption('Production');await page.getByRole('button',{name:'Simulate service request'}).click();await page.getByRole('button',{name:'Simulate reviewer approval'}).click();
 await page.getByRole('button',{name:'View registered service'}).waitFor();assert.equal(await page.locator('.provision-stage.done').count(),5);assert((await page.locator('.request-correlations').textContent()).includes('ANS-DEMO-'));await overflow();
 await page.getByRole('button',{name:'View registered service'}).click();await page.getByRole('button',{name:'metlife-request-demo',exact:true}).click();assert((await page.locator('.db-detail-grid').textContent()).includes('Rubrik'));assert(!(await page.locator('main').textContent()).includes('CPU utilization'));
 await page.locator('.context-links').getByRole('button',{name:'pgAdmin',exact:false}).click();modal=page.getByRole('dialog');assert((await modal.textContent()).includes('metlife-request-demo'));await modal.getByLabel('Close dialog').click();await overflow();
 if(mobile)await page.getByLabel('Open navigation').click();await page.locator('.persona-switch').getByRole('button',{name:'DBRE',exact:true}).click();await nav('Backup & recovery');assert((await page.locator('.backup-panel').textContent()).includes('Rubrik'));assert((await page.locator('.backup-panel').textContent()).includes('Platform-native'));await overflow();
 await nav('Service insights');assert((await page.locator('.insight-cards').textContent()).includes('7/7'));assert((await page.locator('main').textContent()).includes('Performance, logs & alerts:'));await overflow();await page.screenshot({path:`/tmp/baseport-insights-${mobile?'mobile':'desktop'}.png`});
 await nav('Audit & activity');await page.locator('.audit-panel tbody tr').first().click();modal=page.getByRole('dialog');assert((await modal.textContent()).includes('Provision service'));assert(/CHG-\d+/.test(await modal.textContent()));assert.deepEqual(errors,[]);await page.close();console.log(`${mobile?'Mobile':'Desktop'} connected-stack smoke passed: provisioning approval guard, five-step route, registration, native tool context, recovery providers, estate insights, correlated audit and responsive layout.`);
 }
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
