require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentsRouter = require('./routes/comments');
var categoriesRouter = require('./routes/categories');
var productsRouter = require('./routes/products');

var app = express();

// Kết nối MongoDB
// Thay đổi connection string này theo MongoDB của bạn:
// - Nếu dùng local: 'mongodb://localhost:27017/bai_tap_buoi_4'
// - Nếu dùng MongoDB Atlas: 'mongodb+srv://username:password@cluster.mongodb.net/bai_tap_buoi_4'
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bai_tap_buoi_4';
mongoose.connect(mongoURI);

// Kiểm tra kết nối MongoDB
mongoose.connection.on('connected', () => {
  console.log('✅ Kết nối MongoDB thành công!');
  console.log('🔗 Database:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Lỗi kết nối MongoDB:', err.message);
  console.log('💡 Hãy đảm bảo MongoDB đang chạy hoặc connection string đúng');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB đã ngắt kết nối');
});

// Xử lý graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Đã đóng kết nối MongoDB');
  process.exit(0);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
