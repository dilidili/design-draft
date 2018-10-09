const process = require('process')
const fs = require('fs')
const path = require('path')
const stringHash = require('string-hash')

const rectJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./assets/boundingRect.json")))
const jsxFile = path.join(process.cwd(), "./example/pages/index.js")
const outputFile = path.join(process.cwd(), "./example/pages/index_o.js")
const cssFile = path.join(process.cwd(), "./example/pages/index.css")

const JSX_INJECT = "{/* Inject design-draft */}"

const IGNORE_BIAS = 0.02

function fittingRect(from, to) {
  const bias_p_l = (to.rect.x - from.rect.x) / from.rect.width
  if (Math.abs(bias_p_l) < IGNORE_BIAS) {
    from.rect.x = to.rect.x
    from.rect.width *= (1 - bias_p_l)
  }
  const bias_p_lr = (to.rect.x + to.rect.width - from.rect.x) / from.rect.width
  if (Math.abs(bias_p_lr) < IGNORE_BIAS) {
    from.rect.x = to.rect.x + to.rect.width
    from.rect.width *= (1 - bias_p_lr)
  }
  const bias_p_r = (to.rect.x + to.rect.width - from.rect.x - from.rect.width) / from.rect.width
  if (Math.abs(bias_p_r) < IGNORE_BIAS) {
    from.rect.width *= (1 + bias_p_r)
  }
  const bias_p_rl = (to.rect.x - from.rect.x - from.rect.width) / from.rect.width
  if (Math.abs(bias_p_rl) < IGNORE_BIAS) {
    from.rect.width *= (1 + bias_p_rl)
  }
  const bias_p_t = (to.rect.y - from.rect.y) / from.rect.height
  if (Math.abs(bias_p_t) < IGNORE_BIAS) {
    from.rect.y = to.rect.y
    from.rect.height *= (1 - bias_p_t)
  }
  const bias_p_tb = (to.rect.y + to.rect.height - from.rect.y) / from.rect.height
  if (Math.abs(bias_p_tb) < IGNORE_BIAS) {
    from.rect.y = to.rect.y + to.rect.height
    from.rect.height *= (1 - bias_p_tb)
  }
  const bias_p_b = (to.rect.y + to.rect.height - from.rect.y - from.rect.height) / from.rect.height
  if (Math.abs(bias_p_b) < IGNORE_BIAS) {
    from.rect.height *= (1 + bias_p_b)
  }
  const bias_p_bt = (from.rect.y + from.rect.height - to.rect.y) / from.rect.height
  if (Math.abs(bias_p_bt) < IGNORE_BIAS) {
    from.rect.height *= (1 - bias_p_bt)
  }
}

function avoidCrack(parent, node) {
  if (!parent) return

  // crack between children
  parent.children.forEach(child => child !== node && fittingRect(node, child))

  // crack between parent
  fittingRect(node, parent)
}

function renderContent(root, indent, headContent, tailCotent, parentRoot) {
  // style attributes
  let px = 0, py = 0
  if (parentRoot) {
    px = parentRoot.rect.x
    py = parentRoot.rect.y
  }

  avoidCrack(parentRoot, root)

  const attributes = ` style={{ position: 'absolute', width: ${root.rect.width}, height: ${root.rect.height}, top: ${root.rect.y - py}, left: ${root.rect.x - px}, border: '1px solid black' }} `

  // create react element 
  const indentString = ' '.repeat(indent)
  if (root.children.length === 0) {
    return headContent + `\n${indentString}<div${attributes}/>` + tailCotent
  } else {
    const childrenContent = root.children.map(v => renderContent(v, indent + 2, '', '', root)).join('')
    return headContent + `\n${indentString}<div${attributes}>` + childrenContent + `\n${indentString}</div>` + tailCotent
  }
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

  const content = renderContent(root, indent, '', '').slice(1) // remove offset \n char
  jsxFileLines[injectLineIndex] = content

  fs.writeFileSync(outputFile, jsxFileLines.join('\n'), 'utf8')
}

function transform(root, jsxFile, cssFile) {
  if (root.children.length === 1) {
    root = root.children[0]
  }

  writeJSX(jsxFile, root)
}

const JSX = transform(rectJson, jsxFile, cssFile)
