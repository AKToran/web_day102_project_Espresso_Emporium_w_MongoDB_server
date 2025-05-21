const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
  res.send("Coffee is brewing....");
})

app.listen(port, ()=>{
  console.log("coffee server is running on port:", port);
})