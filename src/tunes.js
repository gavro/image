import { make } from './ui';
import bgIcon from './svg/background.svg';
import borderIcon from './svg/border.svg';
import stretchedIcon from './svg/stretched.svg';
import floatToLeftIcon from './svg/arrow-left.svg';
import floatToRightIcon from './svg/arrow-right.svg';

/**
 * Working with Block Tunes
 */
export default class Tunes {
  /**
   * @param {object} tune - image tool Tunes managers
   * @param {object} tune.api - Editor API
   * @param {Function} tune.onChange - tune toggling callback
   */
  constructor({ api, onChange }) {
    this.api = api;
    this.onChange = onChange;
    this.buttons = [];
  }

  /**
   * Available Image tunes
   *
   * @returns {{name: string, icon: string, title: string}[]}
   */
  static get tunes() {
    return [
      {
        name: 'withBorder',
        icon: borderIcon,
        title: 'With border',
      },
      {
        name: 'stretched',
        icon: stretchedIcon,
        title: 'Stretch image',
      },
      {
        name: 'withBackground',
        icon: bgIcon,
        title: 'With background',
      },
      {
        name: 'floatToLeft',
        icon: floatToLeftIcon,
        title: 'Float image to left'
      },
      {
        name: 'floatToRight',
        icon: floatToRightIcon,
        title: 'Float image to right'
      },
    ];
  }

  /**
   * Can be only one tune
   */
  static get mutuallyExclusiveTunes() {
    return ['floatToLeft', 'stretched', 'floatToRight'];
  }

  /**
   * Styles
   *
   * @returns {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
   */
  get CSS() {
    return {
      wrapper: '',
      buttonBase: this.api.styles.settingsButton,
      button: 'image-tool__tune',
      buttonActive: this.api.styles.settingsButtonActive,
      inputLabel: 'image-tool__input',
      input: this.api.styles.input,
    };
  }

  /**
   * Makes buttons with tunes: add background, add border, stretch image
   *
   * @param {ImageToolData} toolData - generate Elements of tunes
   * @returns {Element}
   */
  render(toolData) {
    const wrapper = make('div', this.CSS.wrapper);

    this.buttons = [];

    Tunes.tunes.forEach(tune => {
      const title = this.api.i18n.t(tune.title);
      const el = make('div', [this.CSS.buttonBase, this.CSS.button], {
        innerHTML: tune.icon,
        title,
      });

      el.addEventListener('click', () => {
        this.tuneClicked(tune.name);
        this.checkForDeactivateAnotherTunes(tune.name);
      });

      el.dataset.tune = tune.name;
      el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);

      this.buttons.push(el);

      this.api.tooltip.onHover(el, title, {
        placement: 'top',
      });

      wrapper.appendChild(el);
    });


    // Image width attribute
    const widthInput = make('input', [this.CSS.input], {
      placeholder: 'auto',
      value: toolData.width || ''
    });
    const widthLabel = make('label', [this.CSS.buttonBase, this.CSS.inputLabel], {
      innerHTML: `Width: `,
      title: 'Image width',
    });

    widthInput.addEventListener('change', (e) => {
      // must set to a value (null, 0 or "" might not trigger a proper change; "auto" value will be cleared @ setTune)
      this.onChange('width', parseInt(e.target.value) || 'auto');
    });

    this.api.tooltip.onHover(widthLabel, 'Image width', {
      placement: 'top',
    });

    widthLabel.appendChild(widthInput);
    wrapper.appendChild(widthLabel);


    // Image height attribute
    const heightInput = make('input', [this.CSS.input], {
      placeholder: 'auto',
      value: toolData.height || ''
    });
    const heightLabel = make('label', [this.CSS.buttonBase, this.CSS.inputLabel], {
      innerHTML: `Height: `,
      title: 'Image height',
    });

    heightInput.addEventListener('change', (e) => {
      // must set to a value (null, 0 or "" might not trigger a proper change; "auto" value will be cleared @ setTune)
      this.onChange('height', parseInt(e.target.value) || 'auto');
    });

    this.api.tooltip.onHover(heightLabel, 'Image height', {
      placement: 'top',
    });

    heightLabel.appendChild(heightInput);
    wrapper.appendChild(heightLabel);

    return wrapper;
  }

  /**
   * For float and stretch we should reset active state if someone was selected
   * @param tuneName
   */
  checkForDeactivateAnotherTunes(tuneName) {
    const findedIndex = Tunes.mutuallyExclusiveTunes.indexOf(tuneName);

    if (findedIndex >= 0) {
      Tunes.mutuallyExclusiveTunes.forEach((item, index) => {
        if (findedIndex !== index) {
          this.tuneClicked(item, false);
        }
      });
    }
  }

  /**
   * Clicks to one of the tunes
   *
   * @param {string} tuneName - clicked tune name
   * @param {boolean} state - necessary state
   * @returns {void}
   */
  tuneClicked(tuneName, state) {
    const button = this.buttons.find(el => el.dataset.tune === tuneName);

    button.classList.toggle(this.CSS.buttonActive, state !== undefined ? state : !button.classList.contains(this.CSS.buttonActive));

    this.onChange(tuneName, state);
  }
}
