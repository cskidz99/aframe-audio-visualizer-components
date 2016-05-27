if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Audio Visualizer system for A-Frame.
 */
AFRAME.registerSystem('audio-visualizer', {
  init: function () {
    this.analysers = {};
    this.context = new AudioContext();
  },

  getOrCreateAnalyser: function (data) {
    var src = data.src.getAttribute('src');
    if (this.analysers[src]) {
      return this.analysers[src];
    }
    return this.createAnalyser(data);
  },

  createAnalyser: function (data) {
    var context = this.context;
    var analysers = this.analysers;
    var analyser = context.createAnalyser();
    var audioEl = data.src;
    var src = audioEl.getAttribute('src');

    return new Promise(function (resolve) {
      audioEl.addEventListener('canplay', function () {
        var source = context.createMediaElementSource(audioEl)
        source.connect(analyser);
        analyser.connect(context.destination);
        analyser.smoothingTimeConstant = data.smoothingTimeConstant;
        analyser.fftSize = data.fftSize;

        // Store.
        analysers[src] = analyser;
        resolve(analysers[src]);
      });
    });
  }
});

/**
 * Audio Visualizer component for A-Frame.
 */
AFRAME.registerComponent('audio-visualizer', {
  schema: {
    smoothingTimeConstant: {default: 0.8},
    fftSize: {default: 2048},
    src: {type: 'selector'},
    unique: {default: false}
  },

  init: function () {
    this.analyser = null;
  },

  update: function () {
    var self = this;
    var data = this.data;
    var system = this.system;

    if (!data.src) { return; }

    if (data.unique) {
      system.createAnalyser(data).then(emit);
    } else {
      system.getOrCreateAnalyser(data).then(emit);
    }

    function emit (analyser) {
      self.analyser = analyser;
      self.el.emit('audio-analyser-ready', {analyser: analyser});
    }
  }
});
