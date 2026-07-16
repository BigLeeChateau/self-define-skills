---
name: to-tickets-invert
description: Run a Munger-style "invert, always invert" review after a /to-tickets session. Reads the previous ticket breakdown from context and checks for hidden risks, reversed assumptions, and fragile dependencies.
---

# To Tickets Invert

"反过来想，永远反过来想。" —— 查理·芒格

在 `/to-tickets` 结束后，用这个 skill 对 ticket 拆分做一轮反向检查，专门发现隐藏风险、错误依赖和脆弱的 vertical slice。

## Usage

1. 先运行 `/to-tickets <你的计划、spec 或讨论>`，得到 ticket 拆分。
2. 再运行 `/to-tickets-invert`。
3. 查看反向检查报告，确认是否修改或继续追问。

如果当前会话中找不到 `/to-tickets` 的前一轮输出，提示用户：

- 粘贴前一轮的 tickets 内容；或
- 基于当前会话里任何相关的计划/讨论内容继续。

同时明确提醒：**反向检查不能替代正向的 `/to-tickets`，它只能补充 ticket 拆分。**

## Process

### 1. 确认上下文

读取当前会话中 `/to-tickets` 的输出。如果找不到，提示用户：

- 粘贴前一轮的 tickets 内容；或
- 基于当前会话里任何相关的计划/讨论内容继续。

### 2. 开场

先用一句话点题：

> "接下来我们用芒格的反向思考，把刚才的 ticket 拆分再翻一遍。"

然后**简要复述你理解到的前一轮 `/to-tickets` 的核心内容**（ticket 列表、blocking edges、frontier、vertical slice 划分），并询问用户：

> "这是我们要反向检查的 ticket 拆分吗？如果有遗漏或偏差，请先纠正我。"

如果用户语言是中文，保留芒格原句；如果用户用其他语言，翻译成对应表达。

### 3. 反向检查报告

按以下顺序输出一份结构化检查报告。

#### D. 风险扫描（Risk Scan）

- 哪些 ticket 是单点故障？它失败后会拖垮多少其他 ticket？
- 哪些 blocking edges 是隐式的、没被显式写出来的？
- 验收标准最模糊的是哪一个？最容易扯皮的是哪一个？
- 有没有哪个 vertical slice 看起来小，实际上要打通很多层？

#### C. 反转假设（Invert Assumptions）

- 当前拆分依赖哪些默认假设？比如"每个 vertical slice 都是端到端"、"用户能快速反馈"。
- 如果这些假设反过来，拆分还成立吗？
- 有没有一个 ticket 是为了满足某个未经证实的假设而存在的？
- 如果砍掉所有需要人工确认的 slice，剩下的 slice 还能独立完成验证吗？

#### A. 反方辩护（Devil's Advocate）

- 如果你是负责执行的工程师，你会挑哪个 ticket 先不做？
- 哪个 vertical slice 的标题写得很清楚，但点进去根本不知道要干嘛？
- 如果评审人只给你一半的工期，你会合并或砍掉哪些 ticket？
- 有没有哪个 ticket 只是为了"看起来工作量饱满"而存在的？

#### B. 反证法（Inversion From Failure）

- 假设项目延期两个月，哪些 ticket 会被砍掉？砍完后还能交付核心价值吗？
- 如果第一个 vertical slice 做完后发现方向错了，后面多少 ticket 要重写？
- 哪个 ticket 一旦失败，会让整个"tracer bullet"失去意义？

### 4. 建议变更（diff 形式）

基于上面的检查，用 diff 形式标出建议：

- **保留**：哪些 ticket 不用动。
- **新增**：哪些 ticket 应该补上，为什么。
- **合并**：哪些 ticket 太薄，可以合并。
- **拆分**：哪个 ticket 太厚，应该拆开。
- **调整依赖**：哪些"Blocked by"关系需要修改或补充。
- **重写验收标准**：哪些 ticket 的 acceptance criteria 需要改得更具体。

不要直接覆盖原 tickets，只给出建议变更。

### 5. 询问下一步

报告结束后，问用户：

- 是否基于这个 diff 重新生成一份 tickets 列表？
- 还是想针对某一条风险继续 grilling？

### 6. 可选的深入 grilling

如果用户选择针对某条风险继续，进入轻量追问。问题贴着 ticket 属性展开，例如：

- 这个 ticket 的边界在哪里？哪些东西明确不在范围内？
- 它的验收标准能不能再倒着想？什么情况下这个 ticket 算"完成但实际上失败了"？
- 如果砍掉这个 ticket，最小可交付版本是什么？
- 这个 ticket 的 blocker 是否真的是 blocker，还是只是顺手写上去的？

## Rules

- 使用用户的语言输出。
- 检查报告要结构化，便于快速扫视。
- 建议变更用 diff 形式呈现，不要直接覆盖原输出。
- 深入 grilling 是可选的，默认先给报告，用户想深挖再继续。
- 所有追问都贴着 ticket 的具体属性，而不是重复通用框架。
