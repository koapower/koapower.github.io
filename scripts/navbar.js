// 動態載入導航欄功能
class Navbar {
  constructor() {
    this.loadNavbar();
  }

  async loadNavbar() {
    try {
      const response = await fetch('components/navbar.html');
      const navbarHTML = await response.text();
      
      // 創建導航欄容器並插入到頁面頂部
      const navbarContainer = document.createElement('div');
      navbarContainer.innerHTML = navbarHTML;
      document.body.insertBefore(navbarContainer.firstElementChild, document.body.firstChild);
      
      this.setupResumeLink();
      this.setupContactLink();
      
      // 為頁面主要內容添加上邊距，避免被固定導航欄遮蓋
      this.adjustBodyPadding();
      
    } catch (error) {
      console.error('載入導航欄失敗:', error);
    }
  }

  setupResumeLink() {
    const resumeLink = document.getElementById('resume-link');
    if (resumeLink) {
      resumeLink.href = 'assets/Koa_Resume.pdf';
      resumeLink.target = '_blank';
    }
  }

  setupContactLink() {
    const contactLink = document.getElementById('contact-link');
    if (contactLink) {
      contactLink.href = 'mailto:koaweng1@gmail.com';
      contactLink.target = '_blank';
    }
  }

  adjustBodyPadding() {
    // 為頁面內容添加上邊距，避免被導航欄遮蓋
    document.body.style.paddingTop = '70px';
  }
}

// 頁面載入完成後初始化導航欄
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});