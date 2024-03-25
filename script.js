$(document).ready(function() {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            var microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 2048;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Float32Array(bufferLength);
            var lastAverage = 50;
            var blowing = false; // Флаг, що вказує на дутье
            var threshold = 100; // Поріг інтенсивності звуку для задування свічок
            var threshold2 = 60; // Додатковий поріг інтенсивності звуку для качання свічок
            var threshold3 = 40; // Поріг інтенсивності звуку для остаточного задування свічок
            var deltaThreshold = 10; // Поріг зміни інтенсивності

            // Додамо панель відображення
            var intensityPanel = document.createElement('div');
            intensityPanel.innerHTML = 'Intensity: 0';
            intensityPanel.style.position = 'fixed';
            intensityPanel.style.top = '10px';
            intensityPanel.style.left = '10px';
            document.body.appendChild(intensityPanel);

            function detectBlow() {
                analyser.getFloatFrequencyData(dataArray);
                var total = 0;
                for (var i = 0; i < bufferLength; i++) {
                    total += Math.abs(dataArray[i]);
                }
                var average = total / bufferLength;

                // Відображення інтенсивності
                intensityPanel.innerHTML = 'Intensity: ' + average.toFixed(2);

                // Перевіряємо, чи інтенсивність звуку вище порогу і чи це може вказувати на початок дутья
                if (average < threshold && !blowing) {
                    blowing = true;
                    // Додаткова логіка, щоб реагувати на початок дутья
                    blowCandles();
                } else if (average >= threshold && average < threshold3 && blowing) {
                    // Додаткова логіка, щоб реагувати на качання свічок
                    $(".flame").css({animation: 'sway 0.5s ease infinite alternate'});
                    $(".flame2").css({animation: 'sway 0.5s ease infinite alternate'});
                    $(".flame3").css({animation: 'sway 0.5s ease infinite alternate'});
                } else if (average >= threshold3 && blowing) {
                    blowing = false;
                    // Додаткова логіка, щоб реагувати на остаточне задування свічок
                    blowCandles();
                } else {
                    // Якщо інтенсивність звуку вище порогу, припиняємо анімацію виляння
                    $(".flame").css({animation: 'none'});
                    $(".flame2").css({animation: 'none'});
                    $(".flame3").css({animation: 'none'});

                }

                // Перевіряємо зміну інтенсивності
                if (Math.abs(average - lastAverage) > deltaThreshold) {
                    lastAverage = average;
                }
                requestAnimationFrame(detectBlow);
            }

            detectBlow();
        })
        .catch(function(err) {
            console.error('Та дай ти доступ до мікрофона: ' + err);
        });

    
function blowCandles() {
        $(".text").animate({"top": -180, "opacity": 1}, 60);
    $(".flame2").animate({"opacity": 0}, 300, function() {
        $(this).css({transform: 'scale(0.5) rotate(-45deg)'});
    });
    $(".flame3").animate({"opacity": 0}, 300, function() {
        $(this).css({transform: 'scale(0.5) rotate(-45deg)'});
    });
    $(".flame").animate({"opacity": 0}, 300, function() {
        $(this).css({transform: 'scale(2) rotate(-45deg)'});
      });
}



});







