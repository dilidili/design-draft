class BackgroundColorDetector {
  constructor(img) {
    this.img = img;
    this.manual_count = {};
    [this.w, this.h] = img.sizes;
    this.channels = img.channels;
    this.total_pixels = this.w * this.h;
  }

  count() {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const BGR = this.img.atRaw(x, y);

        if (this.manual_count[BGR]) {
          this.manual_count[BGR] += 1
        } else {
          this.manual_count[BGR] = 1
        }
      }
    }
  }

  averageColour() {
    return this.number_counter.slice(0, 5).reduce((r, v) => {
      const bgr = v[0].split(',').map(v => parseInt(v));
      r[0] += bgr[0];
      r[1] += bgr[1];
      r[2] += bgr[2];

      return r;
    }, [0, 0, 0]).map(v => v => ~~(v / sample));
  }

  twentyMostCommon() {
    this.count();
    this.number_counter = Object.keys(this.manual_count).map(key => [key, this.manual_count[key]]).sort((a, b) => b[1] - a[1]).slice(0, 20);
  }

  detect() {
    this.twentyMostCommon();
    this.percentage_of_first = this.number_counter[0][1] / this.total_pixels;

    if (this.percentage_of_first > 0.5) {
      return this.number_counter[0][0].split(',');
    } else {
      return this.averageColour();
    }
  }
}

module.exports = BackgroundColorDetector;