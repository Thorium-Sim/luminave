"use strict";

var fivetwelve = require('fivetwelve/es5');

export default class FunGenerationSeParQuadLedRgbUv extends fivetwelve.DmxDevice {
  constructor(options) {
    super(Object.assign({}, options, {
      params: {
        color: new fivetwelve.param.RgbParam([1, 2, 3]),
        uv: new fivetwelve.param.RangeParam(4, { min: 0, max: 255 }),
        dimmer: new fivetwelve.param.RangeParam(5, { min: 0, max: 255 }),
        strobe: new fivetwelve.param.RangeParam(6, { min: 0, max: 255 })
      }
    }));

    this.layout = {};
    this.layout.width = 1;
    this.layout.height = 1;
  }
}