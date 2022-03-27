var Angles = /** @class */ (function () {
    function Angles(x, y, count, result) {
        var _this = this;
        this.padding = 10;
        this.r = 50;
        this.angleInLeft = function (angle) {
            if (0.5 * Math.PI > angle && angle > -0.5 * Math.PI) {
                return true;
            }
            else {
                return false;
            }
        };
        this.setTextX = function () {
            if (_this.angleInLeft(_this.textAngle)) {
                return _this.x + (_this.r + _this.padding) * Math.cos(_this.textAngle);
            }
            else {
                return (_this.x -
                    _this.result.name.length * 5 +
                    (_this.r + _this.padding) * Math.cos(_this.textAngle));
            }
        };
        this.drawArc = function (r) {
            cx.arc(_this.x, _this.y, r, currentAngle, _this.endAngle);
        };
        this.writeText = function () {
            cx.font = "10px Georgia";
            cx.fillStyle = _this.result.color;
            cx.fillText("".concat(_this.result.name), _this.setTextX(), _this.y + (_this.r + _this.padding) * Math.sin(_this.textAngle));
        };
        this.sliceAngle = (count / total) * 2 * Math.PI;
        this.startAngle = currentAngle;
        this.endAngle = currentAngle + this.sliceAngle;
        this.textAngle = (2 * currentAngle + this.sliceAngle) / 2;
        this.x = x;
        this.y = y;
        this.result = result;
    }
    return Angles;
}());
var results = [
    { name: "Satisfied", count: 1043, color: "lightblue" },
    { name: "Netral", count: 563, color: "lightgreen" },
    { name: "Unsatisfied", count: 510, color: "pink" },
    { name: "No comment", count: 175, color: "silver" },
];
var currentAngle = -0.5 * Math.PI;
var total = results.reduce(function (sum, _a) {
    var count = _a.count;
    return sum + count;
}, 0);
var canvas = document.querySelector("canvas");
var cx = canvas.getContext("2d");
for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
    var result = results_1[_i];
    cx.beginPath();
    var angles = new Angles(200, 200, result.count, result);
    angles.drawArc(50);
    angles.writeText();
    currentAngle += angles.sliceAngle;
    cx.lineTo(angles.x, angles.y);
    cx.fill();
}
