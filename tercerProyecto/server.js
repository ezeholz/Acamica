const express = require('express');
const mysql = require('sqlite3').verbose();

// Database

let db = new mysql.Database(':memory:', function(err) {
    if(err) throw err;
    console.log("Database creada!")
    start()
});

function start() {
    let sql = 'CREATE TABLE usuarios (id INT AUTO_INCREMENT PRIMARY KEY'
    sql = sql+', username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL'
    sql = sql+', nombre VARCHAR(255) NOT NULL, correo VARCHAR(255) NOT NULL UNIQUE'
    sql = sql+', telefono INT UNSIGNED NOT NULL, dir VARCHAR(255) NOT NULL'
    db.run(sql+')',function(err) {
        if(err) throw err;
        console.log("Creada!")
    })

    sql = 'CREATE TABLE productos (id INT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(255) NOT NULL'
    sql = sql+', short VARCHAR(255) NOT NULL UNIQUE, img VARCHAR(255), precio INT UNSIGNED NOT NULL'
    db.run(sql+')',function(err) {
        if(err) throw err;
        console.log("Creada 2!")
    })

    sql = 'CREATE TABLE pedidos (id INT AUTO_INCREMENT PRIMARY KEY, status INT UNSIGNED NOT NULL'
    sql = sql+', hora INT UNSIGNED NOT NULL, prod VARCHAR(255) NOT NULL' // prod van a ser las ids
    sql = sql+', usuario INT UNSIGNED NOT NULL, pago INT UNSIGNED NOT NULL' // 0 o 1 para efectivo
    db.run(sql+')',function(err) {
        if(err) throw err;
        console.log("Creada 3!")
    })
}

db.run("INSERT INTO usuarios(username, password, nombre, correo, telefono, dir) VALUES ('admin','admin','admin','admin','0','admin')",function(err) {
    if(err) throw err
    console.log("Hecho")
    db.each('SELECT Name FROM usuarios',function(err,row) {
        if(err) throw err
        console.log("Encontrado " + row)
    })
})
// 