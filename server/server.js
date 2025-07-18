const express = require('express')
const ConnectDB = require('./config/db')
const cors = require('cors')

require('dotenv').config();
ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", require("./routes/PostRoutes"));
app.use("/api/categories", require("./routes/CategoryRoutes"));


const PORT = process.env.PORT || 5000
app.listen(PORT,
        ()=>console.log(`Server is running on http://localhost:${PORT}`)
    )