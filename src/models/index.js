const Sequelize = require('sequelize');

const initModels = require('./init-models');

//database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
	host: process.env.DB_HOST,
	dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});


const testConnect = async (sequelize)=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports={
    sequelize,
    models: initModels(sequelize),
    testConnect: testConnect
}