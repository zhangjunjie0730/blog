const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
const router = new Router();
const koaBody = require('koa-body');

router.post('/upload', async ctx => {
  // 在ctx.request.body.files中获取文件;
  console.log('文件', ctx.request.files.file.path);
  const file = ctx.request.files.file;
  const reader = fs.createReadStream(file.path);
  const writer = fs.createWriteStream(path.join(__dirname, 'static', 'upload', file.name));
  reader.pipe(writer);
  ctx.body = '保存成功';
});

module.exports = router;
