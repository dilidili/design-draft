const cv = require("opencv4nodejs");
const process = require("process");
const path = require("path");
const fs = require("fs");
const request = require("request"); 

const minArea = 50;
const RED = new cv.Vec(0, 0, 255);

// [ '/usr/local/bin/node',
//   '/Users/xumm_12/code/design-draft/server/app/scripts/extractBoundingClientRect.js',
//   'https://design-draft.oss-cn-hangzhou.aliyuncs.com/060fe401-2d85-4a05-9ee5-387745c102a5.jpeg' ]
const imageURL = process.argv[2];

// download image
request.head(imageURL, function(err, res) {
  const originalFileName = 'original' + path.extname((imageURL));

  request(imageURL).pipe(fs.createWriteStream(originalFileName).on('close', () => {
    const src = cv.imread(path.join(process.cwd(), originalFileName));
    const gray = src.cvtColor(cv.COLOR_RGBA2GRAY);
    const canny = gray.canny(0, 30);
    const dilate = canny.dilate(
      cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(20, 20))
    );

    // you can try more different parameters
    let contours = dilate.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    contours = contours.filter(v => v.area >= minArea);

    for (let i = 0; i < contours.length; i++) {
      const contour = contours[i];

      const rect = contour.boundingRect();
      src.drawRectangle(rect, RED, 2);
    }

    // output contours data to file as tree data.
    contours = contours.map(v => v.boundingRect());

    const root = {
      rect: {
        x: -Infinity,
        y: -Infinity,
        width: Infinity,
        height: Infinity,
      },
      children: [],
    }

    contours.forEach(contour => {
      addChild(root, contour);
    })

    fs.writeFileSync(path.join(process.cwd(), "boundingRect.json"), JSON.stringify(root, null, 2))

    cv.imwrite(path.join(process.cwd(), "bound_" + originalFileName), src);
  }));
})

function containRect(a, b) {
  return a.x <= b.x && a.y <= b.y && (a.x + a.width) >= (b.x + b.width) && (a.y + a.height) >= (b.y + b.height)
}

function addChild(parent, rect) {
  const containChild = parent.children.find(v => containRect(v.rect, rect))

  if (containChild) {
    addChild(containChild, rect)
  } else {
    const mergeChild = parent.children.filter(v => containRect(rect, v.rect))

    if (mergeChild.length > 0) {
      parent.children = parent.children.filter(v => !containRect(rect, v.rect))
      parent.children.push({
        rect,
        children: mergeChild,
      })
    } else {
      parent.children.push({
        rect,
        children: [],
      })
    }
  }
}
