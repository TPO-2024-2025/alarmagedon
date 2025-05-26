import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';

@customElement('alarm-panel-cards')
export class AlarmPanelCards extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() public config!: LovelaceCardConfig;
  @state() private code = '';
  private _timer?: number;

  static styles = css`
    ha-card { padding: 16px; }
    .state-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 2rem;                      /* 32px high, same as core */
      padding: 0 0.75rem;                /* horizontal padding */
      border-radius: 1rem;               /* pill shape */
      background: var(--label-badge-yellow);
      color: var(--text-primary-on-color); /* white-on-color */
      font-weight: 500;
      font-size: 0.875rem;               /* 14px */
      text-transform: capitalize;        /* “Armed Away” */
    }
    .state-pill ha-icon {
      width: 1.25rem;  /* 20px */
      height: 1.25rem;
      color: var(--text-primary-on-color);
    }
    
    .mode-circle {
      width: 80px; height: 80px; border-radius: 50%;
      background-color: var(--card-background-color);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--ha-card-box-shadow, 0px 1px 3px rgba(0,0,0,0.1));
      transition: background-color 0.2s;
    }
    .mode-circle.active { background-color: var(--primary-color); }
    .mode-circle ha-icon {
      font-size: 36px; color: var(--primary-color);
    }
    .mode-circle.active ha-icon {
      color: var(--text-primary-on-color, white);
    }
    .mode-label {
      margin-top: 8px; font-size: 1rem;
      color: var(--primary-text-color); text-align: center; width: 100%;
    }
    .code-entry {
      display: flex; align-items: center; gap: 8px;
      margin-top: 16px; justify-content: center;
    }
    .code-entry input {
      padding: 8px; font-size: 1rem; width: 80px;
      text-align: center; border: 1px solid var(--divider-color);
      border-radius: 4px;
    }
  `;

  setConfig(config: LovelaceCardConfig) {
    if (!config.entity) throw new Error('You must define an entity');
    this.config = config;
  }

  firstUpdated() {
    // Only start ticking once we actually enter 'pending'
    this._timer = window.setInterval(() => {
      const s = this.hass.states[this.config.entity!].state;
      if (s === 'pending') {
        this.requestUpdate();
      } else {
        clearInterval(this._timer);
      }
    }, 1000);
  }

  render() {
    const stateObj = this.hass.states[this.config.entity!];
    const state = stateObj.state!;

    // Only compute countdown if we're pending
    let mm = 0, ss = '00';
    if (state === 'pending') {
      const armingTime = (stateObj.attributes.arming_time as number) || 0;
      const elapsed    = Date.now() - new Date(stateObj.last_changed!).getTime();
      const rem        = Math.max(0, Math.ceil((armingTime * 1000 - elapsed) / 1000));
      mm = Math.floor(rem / 60);
      ss = String(rem % 60).padStart(2, '0');
    }

    const info = {
      disarmed:   { icon: 'mdi:shield-off-outline', label: 'Disarmed',   color: 'var(--label-badge-yellow)' },
      armed_home: { icon: 'mdi:home-account',       label: 'Armed Home', color: 'var(--label-badge-green)'  },
      armed_away: { icon: 'mdi:walk',               label: 'Armed Away', color: 'var(--label-badge-green)'  },
      triggered:  { icon: 'mdi:bell-alert',         label: 'Alarm!',     color: 'var(--error-color)'        },
      pending:    { icon: 'mdi:timer-sand',         label: 'Pending',    color: 'var(--label-badge-yellow)' },
    }[state] || { icon: 'mdi:help-circle', label: state, color: 'var(--disabled-text-color)' };
    

    const modes = [
      { service: 'alarm_disarm',   icon: 'mdi:shield-off-outline', label: 'Disarm', state: 'disarmed'   },
      { service: 'alarm_arm_home', icon: 'mdi:home-account',       label: 'Home',   state: 'armed_home' },
      { service: 'alarm_arm_away', icon: 'mdi:walk',               label: 'Away',   state: 'armed_away' },
    ];

    return html`
      <ha-card>
        <div class="state-pill" style="background-color: ${info.color}">
          <ha-icon icon="${info.icon}"></ha-icon>
          <span>${info.label}</span>
        </div>
        <div class="modes">
          ${modes.map(m => html`
            <div class="mode" @click=${() => this._modeClick(m, state)}>
              <div class="mode-circle ${state === m.state ? 'active' : ''}">
                <ha-icon icon="${m.icon}"></ha-icon>
              </div>
              <div class="mode-label">${m.label}</div>
            </div>
          `)}
        </div>
        ${state === 'triggered' ? html`
          <div class="code-entry">
            <input
              type="password"
              .value=${this.code}
              @input=${(e: any) => (this.code = e.target.value)}
              placeholder="PIN"
            />
            <mwc-button @click=${this._confirmDisarm} ?disabled=${!this.code}>
              Potrdi
            </mwc-button>
          </div>
        `: nothing}
      </ha-card>
    `;
  }

  private _modeClick(m: { service: string; state: string }, currentState: string) {
    if (m.service === 'alarm_disarm' && currentState === 'triggered') return;
    this._callService(m.service);
  }

  private _confirmDisarm() {
    this._callService('alarm_disarm', this.code);
    this.code = '';
  }

  private _callService(service: string, code?: string) {
    const data: any = { entity_id: this.config.entity };
    if (code) data.code = code;
    this.hass.callService('alarm_control_panel', service, data);
  }
}