function animateConfetti() {
    var COLORS, Confetti, NUM_CONFETTI, PI_2, canvas, confetti, context, drawCircle, drawCircle2, drawCircle3, i, range, xpos;
    NUM_CONFETTI = 100;
    COLORS = [
        [235, 90, 70],
        [97, 189, 79],
        [242, 214, 0],
        [0, 121, 191],
        [195, 119, 224]
    ];
    PI_2 = 2 * Math.PI;
    canvas = document.getElementById("confeti");
    context = canvas.getContext("2d");
    window.w = 0;
    window.h = 0;
    window.resizeWindow = function() {
        window.w = canvas.width = window.innerWidth;
        window.h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeWindow, false);
    window.onload = function() {
        setTimeout(resizeWindow, 0);
    };
    range = function(a, b) {
        return (b - a) * Math.random() + a;
    };
    drawCircle = function(a, b, c, d) {
        context.beginPath();
        context.moveTo(a, b);
        context.bezierCurveTo(a - 17, b + 14, a + 13, b + 5, a - 5, b + 22);
        context.lineWidth = 2;
        context.strokeStyle = d;
        context.stroke();
    };
    drawCircle2 = function(a, b, c, d) {
        context.beginPath();
        context.moveTo(a, b);
        context.lineTo(a + 6, b + 9);
        context.lineTo(a + 12, b);
        context.lineTo(a + 6, b - 9);
        context.closePath();
        context.fillStyle = d;
        context.fill();
    };
    drawCircle3 = function(a, b, c, d) {
        context.beginPath();
        context.moveTo(a, b);
        context.lineTo(a + 5, b + 5);
        context.lineTo(a + 10, b);
        context.lineTo(a + 5, b - 5);
        context.closePath();
        context.fillStyle = d;
        context.fill();
    };
    xpos = 0.9;
    document.onmousemove = function(a) {
        xpos = a.pageX / window.w;
    };
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
        window.setTimeout(a, 5);
    };
    Confetti = function() {
        function a() {
            this.style = COLORS[Math.floor(range(0, 5))];
            this.rgb = "rgba(" + this.style[0] + "," + this.style[1] + "," + this.style[2];
            this.r = Math.floor(range(2, 6));
            this.r2 = 2 * this.r;
            this.replace();
        }
        a.prototype.replace = function() {
            this.opacity = 0;
            this.dop = 0.04 * range(1, 4);
            this.x = range(-this.r2, window.w - this.r2);
            this.y = range(-20, window.h - this.r2);
            this.xmax = window.w - this.r;
            this.ymax = window.h - this.r;
            this.vx = range(-2, 2) + 8 * xpos - 5;
            this.vy = 1.5 * this.r + range(-1, 1);
        };
        a.prototype.draw = function() {
            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.dop;
            if (this.opacity > 1) {
                this.opacity = 1;
                this.dop *= -1;
            }
            if (this.opacity < 0 || this.y > this.ymax) {
                this.replace();
            }
            if (this.x < 0 || this.x > this.xmax) {
                this.x = (this.x + this.xmax) % this.xmax;
            }
            drawCircle(Math.round(this.x), Math.round(this.y), this.r, this.rgb + "," + this.opacity + ")");
            drawCircle3(Math.round(0.5 * this.x), Math.round(this.y), this.r, this.rgb + "," + this.opacity + ")");
            drawCircle2(Math.round(1.5 * this.x), Math.round(1.5 * this.y), this.r, this.rgb + "," + this.opacity + ")");
        };
        return a;
    }();
    confetti = Array.from({
        length: NUM_CONFETTI
    }, function() {
        return new Confetti();
    });
    window.step = function() {
        requestAnimationFrame(step);
        context.clearRect(0, 0, window.w, window.h);
        for (var a = 0; a < confetti.length; a++) {
            confetti[a].draw();
        }
    };
    window.addEventListener("resize", function() {
        window.w = canvas.width = window.innerWidth;
        window.h = canvas.height = window.innerHeight;
    });
    step();
canvas.width = 10000;
canvas.height = 10000;
canvas.tabindex = 0;
canvas.setAttribute('style', "position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 2px solid blue");

var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
document.addEventListener('keydown', doKeyDown, true);
}

animateConfetti();





const container = document.querySelector('.container');

function createBalloon() {
  const balloon = document.createElement('div');
  balloon.classList.add('balloon');
  balloon.style.left = `${Math.random() * window.innerWidth}px`;
  container.appendChild(balloon);
}

let balloonCount = 0;
const maxBalloons = 100;

function spawnBalloons() {
  if (balloonCount < maxBalloons) {
    createBalloon();
    balloonCount++;
  } else {
    clearInterval(balloonInterval);
  }
}

const balloonInterval = setInterval(spawnBalloons, 1000);

