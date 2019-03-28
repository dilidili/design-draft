let boundingRect = require('../assets/boundingRect');

// find root parent
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

function wrapWithStyle(element) {
  element.style = element.style || {};

  // necessary style
  element.style.display = 'flex';
  element.style.flexDirection = getFlexDirection(element);
}

wrapWithStyle(boundingRect);