require("colors");
const { argv } = require("yargs");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

async function checkCclStatus() {
  const browser = await puppeteer.launch({
    args: ["--disable-dev-shm-usage", "--window-size=1600,1600"],
    headless: argv.hideBrowser || false,
    userDataDir: "./user-data-dir",
    defaultViewport: null,
  });
  const page = (await browser.pages())[0];
  await page.goto("https://www.ispfsb.com/Public/Login.aspx");
  await page.waitForSelector(
    "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.label.ui-draggable.ui-resizable > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button",
    { visible: true, timeout: 5000 },
  );
  await page.click(
    "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.label.ui-draggable.ui-resizable > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button > span.ui-button-icon.ui-icon.ui-icon-closethick",
  );
  await page.type("#txtU", argv.ispUsername);
  await page.type("#txtP", argv.ispPassword);
  await page.type("#txtLastname", argv.ispLastName);
  await page.focus("#txtDOB");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.type("#txtDOB", argv.ispDOB);
  await page.click("#btnSignIn");

  await page.waitForSelector(
    "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.label.ui-draggable.ui-resizable > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button",
    { visible: true, timeout: 5000 },
  );
  await page.click(
    "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.label.ui-draggable.ui-resizable > div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle > button",
  );
  const status = await page.evaluate(
    (argv) => {
      return document.querySelector(`${argv.ccl ? "#myCCLStatus" : "#myFOIDStatus"} > span`)
        .className;
    },
    { argv },
  );

  let statusToCheck = "";

  if (argv.submitted) {
    statusToCheck = "SUBMITTED";
  }
  if (argv.qc_verified) {
    statusToCheck = "QC_VERIFIED";
  }

  if (status !== statusToCheck) {
    console.log(`${argv.ccl ? "CCL" : "FOID"} status change`.green);
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: argv.gmailUsername,
        pass: argv.gmailPassword,
      },
    });

    await transporter.sendMail({
      from: argv.gmailUsername,
      to: argv.toEmail,
      subject: `${argv.ccl ? "CCL" : "FOID"} Status Change`,
    });
  } else console.log(`No ${argv.ccl ? "CCL" : "FOID"} status change`);
  await page.click("#divHead > a.logout");
  await browser.close();
}

cron.schedule("0 8-17 * * 1-5", () => {
  checkCclStatus();
});
