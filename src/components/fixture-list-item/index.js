import { LitElement, html } from '@polymer/lit-element/lit-element.js'
import { links } from '../../styles/links.js'

/*
 * A fixture list item
 */
class FixtureListItem extends LitElement {
  static get properties() {
    return { fixture: { type: Object } }
  }

  render() {
    const { fixture } = this

    return html`
      ${links}

      <div>
        <a href="/fixture/${fixture.id}">${fixture.name}</a>
      </div>
    `
  }

}

customElements.define('fixture-list-item', FixtureListItem)
