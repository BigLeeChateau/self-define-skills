---
name: to-issues-invert
description: Run a Munger-style "invert, always invert" review after a /to-issues session. Reads the previous issue breakdown from context and checks for hidden risks, reversed assumptions, and fragile dependencies.
---

# To Issues Invert

"反过来想，永远反过来想。" —— 查理·芒格

在 `/to-issues` 结束后，用这个 skill 对 issue 拆分做一轮反向检查，专门发现隐藏风险、错误依赖和脆弱切片。

## Usage

1. 先运行 `/to-issues <你的计划>`，得到 issue 拆分。
2. 再运行 `/to-issues-invert`。
3. 查看反向检查报告，确认是否修改或继续追问。

如果当前会话中找不到 `/to-issues` 的前一轮输出，询问用户是粘贴内容继续，还是基于当前上下文继续。

## Process

### 1. 确认上下文

读取当前会话中 `/to-issues` 的输出。如果找不到，提示用户：

- 粘贴前一轮的 issues 内容；或
- 基于当前会话里任何相关的计划/讨论内容继续。

### 2. 开场

用一句话点题：

> "接下来我们用芒格的反向思考，把刚才的 issue 拆分再翻一遍。"

如果用户语言是中文，保留芒格原句；如果用户用其他语言，翻译成对应表达。

### 3. 反向检查报告

按以下顺序输出一份结构化检查报告。

#### D. 风险扫描（Risk Scan）

- 哪些 issue 是单点故障？它失败后会拖垮多少其他 issue？
- 哪些依赖关系是隐式的、没被显式写出来的？
- 验收标准最模糊的是哪一个？最容易扯皮的是哪一个？
- 有没有哪个 issue 看起来小，实际上要打通很多层？

#### C. 反转假设（Invert Assumptions）

- 当前拆分依赖哪些默认假设？比如"每个 slice 都是端到端"、"用户能快速反馈"。
- 如果这些假设反过来，拆分还成立吗？
- 有没有一个 issue 是为了满足某个未经证实的假设而存在的？
- 如果砍掉所有 HITL slice，AFK slice 还能独立完成验证吗？

#### A. 反方辩护（Devil's Advocate）

- 如果你是负责执行的工程师，你会挑哪个 issue 先不做？
- 哪个 slice 的标题写得很清楚，但点进去根本不知道要干嘛？
- 如果评审人只给你一半的工期，你会合并或砍掉哪些 issue？
- 有没有哪个 issue 只是为了"看起来工作量饱满"而存在的？

#### B. 反证法（Inversion From Failure）

- 假设项目延期两个月，哪些 issue 会被砍掉？砍完后还能交付核心价值吗？
- 如果第一个 slice 做完后发现方向错了，后面多少 issue 要重写？
- 哪个 issue 一旦失败，会让整个"tracer bullet"失去意义？

### 4. 建议变更（diff 形式）

基于上面的检查，用 diff 形式标出建议：

- **保留**：哪些 issue 不用动。
- **新增**：哪些 issue 应该补上，为什么。
- **合并**：哪些 issue 太薄，可以合并。
- **拆分**：哪个 issue 太厚，应该拆开。
- **调整依赖**：哪些"Blocked by"关系需要修改或补充。
- **重写验收标准**：哪些 issue 的 acceptance criteria 需要改得更具体。

不要直接覆盖原 issues，只给出建议变更。

### 5. 询问下一步

报告结束后，问用户：

- 是否基于这个 diff 重新生成一份 issues 列表？
- 还是想针对某一条风险继续 grilling？

### 6. 可选的深入 grilling

如果用户选择针对某条风险继续，进入轻量追问。问题贴着 issue 属性展开，例如：

- 这个 issue 的边界在哪里？哪些东西明确不在范围内？
- 它的验收标准能不能再倒着想？什么情况下这个 issue 算"完成但实际上失败了"？
- 如果砍掉这个 issue，最小可交付版本是什么？
- 这个 issue 的 blocker 是否真的是 blocker，还是只是顺手写上去的？

## Rules

- 使用用户的语言输出。
- 检查报告要结构化，便于快速扫视。
- 建议变更用 diff 形式呈现，不要直接覆盖原输出。
- 深入 grilling 是可选的，默认先给报告，用户想深挖再继续。
- 所有追问都贴着 issue 的具体属性，而不是重复通用框架。
