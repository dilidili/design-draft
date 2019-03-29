const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const randomColor = require('randomcolor');

let boundingRect = require('../assets/boundingRect');

// find root parent.
boundingRect = boundingRect.children.find(v => v.children && v.children.length > 0);

function getCenterPoint(element) {
  const {
    rect: {
      x,
      y,
      width,
      height,
    }
  } = element;

  return [x + width / 2, y + height / 2];
}

function getFlexDirection(element) {
  const centerPointList = element.children.map(v => getCenterPoint(v))

  const diffHorizontal = centerPointList.map(v => v[0]).sort((a, b) => a - b).reduce((r, v, k, t) => {
    return r + (t[k + 1] ? t[k + 1] - v : 0);
  }, 0);
  const diffVertical = centerPointList.map(v => v[1]).sort((a, b) => a - b).reduce((r, v, k, t) => {
    return r + (t[k + 1] ? t[k + 1] - v : 0);
  }, 0);

  return diffHorizontal > diffVertical ? 'row' : 'column';
}

function computeSizeStyle(element) {
  element.style.width = element.rect.width;
  element.style.height = element.rect.height;
}

function filterNoisy(element) {
  const {
    rect: {
      width,
      height,
    }
  } = element;

  let ret = true
  ret = ret && Math.max(width, height) / Math.min(width, height) < 10  // 长宽比异常
  return ret
}

function wrapWithStyle(element, depth = 0, maxDepth) {
  element.style = element.style || { backgroundColor: randomColor() };

  // necessary style.
  element.style.display = 'flex';
  element.style.flexDirection = getFlexDirection(element);

  // size style.
  computeSizeStyle(element);

  if (!maxDepth || depth < maxDepth) {
    (element.children || []).filter(filterNoisy).forEach((child) => wrapWithStyle(child, depth + 1, maxDepth));
  } else {
    element.children = []
  }
}

function element2Code(element, indent) {
  let ret = '';
  ret += ' '.repeat(indent);
  const style = JSON.stringify(element.style);

  if (element.children && element.children.length > 0) {
    ret += `<div style={${style}}>\n`
    element.children.forEach(child => {
      ret += element2Code(child, indent + 2);
    });
    ret += `${' '.repeat(indent)}</div>\n`
  } else {
    ret += `<div style={${style}} />\n`
  }

  return ret;
}

wrapWithStyle(boundingRect, 0, 2);

// generate page file.
const pageTpl = fs.readFileSync(path.join(__dirname, './template/page.js.tpl'), 'utf-8');
const renderCode = element2Code(boundingRect, 4);
const pageContent = Mustache.render(pageTpl, {
  code: renderCode.slice(0, -1),
});
fs.writeFileSync(path.join(__dirname, '../playground/pages/test.js'), pageContent, 'utf-8');