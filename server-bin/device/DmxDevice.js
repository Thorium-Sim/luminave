'use strict';

// @TODO: Automatically import every device from the "dmx"-folder

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CameoPixBar600PRO = require('./dmx/CameoPixBar600PRO.js');

var _CameoPixBar600PRO2 = _interopRequireDefault(_CameoPixBar600PRO);

var _CameoFlat1RGBW = require('./dmx/CameoFlat1RGBW');

var _CameoFlat1RGBW2 = _interopRequireDefault(_CameoFlat1RGBW);

var _CameoWookie200RGY = require('./dmx/CameoWookie200RGY');

var _CameoWookie200RGY2 = _interopRequireDefault(_CameoWookie200RGY);

var _AdjStarburst = require('./dmx/AdjStarburst');

var _AdjStarburst2 = _interopRequireDefault(_AdjStarburst);

var _FunGenerationSeParQuadLedRgbUv = require('./dmx/FunGenerationSeParQuadLedRgbUv');

var _FunGenerationSeParQuadLedRgbUv2 = _interopRequireDefault(_FunGenerationSeParQuadLedRgbUv);

var _MiniLed = require('./dmx/MiniLed');

var _MiniLed2 = _interopRequireDefault(_MiniLed);

var _StairvilleAF = require('./dmx/StairvilleAF150');

var _StairvilleAF2 = _interopRequireDefault(_StairvilleAF);

var _EuroliteB = require('./dmx/EuroliteB100');

var _EuroliteB2 = _interopRequireDefault(_EuroliteB);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 *
 * @param {string} type - e.g. "CameoPixBar600PRO"
 * @param {string} deviceId - Unique identifier e.g. "cameopixbar600_1"
 * @param {string} name - e.g. "Cameo PixBar 600 PRO"
 * @param {number} universe - The parent universe the device is part of, e.g. 1
 * @param {number} address - Address of the device in the universe, e.g. 10
 *
 */
var DmxDevice = function () {
  function DmxDevice(param) {
    _classCallCheck(this, DmxDevice);

    this.type = param.type || undefined;
    this.deviceId = param.deviceId || undefined;
    this.name = param.name || undefined;

    // Mapping of devices
    this.deviceMapping = new Map();
    this.createMapping();

    // The mapping exists
    if (this.deviceMapping.get(this.type) !== undefined) {
      // Create the instance of one specified device
      this.instance = new (this.deviceMapping.get(this.type))(param);
    } else {
      throw new Error(this.type + ' is not defined in deviceMapping');
    }

    // Set the output
    this.instance.setOutput(param.output);

    /*
     * @TODO: Maybe extend CameoPixBar600PRO with Device and to something like Device.dmx.CameoPixBar600PRO to create a new instance
     */
  }

  /*
   * @TODO: Automatically create the mapping, maybe with eval? 😐
   */


  _createClass(DmxDevice, [{
    key: 'createMapping',
    value: function createMapping() {
      this.deviceMapping.set('CameoPixBar600PRO', _CameoPixBar600PRO2.default);
      this.deviceMapping.set('CameoFlat1RGBW', _CameoFlat1RGBW2.default);
      this.deviceMapping.set('CameoWookie200RGY', _CameoWookie200RGY2.default);
      this.deviceMapping.set('AdjStarburst', _AdjStarburst2.default);
      this.deviceMapping.set('FunGenerationSeParQuadLedRgbUv', _FunGenerationSeParQuadLedRgbUv2.default);
      this.deviceMapping.set('MiniLed', _MiniLed2.default);
      this.deviceMapping.set('StairvilleAF150', _StairvilleAF2.default);
      this.deviceMapping.set('EuroliteB100', _EuroliteB2.default);
    }
  }]);

  return DmxDevice;
}();

exports.default = DmxDevice;