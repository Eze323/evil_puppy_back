const axios = require('axios');
const { Temperament } = require("../db");

const URL = 'https://api.thedogapi.com/v1/breeds';

async function getAllTemperaments() {
  const temperaments=await Temperament.findAll();
  if(temperaments.length===0){

          try {
            const response = await axios.get(URL);
            const data = response.data;

            const allTemperaments = data.flatMap((breed) => {
              const temperamentString = breed.temperament || '';
              return temperamentString.split(',').map((temp) => temp.trim());
            });

            const uniqueTemperaments = [...new Set(allTemperaments)];

            const createdTemperaments = await Promise.all(uniqueTemperaments.map((name) =>
              Temperament.create({ name })
                .then((temperament) => temperament.toJSON())
                .catch((err) => console.log(`Error al crear el temperamento ${name}: ${err}`))
            ));

            return createdTemperaments;
          } catch (error) {
            console.log('Hubo un problema con la petición: ' + error.message);
            return [];
          }
 }else{
  return temperaments;
 }
}

module.exports = { getAllTemperaments };
