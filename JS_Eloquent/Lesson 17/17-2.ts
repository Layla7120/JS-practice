const results: { name: string; count: number; color: string }[] = [
  { name: "Satisfied", count: 1043, color: "lightblue" },
  { name: "Netral", count: 563, color: "lightgreen" },
  { name: "Unsatisfied", count: 510, color: "pink" },
  { name: "No comment", count: 175, color: "silver" },
];
const drawPiChart = (
  x: number,
  y: number,
  r: number,
  results: { name: string; count: number; color: string }[]
): void => {
  let cx = document.querySelector("canvas").getContext("2d");
  let total: number = results.reduce((sum, { count }) => sum + count, 0);
  cx.font = "10px Georgia";
  let currentAngle: number = -0.5 * Math.PI;

  class Angles {
    public sliceAngle: number;
    public startAngle: number;
    public endAngle: number;
    public textAngle: number;
    public x: number;
    public y: number;

    static angleInLeft = (angle: number): boolean => {
      if (0.5 * Math.PI > angle && angle > -0.5 * Math.PI) {
        return true;
      } else {
        return false;
      }
    };
    setTextX = (
      x: number,
      y: number,
      textAngle: number,
      Bool: boolean
    ): number => {
      if (true) {
        return;
      }
    };
    constructor(x: number, y: number, count: number, currentAngle: number) {
      this.sliceAngle = (count / total) * 2 * Math.PI;
      this.startAngle = currentAngle;
      this.endAngle = currentAngle + this.sliceAngle;
      this.textAngle = (2 * currentAngle + this.sliceAngle) / 2;
      this.x = x;
      this.y = y;
    }
  }

  for (let result of results) {
    cx.beginPath();
    cx.arc(x, y, r, currentAngle, currentAngle + sliceAngle);
    cx.fillStyle = result.color;
    if (0.5 * Math.PI > textAngle && textAngle > -0.5 * Math.PI) {
      textX = x + (r + 10) * Math.cos(textAngle);
    } else {
      textX = x - result.name.length * 5 + (r + 10) * Math.cos(textAngle);
    }
    cx.fillText(`${result.name}`, textX, y + (r + 10) * Math.sin(textAngle));
    currentAngle += sliceAngle;
    cx.lineTo(x, y);
    cx.fillStyle = result.color;
    cx.fill();
  }
};
drawPiChart(200, 200, 100, results);
