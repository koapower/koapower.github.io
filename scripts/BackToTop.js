/**
 * BackToTop - 獨立的返回頂部按鈕組件
 * 可在任何頁面重複使用
 */
export class BackToTop {
    constructor(options = {}) {
        this.options = {
            // 顯示按鈕的滾動閾值 (px)
            showThreshold: 300,
            // 按鈕文字或 HTML
            buttonText: '↑',
            // 按鈕位置
            position: {
                bottom: '30px',
                right: '30px'
            },
            // 平滑滾動持續時間 (ms)
            scrollDuration: 600,
            // CSS 類別前綴
            classPrefix: 'back-to-top',
            // 是否自動插入 CSS
            autoInjectCSS: true,
            // 自定義 CSS 類別
            customClass: '',
            ...options
        };
        
        this.button = null;
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.createButton();
        this.attachEventListeners();
        if (this.options.autoInjectCSS) {
            this.injectCSS();
        }
        this.updateButtonVisibility();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.className = `${this.options.classPrefix}-button ${this.options.customClass}`.trim();
        this.button.innerHTML = this.options.buttonText;
        this.button.setAttribute('aria-label', 'Back to top');
        this.button.setAttribute('title', 'Back to top');
        
        // 設置初始樣式
        Object.assign(this.button.style, {
            position: 'fixed',
            bottom: this.options.position.bottom,
            right: this.options.position.right,
            zIndex: '9999'
        });
        
        document.body.appendChild(this.button);
    }

    attachEventListeners() {
        // 按鈕點擊事件
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });

        // 鍵盤支援
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });

        // 滾動事件監聽
        window.addEventListener('scroll', () => {
            this.throttledUpdateVisibility();
        });

        // 視窗大小變化時重新計算位置
        window.addEventListener('resize', () => {
            this.updateButtonVisibility();
        });
    }

    // 節流函數，避免滾動時過度觸發
    throttledUpdateVisibility = this.throttle(() => {
        this.updateButtonVisibility();
    }, 100);

    updateButtonVisibility() {
        if (!this.button) return;
        
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const shouldShow = scrollY > this.options.showThreshold;
        
        if (shouldShow) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const startY = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.options.scrollDuration, 1);
            
            // 使用 easeOutQuart 緩動函數
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentY = startY * (1 - easeOutQuart);
            
            window.scrollTo(0, currentY);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.isScrolling = false;
            }
        };
        
        requestAnimationFrame(animateScroll);
    }

    // 工具函數：節流
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    injectCSS() {
        if (document.getElementById(`${this.options.classPrefix}-styles`)) {
            return; // CSS already injected
        }

        const style = document.createElement('style');
        style.id = `${this.options.classPrefix}-styles`;
        style.textContent = `
            .${this.options.classPrefix}-button {
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 50%;
                background: #333;
                color: white;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
            }
            
            .${this.options.classPrefix}-button:hover {
                background: #555;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
            }
            
            .${this.options.classPrefix}-button:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            .${this.options.classPrefix}-button.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .${this.options.classPrefix}-button:focus {
                outline: 2px solid #4a9eff;
                outline-offset: 2px;
            }
            
            @media (max-width: 768px) {
                .${this.options.classPrefix}-button {
                    width: 45px;
                    height: 45px;
                    font-size: 16px;
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // 公共方法
    show() {
        if (this.button) {
            this.button.classList.add('visible');
        }
    }

    hide() {
        if (this.button) {
            this.button.classList.remove('visible');
        }
    }

    destroy() {
        if (this.button) {
            this.button.remove();
            this.button = null;
        }
        
        // 移除 CSS（如果沒有其他實例在使用）
        const styleElement = document.getElementById(`${this.options.classPrefix}-styles`);
        if (styleElement) {
            styleElement.remove();
        }
        
        window.removeEventListener('scroll', this.throttledUpdateVisibility);
        window.removeEventListener('resize', this.updateButtonVisibility);
    }

    // 更新配置
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        if (this.button) {
            this.button.innerHTML = this.options.buttonText;
            Object.assign(this.button.style, {
                bottom: this.options.position.bottom,
                right: this.options.position.right
            });
        }
    }
}

// 便利的初始化函數
export function initBackToTop(options) {
    return new BackToTop(options);
}

// 如果不使用模組，也可以直接在 HTML 中使用
if (typeof window !== 'undefined') {
    window.BackToTop = BackToTop;
    window.initBackToTop = initBackToTop;
}

// --- Self-initialization for this specific project ---
// This makes the script "plug-and-play" by simply including it.
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop({
        showThreshold: 200,
        buttonText: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>`,
        position: {
          bottom: '30px',
          right: '30px'
        }
      });
});