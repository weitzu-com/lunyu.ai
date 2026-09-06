# 游戏账号与云端旅程

本版使用专属 Supabase Auth + Postgres，Vercel Marketplace 资源 `lunyu-game`，免费套餐、North Virginia，项目 `jeloriiwflrpusgcchqs`。凭据由 Vercel 自动连接 Production / Preview / Development，`.env.local` 不提交到 Git。所有账号和存档是真正云端持久化，不使用浏览器存储模拟登录。

## 当前账号方式

本版目标为邮箱 + 8–128 字符密码注册，昵称 1–40 字符。邮箱仅用作账号标识，没有验证邮箱所有权。界面明确提示此状态，不提供尚未配置的邮件找回入口。不要依赖 `auth.users.email_confirmed_at` 宣称邮箱已验证：Supabase 自动确认也会设置该字段。

截至 2026-09-06 的最后一次验证，专属项目仍为 `mailer_autoconfirm=false`，公众注册配置尚未完成；已有账号的登录和云端存档已可用。需在 **lunyu-game** 项目的 Authentication → Sign In / Providers → Email 中关闭 Confirm email 并保存。只调整此项目，不调整其他项目。应用每次检查注册能力时读取官方 `/auth/v1/settings`，仅缓存项目状态 5 秒；邮箱登录已启用、自动确认已开启且未禁止注册时才开放注册。因此完成供应商设置后，重新检查注册服务或重新打开页面即可开放，无需再次发版。

配置未完成时，界面显示“注册暂未开放”，保留游客入口和“重新检查注册服务”；注册 API 返回 `503 registration_unavailable`，不会尝试创建用户或发送邮件。无法读取供应商状态时也暂不开放注册。没有通过管理 API 自动确认公众用户来绕过配置。

默认 Supabase SMTP 仅向项目团队地址发送邮件、当前限额 2 封/小时，因此不用于公众注册。未来接入自定义 SMTP 后，应关闭自动确认、更新 `accountCapabilities` 和 `publicUser`，补齐邮件验证、重发、密码恢复和回调体验后再开放找回。

官方依据：[Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp)、[SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)、[SSR 缓存和会话](https://supabase.com/docs/guides/auth/server-side/advanced-guide)。

## 前端 API

所有请求同源；所有 POST/PUT 发送 `Origin`，正文使用 `Content-Type: application/json`。浏览器 `fetch` 自动附带 Origin/cookie，不要自行读取 token。

| 方法 | 路径 | 正文 / 返回 |
| --- | --- | --- |
| GET | `/api/account/session` | `{ configured, registrationAvailable, registrationMessage, user, capabilities: { emailVerification:false, passwordRecovery:false, cloudProgress:true } }` |
| POST | `/api/account/register` | `{email,password,name}` → `{user,requiresEmailConfirmation,message}`，201 |
| POST | `/api/account/login` | `{email,password}` → `{user}` |
| POST | `/api/account/logout` | → `{ok:true}`，仅退出本设备 |
| GET | `/api/account/progress` | `{save:null}` 或 `{save:{progress,revision,updatedAt}}` |
| PUT | `/api/account/progress` | `{progress,expectedRevision:null或正整数}` → `{save}` |

`user` 仅含 `{id,email,name,emailVerified:false}`，绝不返回访问令牌/刷新令牌。普通错误为 `{error,code}`。未认证返回 401、无效 Origin 为 403、频率限制 429、服务异常 503。存档并发冲突返回 409 `{error,code:'conflict',save}`，携带当前云端存档。

存档和退出请求附带 `X-Lunyu-Account-Id`。服务端与真实会话身份核对；若其他标签页刚切换了账号，旧页面返回 `409 account_changed`，不能把旧账号的旅程写入新账号。

首次保存必须传 `expectedRevision:null`；已有云端存档时此操作返回 409。后续保存传最近读取的 `revision`。登录时先读取云档，存在不同的本地进度和云端进度时由玩家选择；不要自动覆盖云档。即使玩家选择覆盖，也要使用最新云端 revision；并发冲突需要重新选择。

正常退出先完成最后一批云端保存。同步失败或存在冲突时，退出会先显示明确的二次确认：导出此设备手记、放弃未同步更改并退出，或返回保留。断网时无法清除服务器设置的 HttpOnly 会话，界面会提示尚未安全退出，恢复网络后可重试。成功退出会清除此账号的设备草稿并恢复游客旅程；账号的云档继续保留。账号切换与跨标签页切换使用账号归属标记和每标签页草稿，防止混用私人进度。

会话自然失效时，先按本地缓存的账号归属保存待同步草稿，再恢复游客旅程；即使页面刚刷新、内存中已经没有旧账号，也保留恢复数据。重新登录相同账号时优先恢复其草稿，并由玩家选择与云档的冲突，游客的新手记单独备份。空白但待同步的账号草稿同样参与冲突选择，避免清空操作被旧云档静默覆盖。

## 会话和授权

Supabase SDK 完全在服务器运行。Next Route Handlers 使用 `@supabase/ssr` cookie 适配器保存和刷新会话；HttpOnly + SameSite=Lax，生产 Secure。账号 API 始终 `private,no-store`，不参与页面缓存。每请求新建 Supabase client，防止 Vercel 实例重用导致会话混淆。授权使用 `auth.getUser()` 服务端验证；所有存档操作再受 `auth.uid()=user_id` 数据库 RLS 保护。

注册和登录以服务端生成的 HMAC 邮箱/IP摘要限流，持久在独立 RLS 保护的表，跨 Vercel 实例有效。仅 service role 可执行限流函数；它不用于创建公众账号或读取玩家存档。Supabase 公共端点仍保留其自身认证限流；自定义 API 不向客户端暴露服务角色密钥。

## 数据迁移和验证

执行 `node --env-file=.env.local scripts/migrate-accounts.mjs`，用 TLS 连接 Postgres 并通过事务记录迁移版本。`game_progress` 按用户唯一，`revision` 递增；`save_game_progress` 在数据库中以 compare-and-swap 防止两台设备静默互相覆盖。

执行 `node --env-file=.env.local scripts/account-qa.mjs http://localhost:3212`，验证实际项目注册开关与 API 的 503 保护；自动确认开启时通过公众接口注册两个随机测试邮箱（`example.invalid`）。配置待完成时，仅为 QA 使用管理 API 创建两个一次性测试用户，再通过真实登录 API 验证登录、退出、Cookie 标志、未认证拒绝、跨账号 RLS、版本冲突与并发保存、输入/Origin 拒绝。最后删除本脚本创建的测试用户并级联清理进度。这些一次性 QA 账号不属于公众注册流程，脚本不发送邮件、不输出密钥或密码，不得用真实他人邮箱测试。

执行 `node scripts/account-registration-qa.mjs` 验证注册能力的条件、读取失败时关闭、5 秒缓存过期后自动开放，以及禁止注册时不调用注册 SDK。执行 `node scripts/account-sync-qa.mjs` 验证本地/云端显式选择、退出前最后一次编辑、保存过程中继续编辑、游客恢复、账号隔离和跨标签页草稿。

2026-09-06 已在本地 3212 的独立真实浏览器会话完成邮箱密码登录、HttpOnly 会话不可被页面脚本读取、带 Secure 标志的 cookie 在 localhost 保持会话、断网同步失败、手记下载、断网退出错误提示、恢复网络后退出并清除会话的交互验证；一次性测试账号已清理。该验证不是生产构建或生产站点的完整验收。
