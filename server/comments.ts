import axios from 'axios';
import { Comment } from './src/src/modules/reader/interfaces/comment.interface';

interface Variable {
  prev?: number;
  curr: number;
}

interface VariablesObj {
  [name: string]: Variable;
}

interface RequestParams {
  video: string;
  waitForComments: number;
  waitAfterScroll: number;
}

interface RequestOuput {
  comments: Comment[];
  length: number;
  lost: number;
  statusCode: number;
}

export class CommentsOptimizer {
  // Trying my own optimizer instead of gradient descent
  /**
   *
   * @param stepSize {number} Step of iteration as Integral
   * @param maxIterations
   */
  readonly video: string;
  readonly stepSize: number;
  readonly maxIterations: number;
  readonly variableToTrain: string;
  variables: VariablesObj;
  prevLoss: number;
  constructor(
    video: string,
    stepSize: number,
    maxIterations: number,
    variables: VariablesObj,
    variableToTrain: string,
  ) {
    this.video = video;
    this.stepSize = stepSize;
    this.maxIterations = maxIterations;
    (this.variables = variables), (this.variableToTrain = variableToTrain);
    this.prevLoss;
  }

  loss(lost: number, retrieved: number) {
    return Math.abs(lost / retrieved);
  }

  dx() {
    const { prev, curr } = this[this.variableToTrain];
    return prev - curr;
  }

  constructParams(): RequestParams {
    const output = {
      video: this.video,
    } as RequestParams;
    for (const name in this.variables) {
      output[name] = this.variables[name].curr;
    }
    return output;
  }

  async request({ video, waitForComments, waitAfterScroll }: RequestParams) {
    console.dir({ video, waitForComments, waitAfterScroll }, { colors: true });
    return await axios
      .post(
        `http://localhost:8000/reader/comments?v=${video}&wfc=${waitForComments}&was=${waitAfterScroll}&show=0`,
      )
      .then(res => res.data)
      .catch(err => `Error from axios: ${err}`);
  }

  async iteration(n: number) {
    const toOpt = this.variables[this.variableToTrain].prev;
    if (!toOpt) {
      return new Error('Variable not specified');
    }
    let error;
    this.variables[this.variableToTrain].curr = toOpt - this.stepSize;

    const params = this.constructParams();
    const res: RequestOuput = await this.request(params).catch(
      err => (error = err)
    );

    if (error) {
      return {
        error,
        iterations: n,
        ...this.variables,
      };
    }

    const currLoss = this.loss(
      res.lost || 1,
      res.length || 1,
    );
    if (this.prevLoss < currLoss || n >= this.maxIterations) {
      return {
        iterations: n,
        ...this.variables,
      };
    } else {
      this.variables[this.variableToTrain].prev = this.variables[
        this.variableToTrain
      ].curr;
      this.prevLoss = currLoss
      console.clear()
      console.log(`
        Iteration: ${n}
        Variable: ${this.variables[this.variableToTrain].prev}
        Loss: ${this.prevLoss = this.prevLoss}
        Lost: ${res.lost}
        Retrieved: ${res.length}
        \n${"---".repeat(15)}
      `);
      return this.iteration(n + 1);
    }
  }
}

(async () => {
  const myOpttimizer = new CommentsOptimizer(
    `RIFjbQMSGIs`,
    10,
    12,
    {
      waitForComments: { prev: 60, curr: 60 },
      waitAfterScroll: { prev: 1150, curr: 1150 },
    },
    'waitForComments',
  );

  console.clear()
  console.dir(await myOpttimizer.iteration(0), { colors: true });
})();
