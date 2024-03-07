class AuthorizationError extends Error {
  constructor(message) {
    super(message)
    this.name = "Authorization Error"
  }

}

export default AuthorizationError