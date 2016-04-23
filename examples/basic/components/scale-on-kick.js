AFRAME.registerComponent('scale-on-kick', {
  schema: {
    default: {x: 2, y: 2, z: 2},
    type: 'vec3'
  },

  init: function () {
    var el = this.el;
    var data = this.data;
    var originalScale = el.getComputedAttribute('scale');

    el.addEventListener('audio-visualizer-kick-start', function () {
      el.setAttribute('scale', data);
    });
    el.addEventListener('audio-visualizer-kick-end', function () {
      el.setAttribute('scale', originalScale);
    });
  }
});
