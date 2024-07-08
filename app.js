const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const ip = 'localhost';
const port = 3000;
const fs = require('fs');

// Configuración de middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname)));

// Configuración de conexión a MySQL
let conexion = mysql.createConnection({
    host: "database-1.ckrhtyubbrmo.us-east-1.rds.amazonaws.com",
    database: "db_consultas",
    user: "admin",
    password: "admin123"
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Manejo de la solicitud POST del formulario
app.post('/submit-form', (req, res) => {
    const { nombres, apellidos, celular, gmail, consulta } = req.body;

    const query = 'INSERT INTO Consultas (nombres, apellidos, celular, gmail, consulta) VALUES (?, ?, ?, ?, ?)';
    conexion.query(query, [nombres, apellidos, celular, gmail, consulta], (err, result) => {
        if (err) {
            console.error('Error al insertar datos: ' + err.stack);
            res.status(500).send('Ocurrió un error al procesar tu consulta.');
            return;
        }

        const htmlPath = path.join(__dirname, '/public/Redirectorio.html');
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo HTML: ' + err);
                res.status(500).send('Ocurrió un error al procesar tu consulta.');
                return;
            }
            res.send(data);
        });
    });
});

// Manejo de la solicitud POST del formulario de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Consulta a la base de datos para verificar credenciales
    conexion.query(
        'SELECT * FROM usuarios WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            if (err) {
                console.error('Error al consultar la base de datos: ' + err);
                res.status(500).json({ message: 'Error interno del servidor' });
                return;
            }

            if (results.length > 0) {
                // Autenticación exitosa
                res.status(200).json({ message: 'Login exitoso' });
            } else {
                // Autenticación fallida
                res.status(401).json({ message: 'Email o contraseña incorrectos' });
            }
        }
    );
});

app.get("/api/dates/:current", (req, res) => {
    var request = req.params.current;
    console.log(`Received request for date: ${request}`);

    const query = "SELECT NAMECAL, DESCCAL, DATE_FORMAT(DATECAL, '%d/%m/%Y') AS DATECAL FROM calendario WHERE DATECAL = ?";

    conexion.query(query, [request], function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json(null);
        }
    });
});

// Ruta para obtener las noticias
app.get('/api/news', (req, res) => {
    const query = 'SELECT id, title, description, image_url FROM noticias';
    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al obtener las noticias' });
            return;
        }
        res.json(results);
    });
});

// Ruta para obtener una noticia específica
app.get('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM noticias WHERE id = ?';
    conexion.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al obtener la noticia' });
            return;
        }
        res.json(results[0]);
    });
});

// Ruta para agregar una noticia
app.post('/api/news', (req, res) => {
    const { title, description, image_url } = req.body;
    const query = 'INSERT INTO noticias (title, description, image_url) VALUES (?, ?, ?)';
    conexion.query(query, [title, description, image_url], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al agregar la noticia' });
            return;
        }
        res.status(201).json({ message: 'Noticia agregada', id: results.insertId });
    });
});

// Ruta para actualizar una noticia
app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, image_url } = req.body;
    const query = 'UPDATE noticias SET title = ?, description = ?, image_url = ? WHERE id = ?';
    conexion.query(query, [title, description, image_url, id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al actualizar la noticia' });
            return;
        }
        res.json({ message: 'Noticia actualizada' });
    });
});

// Ruta para eliminar una noticia
app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM noticias WHERE id = ?';
    conexion.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al eliminar la noticia' });
            return;
        }
        res.json({ message: 'Noticia eliminada' });
    });
});

// Ruta para obtener los eventos del calendario
app.get('/api/events', (req, res) => {
    const query = 'SELECT id, fecha AS start, nombre_evento AS title, descripcion AS description FROM FechasCivicas';

    conexion.query(query, (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al obtener los eventos del calendario' });
            return;
        }

        // Transformar las fechas al formato ISO8601 (YYYY-MM-DD)
        results.forEach(event => {
            event.start = event.start.toISOString().split('T')[0];
        });

        res.json(results);
    });
});


// Ruta para agregar una nueva fecha cívica
app.post('/api/events', (req, res) => {
    const { fecha, nombre_evento, descripcion } = req.body;
    const query = 'INSERT INTO FechasCivicas (fecha, nombre_evento, descripcion) VALUES (?, ?, ?)';
    conexion.query(query, [fecha, nombre_evento, descripcion], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al agregar la fecha cívica' });
            return;
        }
        res.status(201).json({ message: 'Fecha cívica agregada', id: results.insertId });
    });
});

// Ruta para obtener una fecha cívica específica
app.get('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM FechasCivicas WHERE id = ?';
    conexion.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al obtener la fecha cívica' });
            return;
        }
        res.json(results[0]);
    });
});

// Ruta para actualizar una fecha cívica
app.put('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const { fecha, nombre_evento, descripcion } = req.body;
    const query = 'UPDATE FechasCivicas SET fecha = ?, nombre_evento = ?, descripcion = ? WHERE id = ?';
    conexion.query(query, [fecha, nombre_evento, descripcion, id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al actualizar la fecha cívica' });
            return;
        }
        res.json({ message: 'Fecha cívica actualizada' });
    });
});

// Ruta para eliminar una fecha cívica
app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM FechasCivicas WHERE id = ?';
    conexion.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error al eliminar la fecha cívica' });
            return;
        }
        res.json({ message: 'Fecha cívica eliminada' });
    });
});



// Servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://${ip}:${port}`);
});
