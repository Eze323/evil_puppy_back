
const { createDog,getDogByID,getAllDogs,searchDogByName } = require("../controllers/dogsController")


const getDogsHandler = async (req, res) => {
    const { name } = req.query;

    const result = name ? await searchDogByName(name): await getAllDogs();

    res.status(200).send(result);
};



const getDogHandler = async (req, res) => {
    //console.log("Estoy en dogs id");
    const { idRaza } = req.params;
    const source = isNaN(idRaza) ? "BDD" : "API"
    console.log(source);
    try {
        const dog = await getDogByID(idRaza,source);
        res.status(200).send(dog);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }

}

const createDogHandler = async (req, res) => {
    //res.send(`Estoy por crear un perro con estos datos: ${name}- ${image}- ${height}- ${width} - ${lifeSpan} - ${temperament}`);
    try {
        const { name, image, height, weight, lifeSpan, temperament } = req.body;

        const newDog = createDog(name, image, height, weight, lifeSpan, temperament);
        res.status(201).send("Creado exitosamente");
    } catch (error) {
        res.status(400).send({ error: error.message })
    }

}


module.exports = { getDogsHandler, getDogHandler, createDogHandler };