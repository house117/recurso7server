const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Conexión a bd
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));
//Definición de rutas
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/cities", require("./routes/api/cities"));
app.use("/api/conteo", require("./routes/api/conteo"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
