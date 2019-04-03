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

function isAlmostSamePoint(a, b, outside) {
  return (Math.abs(a[0] - b[0]) / outside.width) < 0.05 && (Math.abs(a[1] - b[1]) / outside.width) < 0.05;
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

function getFlexAlignItems(element) {
  const isRowDirection = element.style.flexDirection === 'row';

  const parentCenter = getCenterPoint(element);
  if (isRowDirection) {
    const error = element.children.reduce((r, v) => r + Math.abs(getCenterPoint(v)[1] - parentCenter[1]), 0)
    if (error / element.rect.height < 0.2) {
      return 'center'
    }
  } else {
    const error = element.children.reduce((r, v) => r + Math.abs(getCenterPoint(v)[0] - parentCenter[0]), 0)
    if (error / element.rect.width < 0.2) {
      return 'center'
    }
  }
}

function getFlexJustifyContent(element) {
  const parentCenter = getCenterPoint(element);
  if (element.children.length === 1) {
    const childCenter = getCenterPoint(element.children[0]);

    if (isAlmostSamePoint(parentCenter, childCenter, element.rect)) {
      return 'center'
    }
  }
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
    ret.rect.width = Math.max(child.rect.x + child.rect.width, ret.rect.width);
    ret.rect.height = Math.max(child.rect.y + child.rect.height, ret.rect.height);
  });

  ret.rect.width = ret.rect.width - ret.rect.x;
  ret.rect.height = ret.rect.height - ret.rect.y;
  return ret;
}

const REORGNAIZE_ERROR = 5;
function reorganizeChildren(element) {
  element.children = element.children || [];
  const dirtyArray = element.children.slice();

  while(dirtyArray && dirtyArray.length) {
    const current = dirtyArray.shift();
    let newNode;

    const verticalSiblings = element.children.filter(child => child !== current && Math.abs(getCenterPoint(current)[0] - getCenterPoint(child)[0]) < REORGNAIZE_ERROR);
    if (verticalSiblings && verticalSiblings.length > 0) {
      newNode = createNodeWithChildren([current, ...verticalSiblings]);
    } else {
      const horizontalSiblings = element.children.filter(child => child !== current && Math.abs(getCenterPoint(current)[1] - getCenterPoint(child)[1]) < REORGNAIZE_ERROR);

      if (horizontalSiblings && horizontalSiblings.length > 0) {
        newNode = createNodeWithChildren([current, ...horizontalSiblings]);
      }
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
  element.style.alignItems = getFlexAlignItems(element);
  element.style.justifyContent = getFlexJustifyContent(element);

  // size style.
  computeSizeStyle(element);

  if (!maxDepth || depth < maxDepth) {
    element.children = (element.children || [])
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