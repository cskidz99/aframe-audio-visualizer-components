AFRAME.registerComponent('audio-visualizer-spectrum-scale', {
  dependencies: ['audio-visualizer'],

  schema: {
    delay: {default: 10},
    max: {default: 20},
    multiplier: {default: 100}
  },

  init: function () {
    this.dancer = this.el.components['audio-visualizer'].dancer;
  },

  tick: function (time) {
    var data = this.data;
    if (time - this.time < data.delay) { return; }
    this.time = time;

    var children = this.el.children;
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
