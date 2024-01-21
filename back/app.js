const express = require("express");
const userRouter = require('./src/routes/user');
const operationsRouter = require('./src/routes/operations')
const cors = require('cors');
require('./config/database');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*', // ou '*' para permitir qualquer origem
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };
  
app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/operations", operationsRouter);

app.listen(3001,()=>{
    console.log('Servidor foi iniciado!');
})