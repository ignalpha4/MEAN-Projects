import express from "express"

const port =5000;


const app =  express()

console.log("hi");


app.listen(port,()=>{
    console.log( `listening on port ${port}`)
})