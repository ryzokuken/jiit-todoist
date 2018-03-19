const puppeteer = require('puppeteer');

const ENROLLMENT_SELECTOR = '#MemberCode';
const DOB_SELECTOR = '#DATE1';
const PASSWORD_SELECTOR = '#Password101117';
const CAPTCHA_TEXT =
  '#Table_01 > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr > td.backform > table > tbody > tr:nth-child(1) > td > div > s > i > font';
const CAPTCHA_SELECTOR = '#txtcap';
const SUBMIT_SELECTOR = '#BTNSubmit';

const SAVE_SELECTOR = '#save';
const SKIP_SELECTOR = 'body > center > a > font';

const [username, dob, password] = process.argv.slice(2);

async function fillForm(page) {
  await page.click(ENROLLMENT_SELECTOR);
  await page.keyboard.type(username);

  await page.click(DOB_SELECTOR);
  await page.keyboard.type(dob);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(password);

  const captcha = await page.evaluate(
    CAPTCHA_TEXT => document.querySelector(CAPTCHA_TEXT).textContent,
    CAPTCHA_TEXT
  );
  await page.click(CAPTCHA_SELECTOR);
  await page.keyboard.type(captcha);

  await page.click(SUBMIT_SELECTOR);
}

async function skipDraftPage(page) {
  await page.click(SAVE_SELECTOR);
  await page.click(SKIP_SELECTOR);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://webkiosk.jiit.ac.in');

  fillForm(page);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  skipDraftPage(page);
  await page.waitFor(50000);

  await browser.close();
})();
