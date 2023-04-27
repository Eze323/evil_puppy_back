const { Router } = require('express');
const dogsRouter = require('./dogsRouter');
const { getTemperamentHandler } = require('../handlers/temperamentHandler');
//const axios =require('axios');


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const mainRouter = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
mainRouter.use('/dogs', dogsRouter);
mainRouter.get('/temperament',getTemperamentHandler);
module.exports = mainRouter;