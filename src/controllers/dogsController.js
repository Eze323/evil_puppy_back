const axios = require('axios');
const {Dog,Temperament}= require("../db");
const {Op} = require("sequelize");
const accessKey = process.env.ACCESS_TOKEN;
const apikey = process.env.api_key;
const URL = 'https://api.thedogapi.com/v1/breeds/';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': `${accessKey}`,
    'api_key':`${apikey}`
  },
};






axios.defaults.baseURL= 'https://evilpuppyback-evil-puppy.up.railway.app/';
//console.log(axios);
const cleanArray = (array) =>
    array.map(elemento=>{
        return {
            id:elemento.id,
            name:elemento.name,
            image:elemento.image.url,
            height:elemento.height.metric,
            weight:elemento.weight.metric,
            lifeSpan:elemento.life_span,
            temperament:elemento.temperament,
            created:false

        }
    })
    const cleanArray2 = (array) =>
    array.map(elemento=>{
        return {
            id:elemento.id,
            name:elemento.name,
            height:elemento.height.metric,
            weight:elemento.weight.metric,
            lifeSpan:elemento.lifeSpan,
            temperament:elemento.temperament,
            created:false

        }
    })
    const cleanArray3 = (array) => {
        return Promise.all(array.map(async (elemento) => {
          const imageUrlJPG = `https://cdn2.thedogapi.com/images/${elemento.reference_image_id}.jpg`;
          const responseJPG = await fetch(imageUrlJPG, { method: 'HEAD' });
          const isJPG = responseJPG.ok;
      
          const imageUrl = isJPG ? imageUrlJPG : `https://cdn2.thedogapi.com/images/${elemento.reference_image_id}.png`;
      
          return {
            id: elemento.id,
            name: elemento.name,
            height: elemento.height.metric,
            weight: elemento.weight.metric,
            image: imageUrl,
            lifeSpan: elemento.life_span,
            temperament: elemento.temperament,
            created: false,
          };
        }));
      };
      
const createDog = async (name, image, height, weight, lifeSpan, temperament) => {
    const dog = await Dog.create({
      name,
      image,
      height,
      weight,
      lifeSpan,
    });
  
    const temperaments = await Temperament.findAll({
      where: {
        id: temperament,
      },
    });
  
    await dog.addTemperaments(temperaments);
  
    return dog;
  };
  

const getDogByID = async (idRaza, source) => {
    let dog='';
    
        if(source === "API"){
            let apiDogs=(await axios.get(`https://api.thedogapi.com/v1/breeds/`,config)).data;
            
            dog= cleanArray(apiDogs.filter(dogui=>dogui.id==idRaza));
            dog=dog[0];
            //dog=cleanArray2(filterDogsApi);
        }else{
            //dog=(await Dog.findByPk(idRaza));
            dog = await Dog.findByPk(idRaza, {
                include: { 
                  model: Temperament, 
                  attributes: ['name'], through: { attributes: [] }
                } 
              });
              const temperaments = dog.temperaments.map((temp) => temp.name);

              // Eliminamos la propiedad "temperaments" del objeto dog
              delete dog.dataValues.temperaments;
          
              // Agregamos la propiedad "temperament" con los nombres de los temperamentos
              dog.dataValues.temperament = temperaments.join(', ');

        }

    return dog;
            
}

const searchDogByName= async (name) =>{
    //busca en la bdd
            // Buscamos los perros que coincidan con el nombre
            console.log('llego a la funcionbuscar por nombre'+name);
            const dogs = await Dog.findAll({
              where: {
                name: {
                  [Op.like]: `%${name.toLowerCase()}%`
                },
              },
              include: [
                {
                  model: Temperament,
                  attributes: ['name'],
                  through: { attributes: [] },
                },
              ],
            });
            console.log(dogs);
          //if(dogs.legnth>0){//si existen perros buscar sus temperamentos
            // // Mapeamos los resultados para incluir los nombres de los temperamentos en cada perro
            const dogsWithTemperaments = dogs.map((dog) => {
              const temperaments = dog.temperaments.map((temp) => temp.name);
              return {
                id: dog.id,
                name: dog.name,
                height: dog.height,
                weight: dog.weight,
                image: dog.image,
                lifeSpan: dog.lifeSpan,
                temperament: temperaments.join(', '),
                created: dog.created,
              };
            });
          //}
    //busca en la api
     //buscar en api 
  
  
     const apiDogsRaw= (
        await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${name}`,config)
    ).data;
   
    //const apiDogsRaw=(await axios.get(`https://api.thedogapi.com/v1/breeds/`)).data;
            
    const apiDogs=await cleanArray3(apiDogsRaw);
console.log(apiDogs);
    
            return [...dogsWithTemperaments,...apiDogs];
   
}

const getAllDogs = async () => {
  // Buscar en base de datos
  const databaseDogs = await Dog.findAll({
    include: { 
      model: Temperament, 
      attributes: ['name'], 
      through: { attributes: [] }
    }
  });

  // Transformar los datos para incluir solo los nombres de los temperamentos
  const transformedDatabaseDogs = databaseDogs.map((dog) => {
    const temperaments = dog.temperaments.map((temp) => temp.name);
    delete dog.dataValues.temperaments;
    dog.dataValues.temperament = temperaments.join(', ');
    return dog;
  });

  // Buscar en la API
  const apiDogsRaw = (
    await axios.get(URL,config)
  ).data;
  const apiDogs = cleanArray(apiDogsRaw);

  // Unir los resultados
  return [...transformedDatabaseDogs, ...apiDogs];
}


module.exports={createDog,getDogByID,getAllDogs,searchDogByName};