import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import ReduxMixin from '../../reduxStore.js'
import { uuid } from '../../../libs/abcq/uuid.js'
import { setChannel, addFixture, removeFixture, setChannels, sendUniverseToUsb } from '../../actions/index.js'
import DmxDevice from './DmxDevice.js'
import { DomRepeat } from '/node_modules/@polymer/polymer/lib/elements/dom-repeat.js'
import '../dmx-fixture-property/index.js'
import CameoPixBar600PRO from './dmx/CameoPixBar600PRO.js'
import { colors, batch } from '../../utils/index.js'

/*
 * A single DMX fixture with all properties
 */
class DmxFixture extends ReduxMixin(PolymerElement) {

  ready() {
    super.ready()

    // Dynamically import fixture of a specific type
    import('./dmx/' + this.type + '.js').then((module) => {

      // Create fixture
      const fixture = new module.default({
        address: this.address,
        universe: this.universe
      })

      this.fixture = fixture
      this._properties = fixture.getParamsList()
      this.offset = this.address - 1
   });
  }

  static get properties() {
    return {
      name: { type: String },
      id: { type: String },
      type: { type: String },
      address: { type: Number },
      universe: { type: Number },
      properties: {
        type: Object
        // observer: 'changedProperties'
      },
      fixtures: {
        type: Array,
        statePath: 'fixtureManager'
      },
      live: {
        type: Boolean,
        statePath: 'live'
      },
      editMode: {
        type: Boolean,
        computed: 'computeEditMode(live)'
      },
      modvManager: {
        type: Object,
        statePath: 'modvManager'
      },
      timelineManagerProgress: {
        type: Object,
        statePath: 'timelineManager.progress',
        observer: 'observeTimelineManager'
      },
    }
  }

  observeTimelineManager() {
    this.changedProperties()
  }

  computeEditMode(live) {
    return !live
  }

  changedProperties() {

    if (this.fixture === undefined) return
    if (this.properties === undefined) return



    // Iterate over all properties
    Object.entries(this.properties).map(([name, value]) => {
      if (typeof this.fixture[name] !== undefined) {


        if (name === 'color') {
          value = colors.modv.average
          this.fixture[name] = value
        } else {
          this.fixture[name] = value
        }

        // @TODO: Remove Super hack
        if (this.fixture instanceof CameoPixBar600PRO) {
          if (name === 'color') {
            this.fixture.setColor(value)
          } else if (name === 'uv') {
            this.fixture.setUv(value)
          }
        }
      }
    })
  }

  /*
   * A property gets changed on the fixture using the UI
   */
  handleChange(e) {
    const { name, value } = e.detail
    // Set the property of the fixture which will also set the values on the corresponding channels
    this.fixture[name] = value

    // Send all values of all channels to universe 0
    this.dispatch(setChannels(0, [...batch]))

    // Send the universe to the USB DMX controller
    this.dispatch(sendUniverseToUsb(new Date()))
  }

  static get template() {
    return `
      <template is="dom-if" if="[[editMode]]">

        <style>
          .grid {
            display: flex;
            flex-direction: row;
            width: 100vw;
          }

          .property {
            margin: 0 .25em;
          }
        </style>

        <div>
          <div class="grid">
            <div class="property" title="[[id]]">Name: [[name]]</div>
            <div class="property">Type: [[type]]</div>
            <div class="property">Weight: [[fixture.weight]] kg</div>
            <div class="property">Channels: [[fixture.channels]]</div>
            <div class="property">Address: [[address]] </div>
            <div class="property">Universe: [[universe]]</div>
          </div>

          <div class="grid">
            <template is="dom-repeat" items="{{_properties}}" as="property">
              <dmx-fixture-property
                on-change="handleChange"

                property="[[property]]"
                name="[[property.name]]"
                type="[[property.type]]"
                channels="[[property.channels]]"

                class="property"
              >
              </dmx-fixture-property>
            </template>
          </div>

        </div>

      </template>
    `
  }
}

customElements.define('dmx-fixture', DmxFixture)
