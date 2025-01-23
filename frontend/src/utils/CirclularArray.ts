export default class CircularArray {
  private array: Array<object>;
  private maxSize: number;
  private index: number;

  constructor(maxSize: number = 20) {
    this.maxSize = maxSize;
    this.array = [];
    this.index = 0;
  }

  push(item: object): void {
    if (this.array.length < this.maxSize) {
      this.array.push(item);
    } else {
      this.array[this.index] = item;
    }
    this.index = (this.index + 1) % this.maxSize;
  }

  getArray(): Array<object> {
    return this.array;
  }
}
