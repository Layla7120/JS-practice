function cutBar(numOfWorker, barLength) {
  class Bar {
    static create(length) {
      return new Bar(length);
    }
    get currentBars() {
      return this.bars;
    }
    increaseBars(worker) {
      this.bars = worker(this.currentBars);
      return this;
    }
    constructor(limit) {
      this.bars = 1;
      this.limit = limit;
    }
  }
  const makeWorker = numOfWorker => {
    const cutter = (aBar = new Bar(), tries = 0) => {
      if (aBar.currentBars >= aBar.limit) return Promise.resolve(tries);
      if (numOfWorker >= aBar.currentBars) {
        return Promise.resolve(tries)
          .then(tries => {
            aBar.increaseBars(num => 2 * num);
            return tries + 1;
          })
          .then(tries => cutter(aBar, tries));
      } else {
        return Promise.resolve(tries)
          .then(tries => {
            aBar.increaseBars(num => numOfWorker + num);
            return tries + 1;
          })
          .then(tries => cutter(aBar, tries));
      }
    };
    return cutter;
  };
  const workers = makeWorker(numOfWorker);
  const bar = Bar.create(barLength);
  return workers(bar);
}

function runQ04() {
  cutBar(3, 20).then(tries => console.log(tries));
  cutBar(8, 1000000).then(tries => console.log(tries));
}

runQ04();
