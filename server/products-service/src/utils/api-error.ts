export class ApiError extends Error {
  public readonly status: number;
  public readonly errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message: string = 'Unauthorized Exception') {
    return new ApiError(401, message);
  }

  static BadRequest(message: string, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message: string = 'Not Found') {
    return new ApiError(404, message);
  }
}
