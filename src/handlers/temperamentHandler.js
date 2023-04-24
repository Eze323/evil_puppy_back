const {getAllTemperaments}= require('../controllers/temperamentController');

const getTemperamentHandler = async (req, res) => {
    
    const result = await getAllTemperaments();

    res.status(200).send(result);
};

module.exports = {getTemperamentHandler};