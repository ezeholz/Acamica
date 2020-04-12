const express = require('express');
const mysql = require('sqlite3')//.verbose();
const jwt = require('jsonwebtoken')
const cors = require('cors')

// Token

const firmaJWT = "ItsAMeBearer"

function autenticar(username, password) {
    return new Promise(function(resolve,reject){
        db.get('SELECT Username username, Password password FROM usuarios WHERE Username = ?',username, function(err,row){
            if(err) {
                console.log(err)
                reject()
            }
            if(row != undefined && row.username === username.toLowerCase() && row.password === password){
                const token = jwt.sign({"username":row.username,"id":row.id},firmaJWT)
                db.run('UPDATE usuarios SET iat = ? WHERE username = ?',[jwt.verify(token,firmaJWT).iat,row.username])
                resolve(token)
            } else {
                resolve(false)
            }
        })
    })
}

function verificarToken(token) {
    return new Promise(function(resolve,reject){
        const verify = jwt.verify(token,firmaJWT)
        db.get('SELECT username, iat FROM usuarios WHERE username = ? AND iat = ?',[verify.username,verify.iat],function(err,row) {
            if(err) {
                console.log(err)
                reject()
            }
            if(row != undefined) resolve(row.username)
            else resolve(false)
        })
    })
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
        sql = sql+', iat INT UNSIGNED'
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
        sql = sql+', hora VARCHAR(5) NOT NULL, prod VARCHAR(255) NOT NULL' // prod van a ser las ids
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

app.get('/pedidos\*',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        if (usuario == "admin") {
            if(req.originalUrl.split('/')[2]!=undefined){
                db.get('SELECT * FROM pedidos WHERE id = ?',req.originalUrl.split('/')[2],function(err,row) {
                    if(err) {
                        res.status(404).send(err)
                        console.log(err)
                        return
                    }
                    res.status(200).json(row)
                })
            } else if(req.originalUrl.split('/')[2]==undefined) {
                db.all('SELECT * FROM pedidos', function(err, rows) {
                    if(err) {
                        res.status(404).send(err)
                        console.log(err)
                        return
                    }
                    res.status(200).json(rows)
                })
            } else {
                res.sendStatus(404)
            }
        } else res.sendStatus(403)
    } else res.sendStatus(401)
})

app.post('/pedidos\*',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        let usuarioID = await new Promise(function(resolve){
            db.get('SELECT id, username FROM usuarios WHERE username = ?',usuario,function(err,row) {resolve(row.id)})
        })
        let hora = Date().split(" ")[4]
        const newProd = [0,hora.split(":")[0] +":"+ hora.split(":")[1],req.body.prod,usuarioID,req.body.pago]
        db.run('INSERT INTO pedidos(status, hora, prod, usuario, pago) VALUES (?,?,?,?,?)',newProd,function(err) {
            if(err) {
                res.status(404).send(err)
                console.log(err)
                return
            }
            res.sendStatus(200)
        })
    } else res.sendStatus(401)
})

// function infoPedidos() {
//     db.parallelize(function(){
//         db.get('SELECT username, nombre, dir, telefono FROM usuarios WHERE username = ?',usuario,function(err,row) {
//             body.Cliente = {
//                 "Nombre": row.nombre,
//                 "Direccion": row.dir,
//                 "Telefono": row.telefono
//             }
//         })
//         db.serialize(function(){
//             let prod = [], unique = []
//             pedido.sort(function(a,b){return a-b})
//             for(let i=0;i==pedido.length;i++){if(pedido.findIndex(function(a){return a==pedido[i]})==i) unique.push(pedido[i])}
//             for(let i=0;i==unique.length;i++){
//                 let producto = db.get('SELECT * FROM productos WHERE id = ?',unique[i],function(err,row){
//                     delete row.id
//                     return row
//                 })
//                 let count = pedido.filter(function(a){return a==unique[i]})
//                 prod.push({"Cantidad":count,"Producto":row})
//             }
//             body.Productos = prod
//         })
//     })
// }

