import puppeteer from 'puppeteer';

describe('show/hide an event details', () => {

  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 200,
      ignoreDefaultArgs: ['--disable-extensions']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('detail collapsed by default', async () => {
    const eventDetails = await page.$('.event .eventDetail');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see its details', async () => {
    await page.click('.event .buttonDetail');
    const eventDetails = await page.$('.event .eventDetail');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide its detail', async () => {
    await page.click('.event .buttonDetail');
    const eventDetails = await page.$('.event .eventDetail');
    expect(eventDetails).toBeNull();
  });



});

//create var browser, page. make before all settings for set timeout, ppteer launch, open page, go to localhost, select event component
//create function to close browser after the test run
// test user can colapse event , simulate click in event component button, var eventDetails, then expect event detail to be null