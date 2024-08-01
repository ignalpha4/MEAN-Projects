export const TYPES = {

    //controllers 
    gameController : Symbol.for('gameController'),
    userController :Symbol.for('userController'),

    //middlewares

    authenticationMiddleware :Symbol.for('authenticationMiddleware'),
    authorizationMiddleware:Symbol.for('authorizationMiddleware'),     

    //services
    userService:Symbol.for('userService'),
    gameService:Symbol.for('gameService')
}
