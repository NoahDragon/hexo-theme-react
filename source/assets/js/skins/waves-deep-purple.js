(function () {
    var waves = new SineWaves({
        el: document.getElementById('waves'),
        speed: -8,
        width: function () {
            return $(window).width() + 200;
        },
        height: function () {
            return $(window).height();
        },
        rotate: 180,
        ease: 'SineOut',
        waveWidth: '100%',
        waves: [
            {
                timeModifier: 1,
                lineWidth: 3,
                amplitude: 50,
                wavelength: 100,
                segmentLength: 10
            },
            {
                timeModifier: 1,
                lineWidth: 2,
                amplitude: 150,
                wavelength: 100
            },
            {
                timeModifier: 1,
                lineWidth: 1,
                amplitude: -150,
                wavelength: 50,
                segmentLength: 10
            },
            {
                timeModifier: 1,
                lineWidth: .5,
                amplitude: -100,
                wavelength: 100,
                segmentLength: 30
            },
            {
                timeModifier: .75,
                lineWidth: .3,
                amplitude: -100,
                wavelength: 200,
                segmentLength: 30
            }
        ],
        initialize: function () {
        },
        resizeEvent: function () {
            var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient.addColorStop(0, 'rgba(100,255,218, .3)');
            gradient.addColorStop(.25, 'rgba(29,233,182, 1)');
            var index = -1;
            var length = this.waves.length;
            while(++index < length){
                this.waves[index].strokeStyle = gradient;
            }
            // Clean Up
            index = void 0;
            length = void 0;
            gradient = void 0;
        }
    });
})();
