**一旦我们实现了 JWT 认证过滤器并用它来保护您的 API 接口，前端在访问那些需要认证的接口时，就必须在请求中携带登录时获取到的 JWT Token。**

这个过程通常是这样的：

1. 
2. **用户登录**：
   - 
   - 前端发送 POST /auth/login 请求，包含 userId 和 password。
   - 后端认证成功后，返回一个 JWT Token 给前端（例如，在响应体的 data.token 字段中）。
3. **前端存储 Token**：
   - 
   - 前端获取到这个 Token 后，需要将其存储起来。常见的存储位置有：
     - 
     - **localStorage**: 简单方便，但要注意 XSS 风险（如果站点有 XSS 漏洞，Token 可能被窃取）。
     - **sessionStorage**: 生命周期只在当前会话（浏览器标签页关闭即失效），相对 localStorage 安全一些，但用户关闭标签页后需要重新登录。
     - **HTTP-only Cookie**: 更安全的方式，因为 JavaScript 无法直接访问，可以有效防止 XSS。后端在登录成功时通过 Set-Cookie 响应头设置，后续浏览器会自动在每个请求中携带。但需要处理 CSRF 问题（尽管对于无状态 API，CSRF 的影响方式不同）。
     - **内存中 (例如 Vuex, Redux, Zustand 等状态管理库)**: Token 只存在于应用运行时的内存中，刷新页面会丢失，通常会结合 localStorage/sessionStorage 做持久化。
4. **访问受保护的 API 接口**：
   - 
   - 当用户进行后续操作，需要调用那些被设置为“需要认证”的后端 API 时（例如获取用户个人信息 /users/{userId}，创建课程 /courses 等）。
   - 前端需要在每个这类请求中，将之前存储的 JWT Token 包含进去。
   - **最常见的方式是将 Token 放在 HTTP 请求的 Authorization Header (请求头) 中，并使用 Bearer 方案 (scheme)。**
     - 
     - 例如： Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMjM3NzExMSIsImV4cCI6MTY3ODEwMDU0MiwidXNlcklkIjoiMjIzNzcxMTEiLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNjc4MDk2OTQyfQ.xxxxxxxxxxxx
     - 这里的 eyJhbG... 就是登录时获取到的 JWT Token 字符串。
5. **后端验证 Token**：
   - 
   - 我们即将实现的 JwtAuthenticationFilter 会拦截这些带有 Authorization 头的请求。
   - 它会提取出 Bearer 后面的 Token 字符串。
   - 使用 JwtUtil (或类似的工具) 来：
     - 
     - 验证 Token 的签名是否有效（确保未被篡改）。
     - 检查 Token 是否已过期。
     - 从 Token 中解析出用户信息（如 userId, roles）。
   - 如果 Token 有效，过滤器会创建一个代表当前用户的 Authentication 对象，并将其设置到 SecurityContextHolder 中。这样，Spring Security 就知道当前请求是已认证的，并且知道是哪个用户以及他们拥有什么权限。
   - 然后请求会继续流转到相应的 Controller 方法。
   - 如果 Token 无效或不存在，过滤器会拒绝请求，通常返回 401 Unauthorized。

**总结一下前端的交互流程：**

1. 
2. 用户未登录时，访问登录页面。
3. 提交登录表单 -> 后端 /auth/login -> 获取 Token。
4. 前端存储 Token。
5. 用户访问需要权限的页面或功能 -> 前端发起 API 请求 -> 在请求头 Authorization 中附带 Bearer <Token>。
6. 后端验证 Token：
   - 
   - 成功 -> 返回数据。
   - 失败 (例如 Token 过期) -> 返回 401 -> 前端通常会引导用户重新登录。

所以，是的，前端在登录成功后，后续访问受保护资源时，**必须**将获取到的 Token 作为凭证上传给后端。这是基于 Token 的认证机制的核心工作方式。