const footerLinksLeft = ["关于 Google", "广告", "商务", "Google 搜索的运作方式"];
const footerLinksRight = ["隐私权", "条款", "设置"];

function createIcon(className, markup) {
  const wrapper = document.createElement("span");
  wrapper.className = className;
  wrapper.innerHTML = markup;
  return wrapper;
}

function renderApp() {
  const app = document.querySelector("#app");

  const shell = document.createElement("main");
  shell.className = "page-shell";

  shell.innerHTML = `
    <div class="page-frame">
      <header class="topbar">
        <nav class="top-links" aria-label="快捷入口">
          <a href="#" class="top-link">Gmail</a>
          <a href="#" class="top-link">图片</a>
        </nav>
        <button class="apps-button" type="button" aria-label="Google 应用">
          <span class="apps-grid" aria-hidden="true"></span>
        </button>
        <button class="account-button" type="button" aria-label="Google 账号">
          <img src="./assets/account-avatar.png" alt="" />
        </button>
      </header>

      <section class="hero" aria-label="Google 搜索">
        <img class="google-logo" src="./assets/google-logo.png" alt="Google" />
        <div class="search-shell">
          <button class="search-left-button" type="button" aria-label="添加">
            <span class="search-plus" aria-hidden="true"></span>
          </button>
          <div class="search-divider" aria-hidden="true"></div>
          <div class="search-input" aria-hidden="true"></div>
          <div class="search-tools">
            <button class="tool-button" type="button" aria-label="语音搜索"></button>
            <button class="tool-button" type="button" aria-label="以图搜图"></button>
            <button class="ai-button" type="button" aria-label="AI 模式">
              <span class="ai-icon" aria-hidden="true"></span>
              <span class="ai-label">AI 模式</span>
            </button>
          </div>
        </div>
        <div class="hero-actions">
          <button type="button" class="action-button">Google 搜索</button>
          <button type="button" class="action-button">手气不错</button>
        </div>
        <p class="language-row">
          <span class="language-label">Google 提供:</span>
          <a href="#" class="language-link">繁體中文</a>
          <a href="#" class="language-link">English</a>
        </p>
      </section>

      <footer class="footer">
        <div class="footer-region">香港</div>
        <div class="footer-links">
          <div class="footer-links-left"></div>
          <div class="footer-links-right"></div>
        </div>
      </footer>
    </div>
  `;

  const toolButtons = shell.querySelectorAll(".tool-button");
  toolButtons[0].append(
    createIcon(
      "tool-icon tool-mic",
      `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 15.4a3.7 3.7 0 0 0 3.7-3.7V7.4A3.7 3.7 0 0 0 12 3.7a3.7 3.7 0 0 0-3.7 3.7v4.3a3.7 3.7 0 0 0 3.7 3.7Z"></path>
          <path d="M18.2 11.6a6.2 6.2 0 0 1-12.4 0"></path>
          <path d="M12 17.8v3.1"></path>
        </svg>
      `,
    ),
  );
  toolButtons[1].append(
    createIcon(
      "tool-icon tool-lens",
      `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5.4" y="5.6" width="13.2" height="10.4" rx="2.4"></rect>
          <circle cx="12" cy="10.8" r="2.2"></circle>
          <path d="M12 4.1v3"></path>
          <path d="M12 17.9v2"></path>
          <path d="M4 10.8h3"></path>
          <path d="M17 10.8h3"></path>
        </svg>
      `,
    ),
  );

  const aiIcon = shell.querySelector(".ai-icon");
  aiIcon.append(
    createIcon(
      "tool-icon tool-ai",
      `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.5 4.2c-.7 2.3-2 3.6-4.3 4.3 2.3.7 3.6 2 4.3 4.3.7-2.3 2-3.6 4.3-4.3-2.3-.7-3.6-2-4.3-4.3Z"></path>
          <path d="m10.4 10.6 7.1 7.1"></path>
          <path d="M8.2 18.5a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Z"></path>
        </svg>
      `,
    ),
  );

  const leftLinks = shell.querySelector(".footer-links-left");
  footerLinksLeft.forEach((label) => {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "footer-link";
    link.textContent = label;
    leftLinks.append(link);
  });

  const rightLinks = shell.querySelector(".footer-links-right");
  footerLinksRight.forEach((label) => {
    const link = document.createElement("a");
    link.href = "#";
    link.className = "footer-link";
    link.textContent = label;
    rightLinks.append(link);
  });

  app.append(shell);
}

renderApp();
