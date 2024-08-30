const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 5500;

// Middleware для обработки JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const nutrientType = req.params.nutrientType || 'default';
        const uploadPath = path.join(__dirname, 'public', 'images', nutrientType);

        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    }
});

const upload = multer({ storage: storage });

// Route to handle image upload
app.post('/upload-image/:nutrientType', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Image upload failed' });
    }

    const imagePath = `/images/${req.params.nutrientType}/${req.file.filename}`;
    res.json({ imagePath });
});

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

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Vitamin template
app.get('/vitamins/:vitaminName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nutrients/vitamin-template.html'));
});

// Mineral template
app.get('/minerals/:mineralName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nutrients/mineral-template.html'));
});

// Food template
app.get('/food/:foodName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nutrients/food-template.html'));
});

// Useful template
app.get('/useful/:usefulName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'useful-template.html'));
});

// List templates
app.get('/vitamins', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lists/vitamins.html'));
});
app.get('/minerals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lists/minerals.html'));
});
app.get('/aminoacids', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lists/aminoacids.html'));
});
app.get('/food', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lists/food.html'));
});

// Edit pages
app.get('/vitamins/edit/:nutrientId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit/nutrient-edit.html'));
});
app.get('/minerals/edit/:nutrientId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit/nutrient-edit.html'));
});
app.get('/food/edit/:nutrientId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit/food-edit.html'));
});

// Users pages
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users/register.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'users/login.html'));
});

// Serve static files from the "public/images" directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
