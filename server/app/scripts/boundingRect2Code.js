const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const cv = require("opencv4nodejs");
const BackgroundColorDetector = require('./backgroundColorDetector');

let boundingRect = require(path.join(process.cwd(), './boundingRect.json'));
// find root parent.
boundingRect = boundingRect.children.find(v => v.children && v.children.length > 0) || boundingRect.children[0];

const srcImage = cv.imread(path.join(process.cwd(), "./original.png"));
let cropIndex = 0;

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

// return flex direction and resort element.
function getFlexDirection(element) {
  const centerPointList = element.children.map(v => getCenterPoint(v))

  const diffHorizontal = centerPointList.map(v => v[0]).sort((a, b) => a - b).reduce((r, v, k, t) => {
    return r + (t[k + 1] ? t[k + 1] - v : 0);
  }, 0);
  const diffVertical = centerPointList.map(v => v[1]).sort((a, b) => a - b).reduce((r, v, k, t) => {
    return r + (t[k + 1] ? t[k + 1] - v : 0);
  }, 0);

  if (diffHorizontal > diffVertical) {
    element.children.sort((a, b) => a.rect.x - b.rect.x);
    return 'row';
  } else {
    element.children.sort((a, b) => a.rect.y - b.rect.y);
    return 'column';
  }
}

const FLEX_ALIGN_ITEM_THRES = 0.03
function getFlexAlignItems(element) {
  const isRowDirection = element.style.flexDirection === 'row';

  const retBucket = [0, 0, 0]; // flex-start | center | flex-end

  if (isRowDirection) {
    element.children.forEach(child => {
      if (Math.abs((child.rect.y - element.rect.y) - (element.rect.y + element.rect.height - child.rect.y - child.rect.height)) / element.rect.height < FLEX_ALIGN_ITEM_THRES) {
        retBucket[1] += 1;
      } else if (Math.abs(child.rect.y - element.rect.y) / element.rect.height < FLEX_ALIGN_ITEM_THRES) {
        retBucket[0] += 1;
      } else if (Math.abs(child.rect.y + child.rect.height - element.rect.y - element.rect.height) / element.rect.height < FLEX_ALIGN_ITEM_THRES) {
        retBucket[2] += 1;
      } else {
        retBucket[0] += 1;
      }
    })
  } else {
    element.children.forEach(child => {
      if (Math.abs((child.rect.x - element.rect.x) - (element.rect.x + element.rect.width - child.rect.x - child.rect.width)) / element.rect.width < FLEX_ALIGN_ITEM_THRES) {
        retBucket[1] += 1;
      } else if (Math.abs(child.rect.x - element.rect.x) / element.rect.width < FLEX_ALIGN_ITEM_THRES) {
        retBucket[0] += 1;
      } else if (Math.abs(child.rect.x + child.rect.width - element.rect.x - element.rect.width) / element.rect.width < FLEX_ALIGN_ITEM_THRES) {
        retBucket[2] += 1;
      } else {
        retBucket[0] += 1;
      }
    })
  }

  return ['flex-start', 'center', 'flex-end'][retBucket.indexOf(Math.max(...retBucket))];
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

function getMargin(element) {
  const parentElement = element._parent;
  if (!parentElement) return null

  const {
    style: {
      flexDirection,
      alignItems,
      justifyContent,
    }
  } = parentElement;

  const margins = [0, 0, 0, 0];

  if (flexDirection === 'column') {
    if (alignItems === 'center' && (!justifyContent || justifyContent === 'flex-start')) {
      if (parentElement.children[0] === element) {
        margins[0] = element.rect.y - parentElement.rect.y;
      } else {
        const siblingElement = parentElement.children[parentElement.children.indexOf(element) - 1];
        margins[0] = element.rect.y - siblingElement.rect.y - siblingElement.rect.height;
      }

      const xOffset = getCenterPoint(element)[0] - getCenterPoint(parentElement)[0];
      if (Math.abs(xOffset) / element.rect.width > 0.1) {
        element.style.alignSelf = 'flex-start';
        margins[3] = Math.abs(element.rect.x - parentElement.rect.x);
      }
    }
  } else if (flexDirection === 'row') {
    if (!justifyContent || justifyContent === 'flex-start') {
      const previousElement = parentElement.children[parentElement.children.indexOf(element) - 1];

      // margin left.
      if (previousElement) {
        margins[3] = element.rect.x - previousElement.rect.x - previousElement.rect.width;
      }
    }
  }

  return margins.map(v => v + 'px').join(' ');
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
  let dirtyArray = element.children.slice();

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

    if (newNode && newNode.children.length < element.children.length) {
      element.children = element.children.filter(v => !newNode.children.find(w => w === v));
      dirtyArray = dirtyArray.filter(v => !newNode.children.find(w => w === v));
      element.children.push(newNode);
    }
  }
}

function wrapWithStyle(element, depth = 1, maxDepth) {
  element.style = element.style || {};

  // reorganize children.
  reorganizeChildren(element);

  // necessary style.
  element.style.display = 'flex';
  element.style.flexDirection = getFlexDirection(element);
  element.style.alignItems = getFlexAlignItems(element);
  element.style.justifyContent = getFlexJustifyContent(element);
  element.style.margin = getMargin(element);

  // size style.
  computeSizeStyle(element);

  if (!maxDepth || depth < maxDepth) {
    element.children = (element.children || [])
    element.children.forEach((child) => {
      child._parent = element;
      wrapWithStyle(child, depth + 1, maxDepth);
    });
  } else {
    element.children = []
  }

  // crop corresponding area image.
  const cropImage = srcImage.getRegion(new cv.Rect(element.rect.x, element.rect.y, element.rect.width, element.rect.height));
  const cropId = `crop_image_${cropIndex++}.jpeg`;
  const backgroundColor = new BackgroundColorDetector(cropImage).detect();
  element.style.background = `rgb(${backgroundColor[2]}, ${backgroundColor[1]}, ${backgroundColor[0]})`;

  const regionDir = path.join(process.cwd(), 'region');
  if (!fs.existsSync(regionDir)) {
    fs.mkdirSync(regionDir);
  }
  cv.imwrite(path.join(regionDir, cropId), cropImage);
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

wrapWithStyle(boundingRect, 0, 4);

// generate page file.
const pageTpl = fs.readFileSync(path.join(__dirname, './template/page.js.tpl'), 'utf-8');
const renderCode = element2Code(boundingRect, 4);
const pageContent = Mustache.render(pageTpl, {
  code: renderCode.slice(0, -1),
});
fs.writeFileSync(path.join(process.cwd(), 'output.js'), pageContent, 'utf-8');