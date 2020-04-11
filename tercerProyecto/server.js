const express = require('express');
const mysql = require('sqlite3')//.verbose();
const jwt = require('jsonwebtoken')
const cors = require('cors')

// Token

const firmaJWT = "ItsAMeBearer"

function autenticar(username, password) {
    db.get('SELECT Username username, Password password FROM usuarios WHERE Username = ?',username, function(err,row){
        if(err) {
            res.status(404).send(err)
            console.log(err)
            return
        }
        if(row.username === username.toLowerCase() && row.password === password){
            const token = jwt.sign({"username":row.username,"id":row.id},firmaJWT)
            return token
        } else {
            return false
        }
    })
}

function verificarToken(token) {
    try {
        const verify = jwt.verify(token,firmaJWT)
        if(verify) {
            return verify
        }
    } catch(err) {
        return false
    }
}

// Database

const db = new mysql.Database(':memory:', function(err) {
    if(err) throw err;
    console.log("Database creada!")
});

db.parallelize(function() {
    db.serialize(function(){
        let sql = 'CREATE TABLE usuarios (id INTEGER PRIMARY KEY'
        sql = sql+', username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL'
        sql = sql+', nombre VARCHAR(255) NOT NULL, correo VARCHAR(255) NOT NULL UNIQUE'
        sql = sql+', telefono INT UNSIGNED NOT NULL UNIQUE, dir VARCHAR(255) NOT NULL'
        db.run(sql+')',function(err) {
            if(err) throw err;
            console.log("Creada Usuarios!")
        })
        db.run("INSERT INTO usuarios(id, username, password, nombre, correo, telefono, dir) VALUES ('0','admin','admin','admin','admin','0','admin')",function(err) {
            if(err) throw err
            console.log("Hecho admin")
        })
    })

    db.serialize(function(){
        sql = 'CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre VARCHAR(255) NOT NULL'
        sql = sql+', short VARCHAR(255) NOT NULL UNIQUE, img VARCHAR(255), precio INT UNSIGNED NOT NULL'
        db.run(sql+')',function(err) {
            if(err) throw err;
            console.log("Creada Productos!")
        })
    })

    db.serialize(function(){
        sql = 'CREATE TABLE pedidos (id INTEGER PRIMARY KEY, status INT UNSIGNED NOT NULL'
        sql = sql+', hora VARCHAR(255) NOT NULL, prod VARCHAR(255) NOT NULL' // prod van a ser las ids
        sql = sql+', usuario INT UNSIGNED NOT NULL, pago INT UNSIGNED NOT NULL' // 0 o 1 para efectivo
        db.run(sql+')',function(err) {
            if(err) throw err;
            console.log("Creada Pedidos!")
        })
    })
})

// Express

const app = express()
app.use(express.json())
app.use(cors())

// // Pedidos

app.get('/pedidos\*', function(req,res) {
    console.log("Llegó pedido API "+req.originalUrl.split('/')[2])
    if(req.originalUrl.split('/')[2]!=undefined){
        console.log("Hola")
        db.get('SELECT * FROM pedidos WHERE id = ?',req.originalUrl.split('/')[2],function(err,row) {
            if(err) {
                res.status(400).send(err)
                console.log(err)
                return
            }
            res.status(200).json(row)
        })
    } else {
        db.all('SELECT * FROM pedidos', function(err, rows) {
            if(err) {
                res.status(404).send(err)
                console.log(err)
                return
            }
            res.status(200).json(rows)
        })
    }
})

// app.post()
// app.put()

// // Productos

// app.get()
// app.post()
// app.put()
// app.delete()

// // Usuarios

app.post('/usuarios', function(req,res) {
    const newUser = [req.body.username,req.body.password,req.body.nombre,req.body.correo,req.body.telefono,req.body.dir]
    db.run('INSERT INTO usuarios(username, password, nombre, correo, telefono, dir) VALUES (?,?,?,?,?,?)',newUser,function(err) {
        if(err) {
            res.status(400).send(err)
            console.log(err)
            return
        }
        res.sendStatus(200)
    })
})

const listener = app.listen(8000, function() {
    console.log("Servidor en localhost:"+listener.address().port)
})