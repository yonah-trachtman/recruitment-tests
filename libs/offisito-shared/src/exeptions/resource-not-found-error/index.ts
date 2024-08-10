export class ResourceNotFoundError extends Error {
  constructor(public resourceName: string) {
    super(`${resourceName} couldn't found`);
    this.name = 'ResourceNotFoundError';
    // Fix the prototype chain
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}
