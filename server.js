const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5500;

// Middleware для добавления расширения .html и отправки файла, если он существует
app.use((req, res, next) => {
    if (req.path !== '/' && !path.extname(req.path)) {
        const filePath = path.join(__dirname, 'public', req.path + '.html');
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }
    next();
});

// vitamin template
app.get('/vitamins/:vitaminName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vitamin-template.html'));
});

// mienral template
app.get('/minerals/:mineralName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mineral-template.html'));
});

// food template
app.get('/food/:foodName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'food-template.html'));
});

// Useful template
app.get('/useful/:usefulName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'useful-template.html'));
});

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
