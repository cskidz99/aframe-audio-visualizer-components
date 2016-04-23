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
    unique: {type: 'src'},
    src: {type: 'src'}
  },

  init: function () {
    this.dancer = null;
  },

  update: function () {
    var data = this.data;
    var system = this.system;
    if (data.unique) {
      this.dancer = system.createAudio(data.src);
    } else {
      this.dancer = system.getOrCreateAudio(data.src);
    }
  }
});

/**
 * Audio Visualizer Kick component for A-Frame.
 */
AFRAME.registerComponent('audio-visualizer-kick', {
  dependencies: ['audio-visualizer'],

  schema: {
    frequency: {type: 'array', default: [0, 10]},
    threshold: {default: 0.3},
    decay: {default: 0.2}
  },

  init: function () {
    this.kick = false;
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    var self = this;

    var kickData = AFRAME.utils.extend(data, {
      onKick: function () {
        if (this.kick) { return; }  // Already kicking.
        el.emit('audio-visualizer-kick-start', data);
        self.kick = true;
      },
      offKick: function () {
        if (!this.kick) { return; }  // Already not kicking.
        el.emit('audio-visualizer-kick-end', data);
        self.kick = false;
      }
    });

    el.components['audio-visualizer'].dancer.createKick(kickData);
  }
});
