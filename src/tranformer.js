const process = require('process')
const fs = require('fs')
const path = require('path')
const stringHash = require('string-hash')

const rectJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./assets/boundingRect.json")))
const jsxFile = path.join(process.cwd(), "./example/pages/index.js")
const cssFile = path.join(process.cwd(), "./example/pages/index.css")

const JSX_INJECT = "{/* Inject design-draft */}"

function styleWithAbsolute(root) {
  root.style = root.style || {}

  root.style.width = root.rect.width
  root.style.height = root.rect.height
  root.style.top = root.rect.x
  root.style.left = root.rect.y

  if (root.children.length) {
    root.children.forEach(v => {
      styleWithAbsolute(v)
    })
  }
}

function renderContent(root, index, headContent, tailCotent) {
  
}

function writeJSX(jsxFile, root) {
  jsxFile = fs.readFileSync(jsxFile, 'utf8')
  jsxFileLines = jsxFile.split('\n')

  const injectLineIndex = jsxFileLines.findIndex(v => v.trim() === JSX_INJECT)
  const indent = -jsxFileLines[injectLineIndex].split('').reduce((r, v) => {
    if (r >= 0 && v === ' ') {
      return ++r
    } else {
      return r >= 0 ? -r : r
    }
  }, 0)

  const content = renderContent(root, indent, '', '')
}

function transform(root, jsxFile, cssFile) {
  if (root.children.length === 1) {
    root = root.children[0]
  }

  styleWithAbsolute(root)

  writeJSX(jsxFile, root)
}

const JSX = transform(rectJson, jsxFile, cssFile)
