import chromium from 'chrome-aws-lambda';

import type { Grades, Hello } from '../models';

// eslint-disable-next-line antfu/top-level-function
const doScrape = async (): Promise<Grades> => {
  const executablePath = await chromium.executablePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  console.log(`executablePath: ${executablePath}`);
  const cargs = await chromium.args;
  console.log(`cargs: ${cargs}`);
  const browser = await chromium.puppeteer.launch({
    headless: true,
    args: cargs,
    // args: [
    //   // '--incognito',
    //   '--window-size=900,800',
    //   '--window-position=800,50',
    //   '--no-sandbox',
    //   '--disable-setuid-sandbox',
    //   '--disable-dev-shm-usage',
    //   '--disable-web-security',
    //   '--disable-features=IsolateOrigins,site-per-process',
    //   // '--shm-size=6gb',
    //   '--disable-notifications',
    // ],
    // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    executablePath,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://portal.wcsd.k12.ca.us/parent/LoginParent.aspx');

  await page.waitForSelector('input[name=portalAccountUsername]');
  await page.$eval('input[name=portalAccountUsername]', el => el.value = 'robin.zimmermann@gmail.com');

  await page.waitForSelector('#next');
  await page.click('#next');

  await page.waitForSelector('input[name=portalAccountPassword]');
  await page.$eval('input[name=portalAccountPassword]', el => el.value = 'Wicked-duel-82');

  await page.waitForSelector('#LoginButton');
  await page.click('#LoginButton');

  await page.waitForNavigation({
    waitUntil: 'networkidle2',
  });

  const grades: Grades = {};
  for (const card of await page.$$('.Card')) {
    // const textHeading = await card.$('.TextHeading');
    // if (textHeading) {
    //   const textValue = await textHeading.getProperty('innerText');
    //   console.log(`textValue: ${textValue}`);
    // }

    const textHeading = await card.$eval('.TextHeading', el => el.textContent);
    const gradeHtml = await card.$eval('.Grade', el => el.textContent);
    const grade = gradeHtml?.substring(0, gradeHtml.indexOf('(')) || '';
    // console.log(`textHeading: ${textHeading}, ${grade}`);

    let screenTime = 0;
    switch (grade) {
      case 'A+':
        screenTime = 26;
        break;
      case 'A':
      case 'A-':
        screenTime = 24;
        break;
      case 'B+':
        screenTime = 18;
        break;
      case 'B':
      case 'B-':
        screenTime = 16;
        break;
      case 'C+':
        screenTime = 10;
        break;
      case 'C':
        screenTime = 5;
        break;
    }

    switch (textHeading?.trim()) {
      // case 'Advisory Q2 - Quarter 2':
      //   grades.Advisory = { teacher: 'Mrs Albaugh', grade, screenTime };
      //   break;
      case '1 - Tech 1 - Q2 - Quarter 2':
        grades['Tech Theatre'] = { teacher: 'Baez', grade, screenTime };
        break;
      case 'PE 2 - Quarter 2':
        grades.PE = { teacher: 'Mrs Kern', grade, screenTime };
        break;
      case 'Eng 8 - Quarter 2':
        grades.English = { teacher: 'Mrs Weems', grade, screenTime };
        break;
      case '4-Iantorno-Q2-Art1 - Quarter 2':
        grades.Art = { teacher: 'Mrs Iantorno', grade, screenTime };
        break;
      case 'Period 5 Barouki - Quarter 2':
        grades.Science = { teacher: 'Mrs Barouki', grade, screenTime };
        break;
      case 'Hist 8 - Quarter 2':
        grades.History = { teacher: 'Mr Hurd', grade, screenTime };
        break;
      case 'Math 8 - 7th - Quarter 2':
        grades.Mathematics = { teacher: 'Mrs Jarman', grade, screenTime };
        break;
    }
  }

  return grades;
  // await browser.close();
};

export default defineEventHandler(async (_event): Promise<Grades> => {
  const grades = await doScrape();
  return grades;

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(<Hello>{
  //       hello: 'worldA',
  //     })
  //   }, 3000)
  // })
});
