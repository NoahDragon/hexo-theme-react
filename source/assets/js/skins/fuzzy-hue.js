$(document).ready(function () {
    var Line = (function () {
        var w = $(document).width(),
            h = $(document).height(),
            c = $('<canvas>').appendTo('#hero')[0],
            ctx = c.getContext('2d'),
            fraction = 0.15,
            self = {
                size: Math.min(w, h) * fraction,
                triangles: []
            },
            generate,
            triangle;

        generate = function (old, second) {
            var t = {pos: {}, to: {}},
                n = ~~(Math.random() * 2); // negative?

            t.pos.x1 = old.pos.x2 || -self.size * 4;
            t.pos.y1 = old.pos.y2 || -self.size * 4;
            t.pos.x2 = old.pos.x3 || Math.random() * self.size + t.pos.x1 * (n && old.pos.x2 ? -1 : 1);
            t.pos.y2 = old.pos.y3 || Math.random() * self.size + t.pos.y1 * (n && old.pos.y2 ? -1 : 1);
            t.pos.x3 = Math.random() * self.size + t.pos.x2;
            t.pos.y3 = Math.random() * self.size + t.pos.y2 * (second ? -0.25 : 0.25);

            t.to.x1 = t.pos.x1;
            t.to.y1 = t.pos.y1;
            t.to.x2 = t.pos.x2;
            t.to.y2 = t.pos.y2;
            t.to.x3 = t.pos.x3;
            t.to.y3 = t.pos.y3;

            return t;
        };

        triangle = function (o) {
            ctx.beginPath();
            ctx.moveTo(o.pos.x1, o.pos.y1 + h / 2);
            ctx.lineTo(o.pos.x2, o.pos.y2 + h / 2);
            ctx.lineTo(o.pos.x3, o.pos.y3 + h / 2);
            ctx.closePath();
        };

        self.create = function () {
            var tri = generate({pos: {}, to: {}}),
                minVal = Math.max(tri.pos.x1, tri.pos.y1, tri.pos.x2, tri.pos.y2, tri.pos.x3, tri.pos.y3),
                i = 0;

            self.triangles.push(tri);
            self.hue = (Math.random() * 360).toFixed(0);
            self.backgroundHue = self.hue;

            while (minVal < Math.max(w, h) + self.size * 4) {
                var oTri = Object.create(tri);

                tri = generate(oTri, i % 2 == 0);
                minVal = Math.max(tri.pos.x1, tri.pos.y1, tri.pos.x2, tri.pos.y2, tri.pos.x3, tri.pos.y3);

                self.triangles.push(tri);
                i++;
            }

            //console.log(self);

            return self;
        };

        self.draw = function () {
            ctx.clearRect(0, 0, w, h);

            for (var i in self.triangles) {
                triangle(self.triangles[i]);
                ctx.fillStyle = 'hsla(' + self.hue / 4 + ', ' + Math.min(i * 4, 100) + '%, 50%, .5)';
                ctx.fill();
            }

            return self;
        };

        self.animate = function () {
            var max = fraction;
            setInterval(function () {
                for (var i in self.triangles) {
                    var t = self.triangles[i],
                        //now = new Date().getTime(),
                        move = (Math.random() * max);

                    if (self.hue < 0 && self.hue > 360) self.hue += 0.01;
                    else self.hue -= 0.01;

                    if (i > 0 && i < self.triangles.length) {
                        if (t.pos.x1 <= t.to.x1 + max && t.pos.x1 >= t.to.x1 - max) t.to.x1 = (Math.random() * self.size) * (~~(Math.random() * 2) ? -1 : 1) + t.pos.x1;
                        if (t.pos.y1 <= t.to.y1 + max && t.pos.y1 >= t.to.y1 - max) t.to.y1 = (Math.random() * self.size) * (~~(Math.random() * 2) ? -1 : 1) + t.pos.y1;

                        t.to.x1 = Math.min(self.size * fraction + t.pos.x1, Math.max(-self.size * fraction - t.pos.x1, t.to.x1));
                        t.to.y1 = Math.min(self.size * fraction + t.pos.y1, Math.max(-self.size * fraction - t.pos.y1, t.to.y1));

                        t.pos.x1 += move * (t.pos.x1 < t.to.x1 ? 1 : -1);
                        t.pos.y1 += move * (t.pos.y1 < t.to.y1 ? 1 : -1);

                        t.pos.x1 = Math.min(Math.max(t.pos.x1, -self.size - t.pos.x1), self.size + t.pos.x1);
                        t.pos.y1 = Math.min(Math.max(t.pos.y1, -self.size - t.pos.y1), self.size + t.pos.y1);

                        t.pos.x2 = self.triangles[i - 1].pos.x3;
                        t.pos.y2 = self.triangles[i - 1].pos.y3;
                        t.pos.x3 = self.triangles[i - 1].pos.x1;
                        t.pos.y3 = self.triangles[i - 1].pos.y1;
                    }
                }

                if (self.backgroundHue < 0 && self.backgroundHue > 360) self.backgroundHue += 0.01;
                else self.backgroundHue -= 0.01;

                self.draw();
            }, 1000 / 30);

            return self;
        };

        self.destroy = function () {
            $(c).remove();
        };

        c.width = w;
        c.height = h;

        $('body').resize(function () {
            c.width = w;
            c.height = h;

            self.create();
        });

        return self;
    });

    var line = (new Line()).create().animate();
    $(document).on('click', function () {
        line.destroy();
        line = (new Line()).create().animate();
    }).click();
});
