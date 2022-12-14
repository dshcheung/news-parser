const express = require("express")
const fs = require("fs")
const axios = require('axios')
const { JSDOM } = require('jsdom')
const { Readability } = require('@mozilla/readability')
const { extract } = require('article-parser')
const morgan = require('morgan')
const puppeteer = require("puppeteer")

const app = express()
const port = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(morgan('dev'))

const dirname = `${__dirname}/tmp`
if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

// Readability
app.get("/article1", async (req, res) => {
  const { query: { url } } = req
  try {
    const resp1 = await axios({ url })
    const doc1 = new JSDOM(resp1.data)
    const article1 = new Readability(doc1.window.document).parse()
    res.status(200).json(article1)
  } catch (err) {
    console.log(err)
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
    console.log(err)
    res.status(400).json(err)
  }
})

// Puppeteer + Readability
app.get("/article3", async (req, res) => {
  const { query: { url } } = req
  console.log('url', url)

  try {
    const browser3 = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false
    })
    console.log('browser3', browser3)

    const page3 = await browser3.newPage()
    console.log('page3', page3)
    await page3.goto(url)
    const html3 = await page3.evaluate(() => document.body.innerHTML)
    console.log('html3', html3)
    const doc3 = new JSDOM(html3)
    console.log('doc3', doc3)
    const article3 = new Readability(doc3.window.document).parse()
    console.log('article3', article3)
    await browser3.close()
    res.status(200).json(article3)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
