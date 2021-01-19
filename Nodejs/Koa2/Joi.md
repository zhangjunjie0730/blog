[Joi文档](https://joi.dev/api/?v=17.3.0)

# 在koa2中集成joi

1. 编写 `validate` 方法
2. 将 `validate` 方法全局设置在 `app.context` 的方法中
3. 路由中随意使用

```js
// utils/context.js
const Joi = require('joi');
/**
 * @param {Object} params - 需要被验证的对象
 * @param {Object} schema - 验证规则
 * @return Promise
 */
function validate(params = {}, schema = {}) {
  const ctx = this;
  const validator = Joi.object(schema).validate(params);
  if (validator.error) {
    ctx.throw(400, validator.error.message);
    return false;
  }
  return true;
}
module.exports = {
  validate,
};

// app.js
// 为server的参数context绑定自定义的属性
const context = require('./utils/context');
Object.keys(context).forEach(key => {
  app.context[key] = context[key];
});

// 具体验证时：
static async delete(ctx) {
  const validator = ctx.validate(ctx.params, {
    id: Joi.number().required(),
  });
  if (validator) {
    // ...handle logic
  }
}
```

