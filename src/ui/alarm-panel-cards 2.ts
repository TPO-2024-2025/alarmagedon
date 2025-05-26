import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';

@customElement('alarm-panel-cards')
export class AlarmPanelCards extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public config!: LovelaceCardConfig;


  static styles = css`
  ha-card {
    padding: 16px;
  }
  .modes {
    display: flex;
    justify-content: space-around;
    padding-top: 16px;
  }
  .mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  .mode-circle {
    width: 80px;
    height: 80px;
    border-radius: 30%;
    background-color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--ha-card-box-shadow, 0px 1px 3px rgba(0,0,0,0.1));
  }

  

  .mode-label {
    margin-top: 8px;
    font-size: 1rem;
    color: var(--primary-text-color);
  }

  .mode-circle {
    /* default (inactive) */
    background-color: var(--card-background-color);
  }
  .mode-circle.active {
    /* when this button matches the alarm state */
    background-color: var(--primary-color);
  }
  .mode-circle ha-icon {
    /* default icon color */
    color: var(--primary-color);
  }
  .mode-circle.active ha-icon {
    /* icon color on active */
    color: var(--text-primary-on-color, white);
  }

`;



 

  setConfig(config: LovelaceCardConfig) {
    if (!config.entity) {
      throw new Error('You must define an entity');
    }
    this.config = config;
  }

  render() {
    // 1) Grab the current state
    const state = this.hass.states[this.config.entity!]?.state;
  
    // 2) Declare your modes array *here* so render() can see it
    const modes = [
      { service: 'alarm_disarm',   icon: 'mdi:shield-off-outline', label: 'Izklopi',  state: 'disarmed'   },
      { service: 'alarm_arm_home', icon: 'mdi:home-account',       label: 'Doma',     state: 'armed_home' },
      { service: 'alarm_arm_away', icon: 'mdi:walk',               label: 'Odsotni',  state: 'armed_away' },
    ];
  
    // 3) Now you can map over modes in your JSX
    return html`
      <ha-card>
        <div class="modes">
          ${modes.map(
            (m) => html`
              <div class="mode" @click=${() => this._call(m.service)}>
                <div class="mode-circle ${state === m.state ? 'active' : ''}">
                  <ha-icon icon="${m.icon}"></ha-icon>
                </div>
                <div class="mode-label">${m.label}</div>
              </div>
            `
          )}
        </div>
      </ha-card>
    `;
  }
  

  

  private _call(service: string) {
    this.hass.callService('alarm_control_panel', service, {
      entity_id: this.config.entity,
    });
  }
}
