AFRAME.registerComponent('audio-visualizer-spectrum-scale', {
  dependencies: ['audio-visualizer'],

  schema: {
    max: {default: 20},
    multiplier: {default: 100}
  },

  init: function () {
    var self = this;

    if (!this.el.components['audio-visualizer'].analyser) {
      this.el.addEventListener('audio-analyser-ready', init);
    } else {
      init();
    }

    function init () {
      self.analyser = self.el.components['audio-visualizer'].analyser;
      self.spectrum = new Uint8Array(self.analyser.frequencyBinCount);
    }
  },

  tick: function (time) {
    var children = this.el.children;
    var data = this.data;

    this.analyser.getByteFrequencyData(this.spectrum);

    for (var i = 0; i < children.length; i++) {
      children[i].setAttribute('scale', {
        x: 1,
        y: Math.min(data.max, this.spectrum[i] * data.multiplier),
        z: 1
      });
    }
  }
});
