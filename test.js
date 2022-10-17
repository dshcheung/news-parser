const express = require("express")
const fs = require("fs")
const axios = require('axios')
const { JSDOM } = require('jsdom')
const { Readability } = require('@mozilla/readability')
const { extract } = require('article-parser')
const morgan = require('morgan')
const puppeteer = require("puppeteer")

const url = 'https://www.bloomberg.com/news/articles/2022-10-16/key-takeaways-from-xi-jinping-s-speech-at-china-s-20th-party-congress-2022'


const test = async (r) => {
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
  // await browser3.close()
}

test()
