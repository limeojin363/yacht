export class UnavailableInteractionError extends Error {
  message: string;
  type: "UnavailableInteractionError";

  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = "UnavailableInteractionError";
  }
}

export class DevError extends Error {
  message: string;
  type: "DevError";

  constructor(message: string) {
    super(message);
    this.message = message;
    this.type = "DevError";
  }
}