import { LitElement, html } from '@polymer/lit-element/lit-element.js'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '../../reduxStore.js'
import { setModv } from '../../actions/index.js'
import { getLive, getModvUrl, getModvConnected, getModvReconnect } from '../../selectors/index.js'
import { setModvData } from '../../utils/index.js'
import '../integration/integration-configuration.js'
import '../integration/integration-websocket.js'

/*
 * Handle the connection to modV
 *
 * Note: As of now there should only be one instance of the modvManager because the event
 * that informs other components that new data from modV arrived would be triggered multiple times. 
 */
class ModvManager extends connect(store)(LitElement) {

  static get properties() {
    return {
      live: { type: Boolean },
      connected: { type: Boolean },
      url: { type: String }
    }
  }

  constructor() {
    super()

    // State of the actual WebSocket connection (connected vs disconnected)
    this._connected = false
    // State of the actual WebSocket connection as text
    this._connectionStatus = undefined
  }

  _stateChanged(state) {
    this.live = getLive(state)
    this.url = getModvUrl(state)
    this.connected = getModvConnected(state)
    this.reconnect = getModvReconnect(state)
  }

  firstUpdated() {
    this._websocket = this.shadowRoot.querySelector('#websocket')
  }

  /**
   * Update the URL that is pointing to modV
   * 
   * @param {Object} e - The event
   */
  handleUrlChanged(e) {
    const { url } = e.detail
    store.dispatch(setModv({ url }))
  }

  /**
   * Update the flag that indicates if auto-reconnect should happen or not
   * 
   * @param {Object} e - The event
   */
  handleReconnectChanged(e) {
    const { reconnect } = e.detail
    store.dispatch(setModv({ reconnect }))
  }

  /**
   * Update the connection status (connected vs disconnected)
   * 
   * @param {Object} e - The event
   */
  handleConnection(e) {
    const { connected, connectionStatus } = e.detail
    store.dispatch(setModv({ connected }))

    this._connectionStatus = connectionStatus
    this._connected = connected
    this.requestUpdate()
  }

  /**
   * When ever a message was send from modV it should be saved into a global object
   * (because of performance issues) and other components should be informed about it
   * by triggering a global event "received-data-from-modv"
   * 
   * @param {Object} e - The event
   * @param {Object} e.detail.data - Holds all the data that was send from modV
   * @param {Array}  e.detail.data.average - Of all colors that is grabbed from Canvas we get the average
   * @param {Array}  e.detail.data.colors - The colors grabbed from specific points from the Canvas (configurable in modV)
   * @param {Number} e.detail.data.selectionX - The selected areas on x-axis
   * @param {Number} e.detail.data.selectionY - The selected areas on y-axis
   */
  handleMessage(e) {
    const { data } = e.detail

    // Save data into global object
    setModvData(JSON.parse(data))

    const now = new Date()

    // Received data from modV
    window.dispatchEvent(new CustomEvent('received-data-from-modv', { detail: { now } }))
  }

  render() {
    const { url, reconnect, _connectionStatus, _connected } = this
    const integrationName = "modV"

    return html`
      <integration-websocket
        .url="${url}"
        .reconnect="${reconnect}"
        .name="${integrationName}"

        id="websocket"

        @connection-opened="${e => this.handleConnection(e)}"
        @connection-closed="${e => this.handleConnection(e)}"
        @connection-error="${e => this.handleConnection(e)}"
        @message-received="${e => this.handleMessage(e)}"
      >
      </integration-websocket>

      <integration-configuration 
        .url="${url}"
        .reconnect="${reconnect}"
        .name="${integrationName}"
        .connectionStatus="${_connectionStatus}"
        .connected="${_connected}"
        .reconnectIntervalConfigurable="${true}"

        @url-changed="${e => this.handleUrlChanged(e)}"
        @reconnect-changed="${e => this.handleReconnectChanged(e)}"
        @open-connection="${e => this._websocket.connect()}"
        @close-connection="${e => this._websocket.disconnect()}"
      >
      </integration-configuration>
    `
  }
}

customElements.define('modv-manager', ModvManager)
