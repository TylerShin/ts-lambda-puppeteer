import { APIGatewayProxyHandler } from "aws-lambda";
import {
  puppeteer,
  args,
  executablePath,
  defaultViewport,
  headless,
} from "chrome-aws-lambda";
import "source-map-support/register";

export const crawl: APIGatewayProxyHandler = async (_event, _context) => {
  const browser = await puppeteer.launch({
    args,
    defaultViewport,
    executablePath: await executablePath,
    headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
  );
  await page.goto("https://google.conm", { waitUntil: "networkidle0" });

  const title = await page.title();
  const content = await page.content();
  console.log(title);

  return {
    statusCode: 200,
    headers: {
      ["Content-Type"]: "text/html; charset=utf-8",
    },
    body: content,
  };
};
