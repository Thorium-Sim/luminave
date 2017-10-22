import KeytimeDeluxe from './KeytimeDeluxe.js'
import { modVService } from './ModVService.js'
import Color from '/libs/fivetwelve/lib/util/Color.js'

/**
 * A list of keyframes used to light up a list of devices to create an animation.
 *
 * @param {String} animationId - Identifier
 * @param {Object} deviceManager - Reference to the DMX device manager
 * @param {Array} devices - List of DMX devices that will be used to show the keyframes of this animation
 * @param {Number} duration - How long does the animation run
 * @param {Number} start - When does the animation start in dependence of the progress of the parent Scene
 * @param {Number} speed - A factor to control the speed @TODO: USE IT!
 * @param {Array|Object} timeline - A list of keyframes
 *
 * @TODO: Relative duration: Every keyframe is relative to the animation duration
 * @TODO: Absolute duration: Every keyframe has it's own duration
 */
export default class Animation {

  constructor(param) {
    this.animationId = param.animationId
    this.deviceManager = param.deviceManager
    this.devices = param.devices || undefined
    this.duration = param.duration
    this.start = param.start || 0
    this.speed = param.speed || 1

    // Progress in terms of time
    this.progress = 0

    // Keyframes are raw
    if (param.timeline instanceof Array) {
      this.timeline = new KeytimeDeluxe(param.timeline)
      // Keyframes are an instance of keytime
    } else {
      this.timeline = param.timeline
    }

    // The values of the animation in terms of the point in time
    this.values = []

    // Is this animation running?
    this.isPlaying = false
  }

  /*
   * Run the animation for the associated devices.
   *
   * @BUG: When the animation is retriggered while it is running, the last color that was send to the device stays forever at the device.
   */
  run() {

          // Set the values for every device
          this.devices.forEach(element => {

            this.deviceManager.get(element).then(device => {

              if (this.values.hasOwnProperty('color')) {

                const normalizedColor = this.values.color.map(c => ~~(c))
                const color = new Color(normalizedColor).toString()

                device.color = color

                if (device.hasOwnProperty('led1')) {
                  device.led1.color = color
                  device.led2.color = color
                  device.led3.color = color
                  device.led4.color = color
                  device.led5.color = color
                  device.led6.color = color
                  device.led7.color = color
                  device.led8.color = color
                  device.led9.color = color
                  device.led10.color = color
                  device.led11.color = color
                  device.led12.color = color
                }

              }

              if (this.values.hasOwnProperty('uv')) {
                device.uv = this.values.uv

                if (device.hasOwnProperty('led1')) {
                  device.led1.uv = this.values.uv
                  device.led2.uv = this.values.uv
                  device.led3.uv = this.values.uv
                  device.led4.uv = this.values.uv
                  device.led5.uv = this.values.uv
                  device.led6.uv = this.values.uv
                  device.led7.uv = this.values.uv
                  device.led8.uv = this.values.uv
                  device.led9.uv = this.values.uv
                  device.led10.uv = this.values.uv
                  device.led11.uv = this.values.uv
                  device.led12.uv = this.values.uv
                }
              }

              if (this.values.hasOwnProperty('rotate')) {
                device.rotate = this.values.rotate
              }

              if (this.values.hasOwnProperty('strobe')) {
                device.strobe = this.values.strobe
              }

              if (this.values.hasOwnProperty('brightness')) {
                device.brightness = this.values.brightness
              }

              if (this.values.hasOwnProperty('pan')) {
                device.pan = this.values.pan
              }

              if (this.values.hasOwnProperty('tilt')) {
                device.tilt = this.values.tilt
              }

              if (this.values.hasOwnProperty('amount')) {
                device.amount = this.values.amount
              }

              if (this.values.hasOwnProperty('led')) {
                // @TODO: Implement
              }

              if (this.values.hasOwnProperty('motor')) {
                device.motor = this.values.motor
              }

              if (this.values.hasOwnProperty('fan')) {
                device.fan = this.values.fan
              }

              if (this.values.hasOwnProperty('gobo')) {
                device.gobo = this.values.gobo
              }

              if (this.values.hasOwnProperty('yellow')) {
                device.yellow = this.values.yellow
              }

            }, error => {
              console.log(error)
            })

          })

  }

  /*
   * Update the timeline to get the colors provided by modV
   *
   * @TODO: Check if config.global.useModV is enabled
   */
  updateTimeline() {

    // Iterate over all properties from the given timeline
    this.timeline.properties.forEach((property, index, array) => {

      // Iterate over all frames of the current keyframe for the given property
      property.keyframes.frames.forEach((frame, index, array) => {

        if (frame.hasOwnProperty('modV') && frame.modV) {
          frame.value = modVService.globalColor
        }

      })

    })

  }

  pause() {
    // @TODO: Implement
  }


  reset() {
    // @TODO: Implement
  }

  reverse() {
    // @TODO: Implement
  }
}
