class PauseReporter {
  constructor(options = {}) {
    this.delayMs = Number(options.delayMs ?? 1000);
  }

  async onTestEnd() {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
  }
}

export default PauseReporter;