// async function postPedidos(usuario, pedido, efectivo) {
//     let body = {}
//     let hora = Date().split(" ")[4]
//     body.hora = hora.split(":")[0] +":"+ hora.split(":")[1]
//     body.status = 0
//     body.pago = efectivo
//     body.prod = pedido
//     body.usuario = await new Promise(function(resolve){
//         db.get('SELECT id, username FROM usuarios WHERE username = ?',usuario,function(err,row) {resolve(row)})
//     })
//     return body
// }

app.put('/pedidos\*',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        if (usuario == "admin") {
            let hold = []
            for(let [a,] of Object.entries(req.body)){hold.push(a)}
            let vals = Object.values(req.body).map(function(a){if(!isNaN(a)){return +a}else{return a}})
            db.run('UPDATE pedidos SET '+hold.map(function(a){return a+' = ?'}).join(", ")+' WHERE id = '+req.originalUrl.split('/')[2],vals,function(){
                db.get('SELECT * FROM pedidos WHERE id = '+this.lastID,function(err,row){
                    console.log(JSON.stringify(row))
                    res.status(200).json(row)
                })
            })
        } else res.sendStatus(403)
    } else res.sendStatus(401)
})

// // Productos

app.get('/productos\*',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        if(req.originalUrl.split('/')[2]!=undefined){
            db.get('SELECT * FROM productos WHERE id = ?',req.originalUrl.split('/')[2],function(err,row) {
                if(err) {
                    res.status(404).send(err)
                    console.log(err)
                    return
                }
                res.status(200).json(row)
            })
        } else if(req.originalUrl.split('/')[2]==undefined) {
            db.all('SELECT * FROM productos', function(err, rows) {
                if(err) {
                    res.status(404).send(err)
                    console.log(err)
                    return
                }
                res.status(200).json(rows)
            })
        } else {
            res.sendStatus(404)
        }
    } else res.sendStatus(401)
})

app.post('/productos',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        if (usuario == "admin") {
            const newProd = [req.body.nombre,req.body.short,req.body.img,req.body.precio]
            db.run('INSERT INTO productos(nombre, short, img, precio) VALUES (?,?,?,?)',newProd,function(err) {
                if(err) {
                    res.status(400).send(err)
                    console.log(err)
                    return
                }
                res.sendStatus(200)
            })
        }  else res.sendStatus(403)
    } else res.sendStatus(401)
})

app.put('/productos\*',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        if (usuario == "admin") {
            let hold = []
            for(let [a,] of Object.entries(req.body)){hold.push(a)}
            let vals = Object.values(req.body).map(function(a){if(!isNaN(a)){return +a}else{return a}})
            db.run('UPDATE pedidos SET '+hold.map(function(a){return a+' = ?'}).join(", ")+' WHERE id = '+req.originalUrl.split('/')[2],vals,function(){
                db.get('SELECT * FROM productos WHERE id = '+this.lastID,function(err,row){
                    console.log(JSON.stringify(row))
                    res.status(200).json(row)
                })
            })
        }  else res.sendStatus(403)
    } else res.sendStatus(401)
})

app.delete('/productos\*',async function(req,res) {
    const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
    if (usuario) {
        if (usuario == "admin") {
            db.run('DELETE FROM productos WHERE id = ?',req.originalUrl.split('/')[2],function(){
                if(this.changes == 0) res.sendStatus(404)
                else res.sendStatus(200)
            })
        }  else res.sendStatus(403)
    } else res.sendStatus(401)
})


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

app.get('/usuarios\*', async function(req,res) {
    if(req.originalUrl.split('/')[2]==="login"){
        const token = await autenticar(req.headers.username,req.headers.password)
        console.log(req.headers.username+" "+req.headers.password+" "+token)
        if (token) switch(req.headers.accept.split("/")[0]=="text"){
            case true: res.status(200).send(token);break;
            case false: res.status(200).send({'api_key':token});break;
        }
        else res.sendStatus(404)
    } else if(req.originalUrl.split('/')[2]==="logout"){
        const usuario = await verificarToken(req.headers.authorization.split(" ")[1])
        if (usuario) {
            db.run('UPDATE usuarios SET iat = NULL WHERE username = ?',usuario,function(){res.sendStatus(200)})
        } else res.sendStatus(401)
    } else {
        res.sendStatus(404)
    }
})

const listener = app.listen(8000, function() {
    console.log("Servidor en localhost:"+listener.address().port)
})