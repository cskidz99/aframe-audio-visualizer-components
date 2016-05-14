AFRAME.registerComponent('audio-visualizer-spectrum-scale', {
  dependencies: ['audio-visualizer'],

  schema: {
    max: {default: 20},
    multiplier: {default: 100}
  },

  init: function () {
    this.dancer = this.el.components['audio-visualizer'].dancer;
  },

  tick: function () {
    var children = this.el.children;
    var data = this.data;
    var spectrum = this.dancer.getSpectrum();

    for (var i = 0; i < children.length; i++) {
      children[i].setAttribute('scale', {
        x: 1,
        y: Math.min(data.max, spectrum[i] * data.multiplier),
        z: 1
      });
    }
  }
});
