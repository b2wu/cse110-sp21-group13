const { puppeteerErrors } = require("puppeteer");
const puppeteer = require('puppeteer');
let page;
let browser;

describe ('Basic user flow for login page', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({headless: false, slowMo: 100, testTimeout: 30000,});
        page = await browser.newPage();
        await page.goto('https://journalbullet.herokuapp.com');
        //await page.waitForTimeout(500);
    });

    it('Test 1: landing page title and welcome', async () => {
        let title = await page.$eval('title', (header) =>{return header.innerHTML;});
        let welcome = await page.$eval('main h1', (ele) =>{return ele.textContent;});
        expect(welcome).toBe('Welcome to your new journal!');
        expect(title).toBe('13ullet');
    });
    it('Test 2: landing page reason statement', async () => {
        let reason = await page.$eval('main h1+h2', (ele1) => {return ele1.textContent;});
        let reason2 = await page.$eval('main h2+h2', (ele3) => {return ele3.textContent;});
        expect(reason2).toBe('Stay productive online');
        expect(reason).toBe('Reduce paper waste');
    });
    it('Test 3: landing page logo', async() => {
        let source = await page.$eval('img', (image) => {return image.src;});
        let altText = await page.$eval('img', (image) =>{return image.alt;});
        expect(source.includes('assets/images/logo.svg')).toBe(true);
        expect(altText).toBe('a smiling black cat');
    });
    it('Test 4: click get started button and get to login', async () => {
        await expect(page).toClick('button', {text: 'get started'});
        let name = await page.$eval('#loginform > label', (username) => {return username.textContent;});
        let password = await page.$eval('#loginform input+label', (key) => {return key.textContent;});
        expect(name).toBe('Name');
        expect(password).toBe('Password');
    }, 20000);

    const newUser = {
        'username': 'test',
        'password': '12345',
    };

    it('Test 5: sign up with missing password field', async () =>{
        await expect(page).toFillForm('form[id=loginform]',{
            username: newUser.username,
            //password: newUser.password,
        });
        await expect(page).toClick('button', {text: 'sign up'});
        let error = await page.$eval('#errormsg', (errorMsg) => {return errorMsg.innerText;});
        expect(error).toBe('please enter a username and a password');
    }, 20000);


    it('test 6: sign up with new user or log in with existing user', async () => {
        await expect(page).toFillForm('form[id=loginform]',{
            //username: newUser.username,
            password: newUser.password,
        });
        await expect(page).toClick('button', {text: 'sign up'});
        let error = await page.$eval('#errormsg', (errorMsg) => {return errorMsg.innerText;});
        if(error.length != 0){
            expect(error).toBe('username already taken');
            await expect(page).toClick('button', {text: 'log in'});
            await page.waitForNavigation({waitUntil: 'networkidle2'});
            expect(page.url().includes('daily.html')).toBe(true);
        };
    }, 20000);
    afterAll(async () => {
        browser.close();
    });
});
