const express = require('express');
const axios = require("axios");
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");
const app = express();
const port = 3000
app.listen(port, () => {
    console.log(`please click here  http://localhost:${port}/getTimeNews`)
})
app.get('/getTimeNews', async (req, res) => {
    try {
        let response = await axios.get("https://time.com/");
        const dom = htmlparser2.parseDocument(response.data, {
            xmlMode: true,
            decodeEntities: true, // Decode HTML entities.
            withStartIndices: false, // Add a `startIndex` property to nodes.
            withEndIndices: false, // Add an `endIndex` property to nodes.
        });
        const $ = cheerio.load(dom, {
            xml: {
                normalizeWhitespace: true,
            },
        });
        let latestNews = [];
        await $("body > main > section.homepage-section-v2.voices-ls > div.partial.latest-stories > ul >li>a")
            .each(function (index) {
                let title = $(this).text()
                    .replace(/\t/g, "")
                    .replace(/\s+/g, " ")
                    .replace(/\n/g, "")
                    .trim()
                let link = "https://time.com" + $(this).attr('href')
                if (index < 5) {
                    latestNews.push({ title, link })
                }
            })
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(latestNews));
    } catch (error) {
        console.log("got error", error.stack)
        res.send(error.stack)
    }

})
