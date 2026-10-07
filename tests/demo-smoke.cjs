const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('@playwright/test');

const baseURL = process.env.DEMO_TEST_URL || 'http://127.0.0.1:3000/';
const browserPath = '/usr/bin/chromium';
const launchOptions = {headless:true,args:['--no-sandbox']};
if(fs.existsSync(browserPath))launchOptions.executablePath=browserPath;

(async()=>{
 const browser=await chromium.launch(launchOptions);
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(baseURL+(baseURL.includes('?')?'&':'?')+'demo=binaya');
   const tour=page.locator('.tour-panel');
   await tour.getByRole('heading',{name:'Welcome to BasePort, Binaya.'}).waitFor();
   await page.waitForTimeout(250);await page.screenshot({path:mobile?'/tmp/baseport-tour-mobile-intro.png':'/tmp/baseport-tour-intro.png'});
   assert.equal(await page.locator('.main-shell').getAttribute('inert'),'');
   await page.keyboard.press('Tab');
   assert(await page.evaluate(()=>!!document.activeElement.closest('.tour-panel')),'Keyboard focus left the tour');
   await tour.getByRole('button',{name:'Take the tour'}).click();
   await tour.getByRole('button',{name:'Explore the platforms'}).click();
   await tour.getByRole('button',{name:mobile?'MongoDB':'SQL Server',exact:true}).click();
   await tour.getByRole('button',{name:'Configure a demo service'}).click();
   assert.equal(await page.locator('.request-form input').inputValue(),'business-insights-demo');
   await tour.getByRole('button',{name:'Review the request'}).click();
   assert((await page.locator('.review-platform').textContent()).includes(mobile?'MongoDB':'SQL Server'));
   await page.waitForTimeout(250);await page.screenshot({path:mobile?'/tmp/baseport-tour-mobile-review.png':'/tmp/baseport-tour-review.png'});
   await tour.getByRole('button',{name:'Submit demo request'}).click();
   assert.equal(await page.locator('[data-tour="demo-request"]').count(),1);
   assert((await page.locator('[data-tour="demo-request"]').textContent()).includes('In review'));
   await tour.getByRole('button',{name:'Back',exact:true}).click();
   await tour.getByRole('button',{name:'Submit demo request'}).click();
   assert.equal(await page.locator('[data-tour="demo-request"]').count(),1,'Demo request duplicated on back/next');
   await tour.getByRole('button',{name:'Simulate approval & provisioning'}).click();
   assert((await page.locator('.detail-drawer').textContent()).includes('business-insights-demo.data.acme.internal'));
   await tour.getByRole('button',{name:'See the workspace insights'}).click();
   assert.equal(await page.locator('.insights-grid').count(),1);
   await tour.getByRole('button',{name:'See the business case'}).click();
   await page.waitForTimeout(250);await page.screenshot({path:mobile?'/tmp/baseport-tour-mobile-summary.png':'/tmp/baseport-tour-summary.png'});
   await tour.getByRole('button',{name:'Replay the demo'}).click();
   await tour.getByRole('heading',{name:'Welcome to BasePort, Binaya.'}).waitFor();
   await tour.getByRole('button',{name:'Take the tour'}).click();
   await tour.getByRole('button',{name:'Explore the platforms'}).click();
   await tour.getByRole('button',{name:'Configure a demo service'}).click();
   await tour.getByRole('button',{name:'Review the request'}).click();
   await tour.getByRole('button',{name:'Submit demo request'}).click();
   await tour.getByRole('button',{name:'Simulate approval & provisioning'}).click();
   await tour.getByRole('button',{name:'See the workspace insights'}).click();
   await tour.getByRole('button',{name:'See the business case'}).click();
   await tour.getByRole('button',{name:'Finish & explore'}).click();
   assert.equal(await page.locator('.tour-panel').count(),0);
   assert(!new URL(page.url()).searchParams.has('demo'));
   if(mobile){await page.getByLabel('Open navigation').click()}
   await page.locator('.sidebar').getByRole('button',{name:/^Requests/}).click();
   assert.equal(await page.locator('tbody tr').count(),3,'Demo requests were not cleaned up');
   if(mobile){await page.getByLabel('Open navigation').click()}
   await page.getByRole('button',{name:'My services',exact:true}).click();
   assert.equal(await page.locator('tbody tr').count(),6,'Demo service was not cleaned up');
   if(mobile){await page.getByLabel('Open navigation').click()}
   await page.getByRole('button',{name:'Guided manager demo',exact:true}).click();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('.tour-panel').count(),0);
   await page.getByRole('button',{name:'Request a service',exact:true}).click();
   await page.getByRole('dialog').getByRole('button',{name:'Continue',exact:true}).click();
   await page.getByPlaceholder('e.g. customer-insights-dev').fill('existing-user-request');
   await page.getByRole('dialog').getByRole('button',{name:'Continue',exact:true}).click();
   await page.getByRole('button',{name:'Submit request',exact:true}).click();
   await page.getByRole('button',{name:'Track your request',exact:true}).click();
   if(mobile){await page.getByLabel('Open navigation').click()}
   await page.getByRole('button',{name:'Guided manager demo',exact:true}).click();
   await tour.getByRole('button',{name:'Take the tour'}).click();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('tbody tr').count(),4,'Existing user request was lost');
   await page.getByText('existing-user-request',{exact:true}).waitFor();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal viewport overflow');
   assert.deepEqual(errors,[]);
   console.log(`${mobile?'Mobile':'Desktop'} passed: deep link, focus isolation, platform selection, review, submission, back/next, simulated provisioning, insights, replay, cleanup, Escape, user-data preservation.`);
   await page.close();
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
