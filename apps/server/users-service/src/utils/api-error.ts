export class ApiError extends Error {
	public readonly status: number;
	public readonly errors: unknown[];

	constructor(status: number, message: string, errors: unknown[] = []) {
		super(message);

		this.name = this.constructor.name;
		this.status = status;
		this.errors = errors;
	}

	static Unauthorized(message: string = "Unauthorized Exception") {
		return new ApiError(401, message);
	}

	static BadRequest(message: string, errors: unknown[] = []) {
		return new ApiError(400, message, errors);
	}

	static NotFound(message: string = "Not Found") {
		return new ApiError(404, message);
	}

	static Conflict(message: string = "Conflict Exception") {
		return new ApiError(409, message);
	}
}
