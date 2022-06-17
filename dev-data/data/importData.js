const mongoose = require('mongoose');
const fs = require('fs');
const TourModel = require('../../modules/tourModel');
const env = require('dotenv');
env.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);

mongoose.connect(DB, {}).then(() => {
  console.log('ImportDatajs connected DB...');
});

const fileData = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

const addData = async () => {
  try {
    const add = await TourModel.create(fileData);
    console.log('Data saved');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await TourModel.deleteMany();
    console.log('Deleted files..');
  } catch (err) {
    console.log(err);
  }
};
addData();
