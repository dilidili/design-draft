const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const randomColor = require('randomcolor');

let boundingRect = require('../assets/boundingRect');

// find root parent.
boundingRect = boundingRect.children.find(v => v.children && v.children.length > 0);

function getCenterPoint(element) {
  if (element._centerPoint) return element._centerPoint;

  const {
    rect: {
      x,
      y,
      width,
      height,
    }
  } = element;
  element._centerPoint = [x + width / 2, y + height / 2];

  return element._centerPoint;
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

function createNodeWithChildren(children) {
  const ret = {
    rect: {
      x: Infinity,
      y: Infinity,
      width: 0,
      height: 0,
    },
    children,
  };

  children.forEach(child => {
    ret.rect.x = Math.min(child.rect.x, ret.rect.x);
    ret.rect.y = Math.min(child.rect.y, ret.rect.y);
    ret.rect.width = Math.max(child.rect.width, ret.rect.width);
    ret.rect.height = Math.max(child.rect.height, ret.rect.height);
  });

  return ret;
}

function filterNoisy(element, parentElement) {
  const {
    rect: {
      width,
      height,
    }
  } = element;
  const {
    rect: {
      width: parentWidth,
      height: parentHeight,
    }
  } = parentElement;

  let ret = true
  ret = ret && Math.max(width, height) / Math.min(width, height) < 10; // radio abnormality.
  // ret = ret && ((width * height) / (parentWidth * parentHeight)) > 0.0006; // area abnormality.
  return ret;
}

const REORGNAIZE_ERROR = 5;
function reorganizeChildren(element) {
  element.children = element.children || [];
  const dirtyArray = element.children.slice(element.children);

  while(dirtyArray && dirtyArray.length) {
    const current = dirtyArray.shift();
    let newNode;

    const verticalSiblings = element.children.filter(child => child !== current && Math.abs(getCenterPoint(current)[0] - getCenterPoint(child)[0]) < REORGNAIZE_ERROR);
    if (verticalSiblings && verticalSiblings.length > 0) {
      newNode = createNodeWithChildren([current, ...verticalSiblings]);
    } else {
      const horizontalSiblings = element.children.filter(child => child !== current && Math.abs(getCenterPoint(current)[1] - getCenterPoint(child)[1]) < REORGNAIZE_ERROR);
      newNode = createNodeWithChildren([current, ...horizontalSiblings]);
    }

    if (newNode) {
      element.children = element.children.filter(v => !newNode.children.find(w => w === v));
      element.children.push(newNode);
    }
  }
}

function wrapWithStyle(element, depth = 0, maxDepth) {
  // reorganize children.
  reorganizeChildren(element);

  element.style = element.style || { backgroundColor: randomColor() };

  // necessary style.
  element.style.display = 'flex';
  element.style.flexDirection = getFlexDirection(element);

  // size style.
  computeSizeStyle(element);

  if (!maxDepth || depth < maxDepth) {
    element.children = (element.children || []).filter(child => filterNoisy(child, element))
    element.children.forEach((child) => wrapWithStyle(child, depth + 1, maxDepth));
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