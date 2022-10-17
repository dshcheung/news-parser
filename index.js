const express = require("express")
const app = express()
const port = process.env.PORT || 3000

const axios = require('axios')
const { JSDOM } = require('jsdom')
const { Readability } = require('@mozilla/readability')
const { extract } = require('article-parser')
const puppeteer = require('puppeteer')

// Readability
app.get("/article1", async (req, res) => {
  const { query: { url } } = req
  try {
    const resp1 = await axios({ url })
    const doc1 = new JSDOM(resp1.data)
    const article1 = new Readability(doc1.window.document).parse()
    res.status(200).json(article1)
  } catch (err) {
    res.status(400).json(err)
  }
})

// Article Parse
app.get("/article2", async (req, res) => {
  const { query: { url } } = req

  try {
    const article2 = await extract(url)
    res.status(200).json(article2)
  } catch (err) {
    res.status(400).json(err)
  }
})

// Puppeteer + Readability
app.get("/article3", async (req, res) => {
  const { query: { url } } = req

  try {
    const browser3 = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'],
      headless: false
    })
    const page3 = await browser3.newPage()
    await page3.goto(url)
    const html3 = await page3.evaluate(() => document.body.innerHTML)
    const doc3 = new JSDOM(html3).window.document
    const article3 = new Readability(doc3).parse()
    await browser3.close()
    res.status(200).json(article3)
  } catch (err) {
    res.status(400).json(err)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
