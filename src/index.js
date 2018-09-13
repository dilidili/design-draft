const cv = require('opencv4nodejs');
const process = require('process')
const path = require('path')

let src = cv.imread(path.join(process.cwd(), './assets/case0.png'));
src.cvtColor(cv.COLOR_RGB2GRAY);

// You can try more different parameters
let dst = src.canny(50, 100, 3, false);
cv.imwrite(path.join(process.cwd(), './assets/case0_output.png'), dst);