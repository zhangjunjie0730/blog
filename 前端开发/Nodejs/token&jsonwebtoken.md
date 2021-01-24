# Token

Token 是服务端生成的一段字符串，然后发送给客户端作为客户端的请求令牌，即以后客户端请求数据时带上这个token，服务端就能在识别用户信息，进行相应处理。具体流程如下：

1. 客户端使用用户名和密码进行登录。
2. 服务端收到后验证用户名和密码。
3. 验证成功后，服务端生成一段 token 字符串，把这个 token 发送给客户端。
4. 客户端一般将 token 存储在 cookie 或者 localStorage 中
5. 客户端每次向服务端请求时都带着服务端的 token。
6. 服务端收到请求后，验证这个 token，如果成功，返回的请求数据。

## Token 的优势

**1. 无状态，可扩展**

session 具有无状态、不存储的特点。如果将已验证的用户信息保存在 session 中，每次请求都需要在服务端验证。用户量大时，可能造成拥堵。使用 token 可以解决这个问题，因为 token 字符串自身带着用户的信息。session 的过程如下：

> 1. 用户向服务器发送用户名和密码。
> 2. 服务器验证后，通过 session 保存相关信息，如：用户角色、登陆时间等。
> 3. 服务端向用户返回一个 session_id，写入到浏览器的 cookie。
> 4. 用户每次请求时，通过 cookie，将 session_id 传回服务器。
> 5. 服务器收到 session_id，去 redis 之类的数据库中找到对应的 session，由此得知用户的身份。

所以，session 持久化不好。并且扩展性不好：**比如阿里的两个网站支付宝和蚂蚁金服，要求一个网站用户登录后，另一个网站也保持自动登录，session 无法实现。**

**因为，token 是将用户信息加密打包成 JSON 对象，然后转为字符串，再放在客户端中。session 是把数据存储在服务端，返回客户端查询 session 的 id。**

**2. 安全性**

请求时不再发送 cookie（能跨站请求伪造）而是 token。即使在客户端使用 cookie 存储 token，cookie 也仅仅是一个存储机制而不是用来认证的。不将信息存在 session 中，就少了对 session 的操作。token 是有时效的，到时间后需要重新验证。token 也有撤回的操作，通过 token revocation 可以使一个特定的 token 或者一组具有相同认证的 token 失效。

**3. 可扩展性**

Tokens 能够创建与其它程序共享权限的程序。例如，能将一个随便的社交帐号和自己的大号( Fackbook 或是 Twitter )联系起来。当通过服务登录 Twitter (我们将这个过程 Buffer )时，我们可以将这些 Buffer 附到 Twitter 的数据流上(we are allowing Buffer to post to our Twitter stream)。使用 tokens 时，可以提供可选的权限给第三方应用程序。当用户想让另一个应用程序访问它们的数据，我们可以通过建立自己的 API，得出特殊权限的 tokens。



## Token 生成流程

**Token 遵循 JSON Web Token 协议。**流程如下：

1. 服务器认证后，生成一个 JSON 对象。

   ```json
   {
     "姓名": "张三",
     "角色": "管理员",
     "到期时间": "2018年7月1日0点0分"
   }
   ```

2. JWT 格式由三部分组成：Header（JWT 格式的标识）.Payload（主体内容）.Signature（密钥） 组成。

3. JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符 `+`、`/` 和 `=`，在 URL 里面有特殊含义，所以要被替换掉：`=` 被省略、`+` 替换成 `-`，`/` 替换成 `_` 。这就是 Base64URL 算法。



# Jsonwebtoken 库使用

```js
const jwt = require('jsonwebtoken');
const { TOKEN } = require('../config'); // 存储密钥和过期时间

/**
 * @param {Object} info - 存储在token中的值
 */
exports.createToken = info => {
  const token = jwt.sign(info, TOKEN.secret, { expiresIn: TOKEN.expiresIn });
  return token;
};

/**
 * @param {Object} ctx - app.context
 * @param {Array} roleList - 需要具备的权限 { role: 1, verifyTokenBy: 'url' }
 *
 * @return {Boolean} 是否验证通过
 */
exports.checkToken = (ctx, roleList = []) => {
  let isVerify = false;
  function _verify(token) {
    return jwt.verify(token, TOKEN.secret, (err, decoded) => {
      if (err) return false;
      if (decoded) return !!roleList.find(item => item.role === decoded.role);
      return false;
    });
  }

  /**
   * oAuth请求头格式：
   * headers: {Authorization: `${token_type} ${access_token}`}
   * 注意参数之间有个空格
   */
  for (const item of roleList) {
    if (item.verifyTokenBy === 'headers') {
      const authorizationHeader = ctx.headers['authorization'];
      if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1];
        const result = _verify(token);
        if (result) {
          isVerify = true;
          break;
        }
      }
    } else {
      const { token } = ctx.query;
      if (token) {
        const _token = token.split(' ')[1];
        const result = _verify(_token);
        if (result) {
          isVerify = true;
          break;
        }
      }
    }
  }
  return isVerify;
};
```





















