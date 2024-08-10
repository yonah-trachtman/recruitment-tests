export class MissingInputError extends Error {
  constructor(
    public resourceName: string,
    public inputType: string,
  ) {
    super(`_${inputType} of ${resourceName} is needed`);

    this.name = 'MissingInputError';

    // Fix the prototype chain
    Object.setPrototypeOf(this, MissingInputError.prototype);
  }
}
