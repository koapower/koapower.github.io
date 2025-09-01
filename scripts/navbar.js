// 動態載入導航欄功能
class Navbar {
  constructor() {
    this.isMenuOpen = false;
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
      
      // 創建覆蓋層 (手機版用)
      this.createOverlay();
      
      this.setupResumeLink();
      this.setupContactLink();
      this.setupHamburgerMenu();
      this.setupNavigationEvents();
      
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

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'nav-overlay';
    overlay.addEventListener('click', () => this.closeMenu());
    document.body.appendChild(overlay);
  }

  setupHamburgerMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        this.toggleMenu();
      });
    }
  }

  setupNavigationEvents() {
    // 為導航項目添加點擊事件 (關閉menu)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // 監聽視窗大小變化，在桌面版時自動關閉menu
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    
    hamburger?.classList.add('active');
    navMenu?.classList.add('active');
    overlay?.classList.add('active');
    
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
    this.isMenuOpen = true;
  }

  closeMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    overlay?.classList.remove('active');
    
    // 恢復背景滾動
    document.body.style.overflow = '';
    this.isMenuOpen = false;
  }
}

// 頁面載入完成後初始化導航欄
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});