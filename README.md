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


https://www.awesomescreenshot.com/video/46036343?key=98e8dc7c65a442ae625c0f77bb7d7dce

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

      <script
        src="aichatlite.js"
        data-webhook="https://n8n.yourdomain.com/webhook/chat"
        data-title="AI Assistant"
        data-greeting="👋 Hello! How can I help you today?"
        data-color="#0d6efd"
      ></script>

💡 Tip:
Place this <script> tag just before your </body> tag so the widget loads after your content.

Once loaded, a floating 💬 button appears in the bottom-right corner.

</details>
<details> <summary>🧠 <b>How It Works</b></summary>

AIChatLite.js listens for user input, sends it to your configured data-webhook (or LLM API), and displays the response as an animated chat reply.

It automatically manages:

Chat history persistence (stored in localStorage)

Session expiry after 1 hour

Greeting and “welcome back” messages

</details>
<details> <summary>🧩 <b>Manual Initialization (Advanced)</b></summary>

For developers who want programmatic control:

    <script>
      new ChatWidget({
        title: "AI Assistant",
        webhookUrl: "https://n8n.yourdomain.com/webhook/ai-chat",
        model: "llama3", // optional, for Ollama or LLM mode
        greeting: "Hi there 👋 How can I assist you today?",
        color: "#16a34a",
        typingSpeed: 20,
        storageKey: "customChatKey", // optional
        theme: "dark", // optional theme mode
        placeholder: "Type your question here...", // optional
        position: "bottom-right" // optional, values: bottom-right | bottom-left
      });
    </script>

</details>
⚙️ Available Config Options
      Option	Type	Default	Description
      title	string	"Chat with us"	Widget header title
      webhookUrl	string	""	API or webhook endpoint
      model	string	""	Optional LLM model name (e.g., llama3)
      greeting	string	"Hello! How can I help you today?"	Default greeting message
      color	string	"#0d6efd"	Widget accent color
      typingSpeed	number	25	Typing animation speed
      storageKey	string	"chatWidgetConversation"	LocalStorage key for session data
      theme	string	"light"	Optional theme (light / dark)
      placeholder	string	"Type a message..."	Input box placeholder
      position	string	"bottom-right"	Widget placement on screen
      <details> <summary>🔌 <b>API Integration</b></summary>

AIChatLite.js can connect to any backend, including n8n and Ollama, using simple JSON requests.

🟢 n8n / REST API Mode
Request Example

      {
        "message": "What are your support hours?",
        "sessionId": "1730805678419"
      }

Expected Response

      {
        "output": "We’re available Monday to Friday, 9 AM to 6 PM IST. 😊"
      }


💡 n8n Setup Example

Add Webhook Trigger (POST) node

Add AI Model or logic node (OpenAI, Ollama, Gemini, etc.)

Use a Respond to Webhook node with:

    { "output": $json["data"] }


Then copy the webhook URL and paste it in your script as data-webhook.

🔵 Ollama / Local AI Mode

If you specify a model, the widget uses Ollama-style payloads automatically.

Request Example

      {
        "model": "llama3",
        "prompt": "Write a short motivational quote about success",
        "stream": false
      }

Expected Response

      {
        "response": "Success is the sum of small efforts repeated day in and day out."
      }


💬 Displayed in chat:

Success is the sum of small efforts repeated day in and day out.

</details>
<details> <summary>📘 <b>Example Combined Reference</b></summary>
Mode	Request Payload	Expected Response	Example Output
n8n API	{ "message": "Hi" }	{ "output": "Hello! How can I help you today?" }	“Hello! How can I help you today?”
Ollama API	{ "model": "llama3", "prompt": "Tell a joke" }	{ "response": "Why did the AI cross the road? To optimize the other side!" }	“Why did the AI cross the road? To optimize the other side!”
</details>
💾 Session Management

Chat messages are saved locally (in localStorage)

After 1 hour of inactivity, sessions reset automatically

Displays “Welcome back” on next load

✨ Message Formatting

Supports basic Markdown-like syntax.

Input	Output

      **bold**	bold
      *italic*	italic
      - Point	◉ Point
      \n	Line break
      \n\n	Paragraph break
      🎨 Styling

You can customize the widget’s look by overriding styles in your CSS:

    #chat-box {
      font-family: "Inter", sans-serif;
      border-radius: 12px;
    }
    
    #chat-button {
      background-color: #ff9800 !important;
    }

🧱 Project Example Structure

      /project-root
      │
      ├── index.html
      ├── aichatlite.js
      ├── LICENSE
      └── README.md

<details> <summary>🪄 <b>Advanced Usage</b></summary>
🧩 Use with Dynamic Backends

You can dynamically set webhookUrl at runtime:

    const widget = new ChatWidget({
      webhookUrl: `/api/chatbot?tenant=${currentUserId}`
    });

🔁 Reset or Clear Chat

Manually clear stored chat history:

    localStorage.removeItem("chatWidgetMessages");
    localStorage.removeItem("chatWidgetSession");

</details>
<details> <summary>🧠 <b>Developer Setup</b></summary>

This project is a pure JS library (no build tools required).
However, for contributing or development:

git clone https://github.com/biswajitnandi/AIChatLite.js.git
cd AIChatLite.js


You can edit aichatlite.js directly and test it using index.html.

</details>
❓ FAQ

Q: Can I use it without n8n?
✅ Yes — any REST API that accepts JSON input and returns a text response works.

Q: Can it work offline with Ollama?
✅ Yes — just point data-webhook to your local Ollama endpoint.

Q: Does it support streaming replies?
🚧 Not yet — coming soon (planned feature).

Q: Can I use it in React/Vue?
✅ Absolutely. Just include the script in public/index.html.

🔐 Security Notes

Do not expose API keys in the browser.

Use n8n or a backend proxy for secure API calls.

The widget only stores message text and sessionId locally.

🧾 License

MIT License © 2025
You can freely use, modify, and distribute AIChatLite.js for personal or commercial projects.
