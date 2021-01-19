const koa = require('koa');
const app = new koa();
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Router = require('koa-router');
const router = new Router();

const uploadRouter = require('./upload');

const PORT = 5001;

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      // uploadDir: path.resolve(__dirname, './upload'),
      keepExtensions: true, // 保持文件的后缀
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认20M
    },
  })
);

app.use(
  cors({
    origin: ctx => {
      if (ctx.url === '/upload') return '*';
      else return 'http://127.0.0.1/5001';
    },
    allowMethods: ['GET', 'POST', 'DELETE'], //设置允许的HTTP请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

router.get('/', async ctx => {
  ctx.body = `welcome to ${PORT}`;
});

// app.use(router.routes());

// upload
app.use(uploadRouter.routes());

app.listen(PORT, () => console.log(`koa is listening in http://127.0.0.1:${5001}`));
