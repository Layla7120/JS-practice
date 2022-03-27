function piChart(
  results: { name: string; count: number; color: string }[]
): void {
  //보호된 변화할 수 있는 현재각
  class CurrentAngle {
    private currentAngle: number;
    getCurrentAngle = (): number => {
      return this.currentAngle;
    };
    setCurrentAngle = (sliceAngle: number) => {
      this.currentAngle += sliceAngle;
    };
    constructor(currentAngle: number) {
      this.currentAngle = currentAngle;
    }
  }

  let total: number = results.reduce((sum, { count }) => sum + count, 0);
  let canvas = document.querySelector("canvas") as HTMLCanvasElement;
  let cx = canvas.getContext("2d");

  const x: number = 200,
    y: number = 200,
    padding: number = 10,
    r: number = 100;

  //한 result에 따른 한 조각 만들기
  //한 조각과 관련된 각도들 모음
  class PiPartAngles {
    public sliceAngle: number;
    public endAngle: number;
    public textAngle: number;
    public startAngle: number;
    constructor(count: number, startAngle: number) {
      this.startAngle = startAngle;
      this.sliceAngle = (count / total) * 2 * Math.PI;
      this.endAngle = startAngle + this.sliceAngle;
      this.textAngle = (2 * startAngle + this.sliceAngle) / 2;
    }
  }
  //2,3사분면 각인지 확인
  const angleInLeft = (angle: number): boolean => {
    if (0.5 * Math.PI > angle && angle > -0.5 * Math.PI) {
      return true;
    } else {
      return false;
    }
  };
  //한 조각 그리는 함수
  const drawPartPiChart = (
    result: {
      name: string;
      count: number;
      color: string;
    },
    piPartAngles: PiPartAngles
  ): void => {
    //2, 3사분면이면 글자 수만큼 왼쪽으로 이동해야 함 - (안그러면 가려짐)
    const setTextX = (name: string, textAngle: number): number => {
      if (angleInLeft(textAngle)) {
        return x + (r + padding) * Math.cos(textAngle);
      } else {
        return x - name.length * 5 + (r + padding) * Math.cos(textAngle);
      }
    };

    const writeText = (textAngle: number): void => {
      cx.font = "10px Georgia";
      cx.fillStyle = result.color;
      cx.fillText(
        `${result.name}`,
        setTextX(result.name, textAngle),
        y + (r + padding) * Math.sin(textAngle)
      );
    };
    //한 조각 그리기
    cx.beginPath();
    cx.arc(x, y, r, piPartAngles.startAngle, piPartAngles.endAngle);
    writeText(piPartAngles.textAngle);
    cx.lineTo(x, y);
    cx.fill();
  };

  const startAngle = new CurrentAngle(-0.5 * Math.PI);
  for (let result of results) {
    const piPartAngles = new PiPartAngles(
      result.count,
      startAngle.getCurrentAngle()
    );
    drawPartPiChart(result, piPartAngles);
    startAngle.setCurrentAngle(piPartAngles.sliceAngle);
  }
}

const results: { name: string; count: number; color: string }[] = [
  { name: "Satisfied", count: 1043, color: "lightblue" },
  { name: "Netral", count: 563, color: "lightgreen" },
  { name: "Unsatisfied", count: 510, color: "pink" },
  { name: "No comment", count: 175, color: "silver" },
];

piChart(results);
