require('./lib/dancer');

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerSystem('audio-visualizer', {
  init: function () {
    this.dancers = {};
  },

  getOrCreateAudio: function (src) {
    if (this.dancers[src]) {
      return this.dancers[src];
    }
    return this.createAudio(src);
  },

  createAudio: function (src) {
    var dancer = new Dancer();
    dancer.load({src: src});
    dancer.play();
    this.dancers[src] = dancer;
    return dancer;
  }
});

/**
 * Audio Visualizer component for A-Frame.
 */
AFRAME.registerComponent('audio-visualizer', {
  schema: {
    unique: {default: false},
    src: {type: 'src'}
  },

  init: function () {
    this.dancer = null;
  },

  update: function () {
    var data = this.data;
    var system = this.system;

    if (!data.src) { return; }

    if (data.unique) {
      this.dancer = system.createAudio(data.src);
    } else {
      this.dancer = system.getOrCreateAudio(data.src);
    }

    this.el.emit('audio-visualizer-ready', {dancer: this.dancer});
  }
});

/**
 * Audio Visualizer Kick component for A-Frame.
 */
AFRAME.registerComponent('audio-visualizer-kick', {
  dependencies: ['audio-visualizer'],

  schema: {
    frequency: {type: 'array', default: [127, 129]},
    threshold: {default: 0.00001},
    decay: {default: 0.00001}
  },

  init: function () {
    this.kick = false;
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    var self = this;

    var kickData = AFRAME.utils.extend(data, {
      onKick: function (dancer, magnitude) {
        if (self.kick) { return; }  // Already kicking.
        el.emit('audio-visualizer-kick-start', this.arguments);
        self.kick = true;
      },
      offKick: function (dancer, magnitude) {
        if (!self.kick) { return; }  // Already not kicking.
        el.emit('audio-visualizer-kick-end', this.arguments);
        self.kick = false;
      }
    });

    var dancer = this.el.components['audio-visualizer'].dancer;
    if (dancer) {
      createKick(dancer);
    } else {
      this.el.addEventListener('audio-visualizer-ready', function (evt) {
        createKick(evt.detail.dancer);
      });
    }

    function createKick (dancer) {
      var kick = dancer.createKick(kickData);
      kick.on();
    }
  }
});
