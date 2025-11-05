# 💬 AIChatLite.js

> 🧠 Lightweight AI Chat Widget for **n8n**, **Ollama**, and any **REST API**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-blue)

---

## 🧩 Overview

**AIChatLite.js** is a **pure JavaScript chat widget** that turns any website into an **AI-powered assistant** — no frameworks or dependencies needed.

It connects seamlessly to **n8n**, **Ollama**, or **custom REST APIs**, providing:
- Smart AI chat interactions  
- Support/FAQ automation  
- Knowledge guidance for user manuals  
- Secure private AI assistant setups  

---

## 🚀 Features

✅ Zero dependencies — works anywhere  
✅ Integrates with **n8n**, **Ollama**, or any API  
✅ Auto-persistent chat session (1-hour expiry)  
✅ Typing animation for realistic replies  
✅ Markdown-style message formatting  
✅ Customizable colors, title, and greeting  
✅ Plug-and-play script embedding  
✅ Fully client-side, privacy-friendly  

---

## 🧠 Use Cases

### 🤖 **AI Chatbot**
Create an intelligent chatbot for websites that answers questions, recommends products, or interacts naturally with visitors.

> Example: “Tell me about your pricing plans.”

---

### 🔐 **Private AI Assistant**
Deploy a secure, local AI assistant powered by **Ollama** or **n8n**, running entirely within your private network.

> Example: “Summarize yesterday’s meeting notes.”

---

### 💁 **Support Assistant**
Automate FAQs and customer support using **n8n workflows** or your backend’s support database.

> Example: “How do I reset my password?”  
> → Replies with step-by-step instructions.

---

### 📘 **Knowledge Guider**
Transform your user manual or documentation into an interactive AI knowledge guide.

> Example: “How do I import CSV files?”

---

## ⚙️ Installation

Just drop this script into your website:

```html
<script
  src="aichatlite.js"
  data-webhook="https://n8n.yourdomain.com/webhook/chat"
  data-title="AI Assistant"
  data-greeting="👋 Hello! How can I help you today?"
  data-color="#0d6efd"
></script>


### 📘 **Manual Initialization (Optional)**

```html
<script src="aichatlite.js"></script>
<script>
new ChatWidget({
  webhookUrl: "http://localhost:11434/api/generate",
  model: "llama3",
  title: "Local AI Assistant 🤖",
  color: "#2563eb",
  greeting: "Hey there! Ask me anything about AI.",
});
</script>
