'use strict';

const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');

//Add user Schema
const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

userSchema.statics.hashPassword = function(plainPassword) {
    return bcrypt.hash(plainPassword, 10);
  }

/**
 * Load json users
 */
userSchema.statics.cargaJson = async function (fichero) {
  
    // Using a callback function with async/await
    const data = await new Promise((resolve, reject) => {
      // Encodings: https://nodejs.org/api/buffer.html
      fs.readFile(fichero, { encoding: 'utf8' }, (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  
    console.log(fichero + ' leido.');
  
    if (!data) {
      throw new Error(fichero + ' está vacio!');
    }
  
    const users = JSON.parse(data).users;
    const numUsers = users.length;

    // make hash of the passwords
    for (let i = 0; i < users.length; i++) {
        users[i].password = await User.hashPassword(users[i].password);
    }
  
    for (var i = 0; i < users.length; i++) {
      await (new User(users[i])).save();
    }
  
    return numUsers;
  
  };


const User = mongoose.model('User', userSchema);

module.exports = User; 

/**
 * In Installdb we have the logic of the database
 */