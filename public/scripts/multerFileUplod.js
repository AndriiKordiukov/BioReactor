const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Укажите место для сохранения загруженных файлов и их имена
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const nutrientType = req.body.optional; // Получаем nutrientType из формы
      const uploadPath = `images/${nutrientType}`; // Формируем путь загрузки
      cb(null, uploadPath); // Указываем путь для сохранения файла
  },
  filename: function (req, file, cb) {
      cb(null, path.extname(file.originalname)); // Генерация уникального имени файла
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
      // Фильтрация файлов по типу (например, разрешаем только изображения)
      if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only images are allowed!'), false);
      }
      cb(null, true);
  }
});

// Маршрут для обработки формы с загрузкой файла
app.post(uploadPath, upload.single('image'), (req, res) => {
    // Получаем относительный путь к файлу
    const imagePath = uploadPath + req.file.filename;

    // Получаем данные из формы
    const { name, fullName, rda, optional } = req.body;

    // Сохраните данные и путь к изображению в базу данных или обработайте их здесь
    // Например:
    const nutrientData = {
        name,
        fullName,
        rda,
        optional,
        imagePath
    };

    // Отправьте ответ на клиент
    res.json({ success: true, id: nutrientObject, imagePath });
});

app.use(uploadPath, express.static(uploadPath)); // Раздача загруженных файлов
