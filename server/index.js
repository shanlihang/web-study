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
  const { text } = req.body;

  try {
    await transporter.sendMail({
      from: '"独居老人环境监测系统" <67490009@qq.com>',
      to: "2127693973@qq.com", //接收者
      subject: "异常数据警报", //标题
      text, //内容
    });
    res.json({ code: 200, message: "邮件发送成功" });
  } catch (err) {
    console.error("发送失败:", err);
    res.status(500).json({ error: "邮件发送失败", details: err.message });
  }
});

app.post("/ai", async (req, res) => {
  const { type, value } = req.body;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "你是人工智能助手,要分析用户发来的json数据，每个数据代表一次室内烟雾/一氧化碳/温度/湿度的浓度的值，你分析一下这些值，并结合数值总结了一下，并给出一个建议，建议是一个字符串，不要超过100字",
      },
      {
        role: "user",
        content: JSON.stringify({
          type: `本次上传的数据为独居老人环境监测系统检测到的${type}测量值`,
          value,
        }),
      },
    ],
    model: "doubao-1-5-thinking-pro-250415",
  });
  res.json({ code: 200, data: completion.choices[0].message });
});

app.listen(PORT, () => {
  console.log(`服务启动，监听端口 ${PORT}`);
});
