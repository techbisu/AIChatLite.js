class AIChatLite {
  constructor(config = {}) {
    this.config = {
      title: config.title || "Chat with us",
      webhookUrl: config.webhookUrl || "",
      model: config.model || "", // optional — used only for LLM
      greeting: config.greeting || "Hello! How can I help you today?",
      color: config.color || "#0d6efd",
      storageKey: "AIChatLiteConversation",
      typingSpeed: 25,
    };
    this.session = this.loadSession();
    this.isOpen = false;
    this.init();
  }

  /** Initialize widget */
  init() {
    this.session = this.loadSession();
    this.updateActivity();
    this.injectStyles();
    this.renderWidget();
    this.restoreChatHistory();
    this.bindEvents();

    // If expired → show welcome back message
    if (this.session.expired) {
      this.addMessage("💬 Welcome back! Your previous chat has expired due to inactivity. Let’s start fresh!", "bot");
      this.saveMessage("💬 Welcome back! Your previous chat has expired due to inactivity. Let’s start fresh!", "bot");
    }
    // Otherwise, show greeting if no messages
    else if (this.session.messages.length === 0) {
      this.addMessage(this.config.greeting, "bot");
      this.saveMessage(this.config.greeting, "bot");
    }
  }


  /** Inject CSS */
  injectStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
      #chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${this.config.color};
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 9999;
      }
      #chat-box {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 320px;
        max-height: 480px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 9998;
      }
      #chat-header {
        background: ${this.config.color};
        color: white;
        padding: 10px 14px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #chat-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        line-height: 1;
      }
      #chat-messages {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        font-size: 14px;
        background-color: #f8f9fa;
      }
      .message { margin-bottom: 10px; }
      .user-message { text-align: right; }
      .user-bubble {
        display: inline-block;
        background: ${this.config.color};
        color: white;
        padding: 8px 12px;
        border-radius: 15px 15px 0 15px;
      }
      .bot-bubble {
        display: inline-block;
        background: #e9ecef;
        color: #000;
        padding: 8px 12px;
        border-radius: 15px 15px 15px 0;
      }
      #chat-input-area {
        display: flex;
        border-top: 1px solid #ddd;
      }
      #chat-input {
        flex: 1;
        border: none;
        padding: 10px;
        outline: none;
      }
      #chat-send {
        background: ${this.config.color};
        color: white;
        border: none;
        padding: 10px 15px;
        cursor: pointer;
      }
      #chat-send:hover { opacity: 0.9; }
      .typing-bubble {
        display: inline-block;
        background: #e9ecef;
        color: #000;
        padding: 8px 12px;
        border-radius: 15px 15px 15px 0;
        margin-bottom: 6px;
      }
      .typing-dots {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #555;
        animation: blink 1.4s infinite both;
      }
      .typing-dots:nth-child(2) { animation-delay: 0.2s; }
      .typing-dots:nth-child(3) { animation-delay: 0.4s; }
      @keyframes blink {
        0%, 80%, 100% { opacity: 0; }
        40% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  /** Render chat widget */
  renderWidget() {
    // Floating button
    this.chatButton = document.createElement("button");
    this.chatButton.id = "chat-button";
    this.chatButton.textContent = "💬";
    document.body.appendChild(this.chatButton);

    // Chat box
    this.chatBox = document.createElement("div");
    this.chatBox.id = "chat-box";
    this.chatBox.innerHTML = `
      <div id="chat-header">
        <span>${this.config.title}</span>
        <button id="chat-close">&times;</button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-area">
        <input type="text" id="chat-input" placeholder="Type a message..." />
        <button id="chat-send">Send</button>
      </div>
    `;
    document.body.appendChild(this.chatBox);

    // Store references
    this.chatMessages = this.chatBox.querySelector("#chat-messages");
    this.chatInput = this.chatBox.querySelector("#chat-input");
    this.chatSend = this.chatBox.querySelector("#chat-send");
    this.chatClose = this.chatBox.querySelector("#chat-close");
  }

  /** Bind event listeners */
  bindEvents() {
    // Toggle chat visibility
    this.chatButton.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
      this.chatBox.style.display = this.isOpen ? "flex" : "none";
    });

    // Close button handler
    this.chatClose.addEventListener("click", () => {
      this.isOpen = false;
      this.chatBox.style.display = "none";
    });

    // Send button + Enter key
    this.chatSend.addEventListener("click", () => this.sendMessage());
    this.chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
  }

  /** Add message instantly */
  addMessage(content, sender = "bot") {
    const div = document.createElement("div");
    div.classList.add("message", sender === "user" ? "user-message" : "bot-message");

    // ✅ Convert Markdown-style text to clean HTML (no <ul>/<li>)
    let html = content
        // Bold (**text**)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic (*text*)
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Bullet points (- or * at start of line) → "• "
        .replace(/(?:^|\n)[*-]\s+(.*)/g, "\n◉ $1")
        // Double newlines → paragraph break
        .replace(/\n{2,}/g, "<br><br>")
        // Single newline → line break
        .replace(/\n/g, "<br>");

    // Inject formatted content into a chat bubble
    div.innerHTML = `
        <div class="${sender === "user" ? "user-bubble" : "bot-bubble"}">
        ${html}
        </div>
    `;

    this.chatMessages.appendChild(div);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }



  /** Typing animation for live reply */
  async addTypingMessage(content) {
    const div = document.createElement("div");
    div.classList.add("message", "bot-message");

    const bubble = document.createElement("div");
    bubble.classList.add("bot-bubble");

    div.appendChild(bubble);
    this.chatMessages.appendChild(div);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    // ✅ Convert Markdown-style text to formatted HTML (same as addMessage)
    let html = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")   // Bold
        .replace(/\*(.*?)\*/g, "<em>$1</em>")               // Italic
        .replace(/(?:^|\n)[*-]\s+(.*)/g, "\n◉ $1")          // Bullet points → •
        .replace(/\n{2,}/g, "<br><br>")                     // Paragraphs
        .replace(/\n/g, "<br>");                            // Line breaks

    // Temporary element for measuring / typing
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Convert formatted HTML into plain text + tags so we can type gradually
    const textNodes = [];
    function extractText(node) {
        node.childNodes.forEach(n => {
        if (n.nodeType === 3) textNodes.push(n.textContent);
        else if (n.outerHTML) textNodes.push(n.outerHTML);
        });
    }
    extractText(temp);

    // Combine chunks for typing effect
    let displayed = "";
    for (let chunk of textNodes) {
        // Type slowly for text content, instantly add tags
        if (chunk.startsWith("<")) {
        displayed += chunk;
        bubble.innerHTML = displayed;
        } else {
        for (let i = 0; i < chunk.length; i++) {
            displayed += chunk[i];
            bubble.innerHTML = displayed;
            await new Promise(r => setTimeout(r, this.config.typingSpeed || 20));
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
        }
    }
    }


  /** Save message to localStorage */
  saveMessage(content, sender) {
    let messages = JSON.parse(localStorage.getItem("AIChatLiteMessages")) || [];
    messages.push({ sender, content });
    localStorage.setItem("AIChatLiteMessages", JSON.stringify(messages));

    // 🕒 update last activity
    this.updateActivity();
  }

  /** Restore chat history */
  restoreChatHistory() {
    this.session.messages.forEach((msg) => {
      this.addMessage(msg.content, msg.sender);
    });
  }

  // Load chat history + last activity timestamp
  loadSession() {
    const stored = JSON.parse(localStorage.getItem("AIChatLiteSession")) || {};
    const storedMessages = JSON.parse(localStorage.getItem("AIChatLiteMessages")) || [];
    const now = Date.now();
    const ONE_HOUR = 1000 * 60 * 60;
    let expired = false;

    // 🕒 If chat inactive for more than 1 hour → clear it
    if (stored.lastActive && now - stored.lastActive > ONE_HOUR) {
      //console.log("🕒 Chat expired, clearing old messages...");
      localStorage.removeItem("AIChatLiteMessages");
      localStorage.removeItem("AIChatLiteSession");
      expired = true;
    }

    return {
      id: stored.id || Date.now(),
      lastActive: now,
      messages: expired ? [] : storedMessages,
      expired, // 👈 flag used later to show welcome message
    };
  }


  // Update timestamp every time user interacts
  updateActivity() {
    const session = JSON.parse(localStorage.getItem("AIChatLiteSession")) || {};
    session.lastActive = Date.now();
    localStorage.setItem("AIChatLiteSession", JSON.stringify(session));
  }


  /** Send message via webhook */
  async sendMessage() {
    const text = this.chatInput.value.trim();
        if (!text) return;

        this.addMessage(text, "user");
        this.saveMessage(text, "user");
        this.chatInput.value = "";

        // Start typing animation immediately
        const typingWrapper = document.createElement("div");
        typingWrapper.classList.add("message", "bot-message");
        typingWrapper.innerHTML = `
            <div class="typing-bubble">
            <span class="typing-dots"></span>
            <span class="typing-dots"></span>
            <span class="typing-dots"></span>
            </div>`;
        this.chatMessages.appendChild(typingWrapper);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        try {
            let reply = null;
            const url = this.config.webhookUrl;

            // Detect if model value exists → treat as LLM (Ollama)
            const isLLM = !!this.config.model;

            let res, data;
            //console.log("Sending to webhook:", url, "Text:", text, "isLLM:", isLLM);
            if (isLLM) {
            // === LLM (Ollama) Integration ===
            res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                model: this.config.model,
                prompt: text,
                stream: false
                })
            });

            data = await res.json();
            reply = data.response?.trim() || data.output?.trim();
            } else {
            // === n8n or Generic API Integration ===
            res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                message: text,
                sessionId: this.session.id
                })
            });

            data = await res.json();
            reply = data.output && data.output.trim() ? data.output : null;
            }

            // Remove typing animation when reply is ready
            typingWrapper.remove();

            if (reply) {
            await this.addTypingMessage(reply);
            this.saveMessage(reply, "bot");
            } else {
            this.addMessage("🤖 Sorry, I didn’t receive a valid reply.", "bot");
            }

        } catch (err) {
            typingWrapper.remove();
            this.addMessage("⚠️ Connection error.", "bot");
            console.error("AIChatLite error:", err);
        }
    }

}

/** Initialize automatically when included */
window.addEventListener("DOMContentLoaded", () => {
  const script = document.querySelector("script[data-webhook]");
  if (script) {
    new AIChatLite({
      webhookUrl: script.dataset.webhook,
      title: script.dataset.title,
      greeting: script.dataset.greeting,
      color: script.dataset.color,
    });
  }
});
