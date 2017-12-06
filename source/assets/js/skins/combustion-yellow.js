(function () {
    var canvas;
    var context;
    var screenWidth;
    var screenHeight;
    var doublePI = Math.PI * 2;
    var stepA = 0;
    var stepB = 0;
    var stepC = 0;
    var bgColor = '#ffd740';
    var bloom = 14;
    var drawBlur = 0.2;
    var redFactor = 69;
    var blueFactor = 97;
    var moveFactor = 0.33;
    var sun;
    var planets = [];
    var planetsAmount = 600;

    window.onload = function () {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        window.onresize = function () {
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;

            canvas.width = screenWidth;
            canvas.height = screenHeight;

            context.fillStyle = bgColor;
            context.fillRect(0, 0, screenWidth, screenHeight);

            // destroying before init {};
            planets = [];

            init();
        };

        window.onresize();

        init();

        loop();
    };

    function init () {
        sun = new Sun();

        generatePlanets();
    }

    function generatePlanets () {
        var i = 0;
        var length = planetsAmount;

        for(i; i < length; ++i) {
            var factor = i / length;
            var planet = new Planet(Math.random() * 2);
            var dist = Math.random() * 200 + 300;

            planet.position.x = Math.cos(factor * (Math.PI * 2)) * dist + screenWidth >> 1;
            planet.position.y = Math.sin(factor * (Math.PI * 2)) * dist + screenHeight >> 1;
            planet.direction.setAngle(factor * (Math.PI * 2));

            planets.push(planet);
        }
    }

    window.getAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 16.6);
        };

    function loop () {
        context.globalAlpha = drawBlur;
        context.fillStyle = bgColor;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.globalAlpha = 1;

        updatePlanets();
        updateSun();
        drawPlanets();

        stepA += 0.02;
        stepB += 0.04;
        stepC += Math.cos(stepB * 0.10) * 0.05;

        getAnimationFrame(loop);
    }

    function updateSun () {
        sun.position.x = Math.cos(stepC) * sun.distance + screenWidth >> 1;
        sun.position.y = Math.sin(stepC) * sun.distance + screenHeight >> 1;
        sun.update();
    }


    function updatePlanets () {
        var i = planets.length - 1;

        for(i; i > -1; --i) {
            var planet = planets[i];
            planet.update();
        }
    }

    function drawPlanets () {
        var i = planets.length - 1;

        for(i; i > -1; --i) {
            var planet = planets[i];


            context.fillStyle = planet.color;
            context.beginPath();
            context.arc(planet.position.x, planet.position.y, planet.radius, 0, doublePI);

            if (planet.radius < 1) {
                if (Math.random() > 0.85) context.fill();
            }
            else {
                context.fill();
            }

            context.closePath();

        }
    }

    function dotProduct (v1, v2) {
        return v1.getDx() * v2.getDx() + v1.getDy() * v2.getDy();
    }

    function Vector2 (x, y) {
        this.x = x || 1;
        this.y = y || 0;
    }

    Vector2.prototype = {
        constructor:Vector2,

        getAngle: function () {
            return Math.atan2(this.y, this.x);
        },

        setAngle: function (value) {
            var length = this.getLength();

            this.x = Math.cos(value) * length;
            this.y = Math.sin(value) * length;
        },

        getLength: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        setLength: function (value) {
            var angle = this.getAngle();

            this.x = Math.cos(angle) * value;
            this.y = Math.sin(angle) * value;
        },

        getDx: function () {
            return this.x / this.getLength();
        },

        getDy: function () {
            return this.y / this.getLength();
        },

        getLeftNormal: function () {
            return new Vector2(this.y, -this.x);
        },

        getRightNormal: function () {
            return new Vector2(-this.y, this.x);
        }
    };

    function Sun () {
        this.position = new Vector2();
        this.direction = new Vector2();
        this.radius = 40;
        this.color = '#fe5a64';
        this.distance = 700;
    }

    Sun.prototype = {
        constructor: Sun,

        update: function () {
            var vx = this.position.x - (screenWidth >> 1);
            var vy = this.position.y - (screenHeight >> 1);

            this.direction.setAngle(Math.atan2(vy, vx));
        }
    };

    function Planet (radius) {
        this.planetToSunVector = new Vector2();
        this.position = new Vector2();
        this.direction = new Vector2();
        this.radius = radius || 6;
        this.fixedRadius = radius || 6;
        this.color = 'rgb(255, 255, 255)';
        this.color = 'rgb(0, 100, 255)';
        this.distance = 200;
        this.randomAngle = Math.random() * doublePI;
    }

    Planet.prototype = {
        constructor: Planet,

        update: function () {
            var vx = this.position.x - sun.position.x;
            var vy = this.position.y - sun.position.y;
            var vec = new Vector2();
            vec.setAngle(Math.atan2(vy, vx));

            var dp = dotProduct(this.direction, vec);

            if (dp < 0) {
                var factor = map(dp, 0, -1, 0, 1);
                this.radius = easeInOutCubic(factor, 0, bloom, 1);
            }
            else {
                this.radius = this.fixedRadius;
            }

            var red = map(dp, -1, 1, redFactor, 20);
            var green = map(dp, -1, 1, Math.cos(stepB) * blueFactor, 20);

            this.color = (this.radius > 1.4) ? 'rgb(' + (red >> 0) + ', ' + (green >> 0) + ', 100)' : 'rgb(255, 255, 255)';
            this.position.x += Math.cos(stepA + this.randomAngle) * moveFactor;
            this.position.y += Math.sin(stepB + this.randomAngle) * moveFactor;
        }
    };

    function easeInOutCubic (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c /2 * t * t * t + b;
        t -= 2;
        return c / 2* (t * t * t + 2) + b;
    }

    function norm (value, min, max) {
        return (value - min) / (max - min);
    }

    function lerp (norm, min, max) {
        return (max - min) * norm + min;
    }

    function map (value, smin, smax, omin, omax) {
        return lerp(norm(value, smin, smax), omin, omax);
    }
})();
