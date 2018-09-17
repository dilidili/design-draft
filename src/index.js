const cv = require("opencv4nodejs");
const process = require("process");
const path = require("path");

const minArea = 25;
const RED = new cv.Vec(0, 0, 255);

const src = cv.imread(path.join(process.cwd(), "./assets/case0.png"));
const gray = src.cvtColor(cv.COLOR_RGBA2GRAY);
const canny = gray.canny(0, 30);
const dilate = canny.dilate(
  cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3))
);

// You can try more different parameters
const contours = dilate.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
for (let i = 0; i < contours.length; i++) {
  const contour = contours[i];

  if (contour.area >= minArea) {
    const rect = contour.boundingRect()
    src.drawRectangle(rect, RED, 2)
  //   const arcLength = contour.arcLength(true);
  //   const aprox = contour.approxPolyDP(0.1, true);

  //   switch (aprox.length) {
  //     case 3:
  //       src.drawContours([contour], GREEN, { thickness: 1 });
  //       continue;
  //     case 4:
  //       src.drawContours([contour], RED, { thickness: 1 });
  //       continue;
  //     default:
  //       src.drawContours([contour], BLUE, { thickness: 1 });
  //   }
  }
}

cv.imwrite(path.join(process.cwd(), "./assets/case0_output.png"), src);
