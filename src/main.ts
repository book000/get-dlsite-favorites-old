import puppeteer, { LaunchOptions } from "puppeteer";
import config from "../config.json";
import * as fs from 'fs';

const options: LaunchOptions = {};

(async () => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.goto("https://login.dlsite.com/login", {
        waitUntil: "networkidle2"
    });

    await page.waitForSelector("input#form_id", {
        visible: true
    }).then(element => element.type(config.username));
    await page.waitForTimeout(2000);
    await page.waitForSelector("input#form_password", {
        visible: true
    }).then(element => element.type(config.password));
    await page.waitForTimeout(2000);
    await page.waitForSelector(".loginBtn button", {
        visible: true
    }).then(element => element.click());

    await page.waitForTimeout(5000);
    if (page.url() == "https://login.dlsite.com/login") {
        console.log("Failed to login.");
        process.exit(1);
    }

    await page.goto("https://www.dlsite.com/home/mypage/wishlist/=/discount/1/order/reserve_date_d/per_page/100", {
        waitUntil: "domcontentloaded"
    });

    await page.waitForSelector("table.n_worklist", {
        visible: true
    }).catch(reason => console.log(reason));

    const list = await page.$("table.n_worklist");
    if (list == null) {
        console.log("Failed get favorites list.");
        process.exit(1);
    }
    const trs = await list.$$("tr._favorite_item");
    const results = [];
    for (const tr of trs) {
        const title = await tr.$eval("dt.work_name a", elem => elem.textContent?.trim()); // タイトル
        const folder = await tr.$eval("a._folder_name", elem => elem.textContent?.trim()); // フォルダ
        const EndOfDiscount = await tr.$eval("span.period_date", elem => elem.textContent?.trim()); // 割引終了日時
        const author = await tr.$eval("dd.maker_name a", elem => elem.textContent?.trim()); // 作者
        const initPrice = await tr.$eval("span.strike", elem => elem.textContent?.trim()); // 定価 (割引前価格)
        const currPrice = await tr.$eval("span.work_price", elem => elem.textContent?.trim()); // 現在価格 (割引後価格)
        const description = await tr.$eval("dd.work_text", elem => elem.textContent?.trim()); // 説明文
        const genres = await getGenres(tr); // ジャンル
        const tags = await getTags(tr); // タグ
        const category = await tr.$eval("div.work_category", elem => elem.textContent?.trim()); // カテゴリ

        console.log("----- " + title + " -----");
        console.log("folder", folder)
        console.log("EndOfDiscount", EndOfDiscount)
        console.log("author", author)
        console.log("initPrice", initPrice)
        console.log("currPrice", currPrice)
        console.log("description", description)
        console.log("genres", genres.join(", "))
        console.log("tags", tags.join(", "))
        console.log("category", category)

        results.push({
            "title": title,
            "folder": folder,
            "EndOfDiscount": EndOfDiscount,
            "author": author,
            "initPrice": initPrice,
            "currPrice": currPrice,
            "description": description,
            "genres": genres,
            "tags": tags,
            "category": category
        });
    }

    fs.writeFileSync("./data.json", JSON.stringify(results));
    await browser.close();

    async function getGenres(element: puppeteer.ElementHandle<Element>): Promise<string[]> {
        const work_genre = await element.$("dd.work_genre");
        if (work_genre == null) {
            return [];
        }
        const genres = await work_genre.$$eval("span",
            elems => elems.map(elem => elem.textContent)
                .filter((s: string | null): s is string => s !== null)
        );
        return genres;
    }
    async function getTags(element: puppeteer.ElementHandle<Element>): Promise<string[]> {
        const search_tag = await element.$("dd.search_tag");
        if (search_tag == null) {
            return [];
        }
        const tags = await search_tag.$$eval("a",
            elems => elems.map(elem => elem.textContent)
                .filter((s: string | null): s is string => s !== null)
        );
        return tags;
    }
})();