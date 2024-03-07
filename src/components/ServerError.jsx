class ServerError extends Error {
  constructor(message) {
    super(message)
    this.name = "Server Error"
  }
}

export default ServerError