const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

// 支持跨域请求
app.use(cors());

// 解析JSON请求体
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
  apiKey: "677aa0a2-a18e-408b-97b4-d1f2fd3921d7",
});

// QQ邮箱SMTP配置
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: "67490009@qq.com",
    pass: "gqaoevkevkpmbggj", // 注意：不是QQ密码，是授权码
  },
});

// 邮件发送接口
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "缺少必要参数" });
  }

  try {
    await transporter.sendMail({
      from: '"独居老人环境监测系统" <67490009@qq.com>',
      to, //接收者
      subject, //标题
      text, //内容
    });
    res.json({ message: "邮件发送成功" });
  } catch (err) {
    console.error("发送失败:", err);
    res.status(500).json({ error: "邮件发送失败", details: err.message });
  }
});

app.post("/ai", async (req, res) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "你是人工智能助手,要分析用户发来的json数据，每个数据代表一次室内烟雾浓度的值，你分析一下这个值，并判断是否安全，给出评价和相关建议",
      },
      {
        role: "user",
        content: JSON.stringify([
          { key: "2025-06-09T10:00:00", value: 45 },
          { key: "2025-06-09T10:01:00", value: 47 },
          { key: "2025-06-09T10:02:00", value: 52 },
          { key: "2025-06-09T10:03:00", value: 55 },
          { key: "2025-06-09T10:04:00", value: 61 },
          { key: "2025-06-09T10:05:00", value: 58 },
          { key: "2025-06-09T10:06:00", value: 65 },
          { key: "2025-06-09T10:07:00", value: 70 },
          { key: "2025-06-09T10:08:00", value: 73 },
          { key: "2025-06-09T10:09:00", value: 68 },
        ]),
      },
    ],
    model: "doubao-1-5-thinking-pro-250415",
  });
  res.json(completion.choices[0].message);
});

app.listen(PORT, () => {
  console.log(`服务启动，监听端口 ${PORT}`);
});
