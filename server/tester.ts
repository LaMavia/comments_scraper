import axios from 'axios';
import * as fs from 'fs-extra';
import * as path from 'path';

interface Log {
  [key: string]: number;
}

class Logger {
  readonly url: string;
  readonly method: string;
  readonly outputDir: string;
  readonly variablesToLog: string[];
  readonly iterations: number;
  readonly logTime: boolean;
  log: Log[];
  timer: Date;

  constructor(
    url: string,
    method: string,
    outputDir: string,
    variablesToLog: string[],
    iterations: number,
    logTime: boolean,
  ) {
    this.url = url;
    this.method = method;
    this.outputDir = outputDir;
    this.variablesToLog = variablesToLog;
    this.iterations = iterations;
    this.logTime = logTime;

    this.timer = new Date();

    this.log = [];
  }

  async request() {
    return await axios({
      url: this.url,
      method: this.method,
    })
      .then(res => res.data)
      .catch(err => {
        console.error(err);
        return {};
      });
  }

  async loop(n: number): Promise<Log[]> {
    if (n >= this.iterations) {
      console.log('Finished');
      // @ts-ignore
      return new Promise(res => res(this.log));
    }
    this.timer = new Date();
    const vars = await this.request()
      .then(res =>
        this.variablesToLog.reduce(
          (acc, v, i) => Object.assign(acc, { [v]: res[v] }),
          // @ts-ignore
          {dt: new Date() - this.timer},
        ),
      )
    if (Object.keys(vars).length > 1) {
      this.log.push(vars);
    }
    console.log(
      `
    Iteration: ${n}
    Values: ${JSON.stringify(vars)}
    `,
    );
    return this.loop(n + 1);
  }

  start() {
    this.loop(0).then(logs => {
      const emptyLog = this.variablesToLog.reduce(
        (acc, v) => Object.assign(acc, { [v]: [] }),
        {dt: []},
      );
      const sumLog = logs.reduce((acc, log) => {
        Object.keys(acc).forEach(key => {
          // @ts-ignore
          acc[key].push(+(log[key]));
        });
        return acc;
      }, emptyLog);
      for (const key in sumLog) {
        sumLog[key] = sumLog[key].reduce((sum, n) => sum += n, 0) / logs.length
      }
      const toSave = {
        logs,
        avg: sumLog,
      };
      fs.writeJson(
        path.resolve(
          __dirname,
          this.outputDir,
          `${new Date().toDateString()}.json`,
        ),
        toSave,
        { spaces: 2, encoding: 'utf8' },
      );
    });
  }
}

(() => {
  const myLogger = new Logger(
    'http://localhost:8000/reader/comments?v=ulP4kQheDto&wfc=50&was=1800&show=1',
    'POST',
    './log',
    ['length', 'lost'],
    10,
    true,
  );

  myLogger.start();
})();
