const loggerMiddleware = ( request, response, next) => {
    console.log(`New request to ${request.method} ${request.path}`, request.body);
    next();
}
module.exports = loggerMiddleware;