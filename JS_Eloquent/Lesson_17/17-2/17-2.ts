// class Angles {
//   public sliceAngle: number;
//   public startAngle: number;
//   public endAngle: number;
//   public textAngle: number;
//   public x: number;
//   public y: number;
//   public padding: number = 10;
//   public textR: number = 100;
//   public result: { name: string; count: number; color: string };

//   angleInLeft = (angle: number): boolean => {
//     if (0.5 * Math.PI > angle && angle > -0.5 * Math.PI) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   setTextX = (): number => {
//     if (this.angleInLeft(this.textAngle)) {
//       return this.x + (this.textR + this.padding) * Math.cos(this.textAngle);
//     } else {
//       return (
//         this.x -
//         this.result.name.length * 5 +
//         (this.textR + this.padding) * Math.cos(this.textAngle)
//       );
//     }
//   };

//   drawArc = (r: number): void => {
//     cx.arc(this.x, this.y, r, currentAngle, this.endAngle);
//   };

//   writeText = (): void => {
//     cx.font = "10px Georgia";
//     cx.fillStyle = this.result.color;
//     cx.fillText(
//       `${this.result.name}`,
//       this.setTextX(),
//       this.y + (this.textR + this.padding) * Math.sin(this.textAngle)
//     );
//   };

//   drawPiChart = (): void => {
//     cx.beginPath();
//     this.drawArc(100);
//     this.writeText();
//     currentAngle += this.sliceAngle;
//     cx.lineTo(this.x, this.y);
//     cx.fill();
//   };

//   constructor(
//     x: number,
//     y: number,
//     count: number,
//     result: { name: string; count: number; color: string }
//   ) {
//     this.sliceAngle = (count / total) * 2 * Math.PI;
//     this.startAngle = currentAngle;
//     this.endAngle = currentAngle + this.sliceAngle;
//     this.textAngle = (2 * currentAngle + this.sliceAngle) / 2;
//     this.x = x;
//     this.y = y;
//     this.result = result;
//   }
// }

// const results: { name: string; count: number; color: string }[] = [
//   { name: "Satisfied", count: 1043, color: "lightblue" },
//   { name: "Netral", count: 563, color: "lightgreen" },
//   { name: "Unsatisfied", count: 510, color: "pink" },
//   { name: "No comment", count: 175, color: "silver" },
// ];

// let currentAngle: number = -0.5 * Math.PI;
// let total: number = results.reduce((sum, { count }) => sum + count, 0);
// let canvas = document.querySelector("canvas") as HTMLCanvasElement;
// let cx = canvas.getContext("2d");

// for (let result of results) {
//   const angles = new Angles(200, 200, result.count, result);
//   angles.drawPiChart();
// }
