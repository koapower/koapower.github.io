/**
 * ProjectDetailLoader - 動態載入專案詳細內容
 * 
 * 功能：
 * 1. 從URL參數獲取專案ID
 * 2. 載入對應的JSON資料
 * 3. 動態渲染頁面內容
 * 4. 處理錯誤狀態
 */
class ProjectDetailLoader {
  constructor() {
    this.projectData = null;
    this.loadingElement = document.getElementById('loading-state');
    this.errorElement = document.getElementById('error-state');
    this.contentContainer = document.getElementById('project-content');
  }

  /**
   * 初始化 - 從URL參數載入專案
   */
  async init() {
    try {
      const projectId = this.getProjectIdFromURL();
      
      if (!projectId) {
        this.showError('No project specified in URL');
        return;
      }

      await this.loadProjectData(projectId);
      this.renderProject();
      
    } catch (error) {
      console.error('Failed to load project:', error);
      this.showError('Failed to load project data');
    }
  }

  /**
   * 從URL參數獲取專案ID
   * @returns {string|null} 專案ID
   */
  getProjectIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project');
  }

  /**
   * 載入專案JSON資料
   * @param {string} projectId - 專案ID
   */
  async loadProjectData(projectId) {
    // 嘗試不同類別的專案資料夾
    const categories = ['games', 'tools', 'osu'];
    
    for (const category of categories) {
      try {
        const response = await fetch(`projects/${category}/${projectId}.json`);
        if (response.ok) {
          this.projectData = await response.json();
          return;
        }
      } catch (error) {
        // 繼續嘗試下一個類別
        continue;
      }
    }
    
    throw new Error(`Project data not found for: ${projectId}`);
  }

  /**
   * 渲染專案內容
   */
  renderProject() {
    this.hideLoading();
    this.updatePageTitle();
    
    const projectHTML = this.generateProjectHTML();
    this.contentContainer.innerHTML = projectHTML;
  }

  /**
   * 更新頁面標題
   */
  updatePageTitle() {
    if (this.projectData?.title) {
      document.title = `${this.projectData.title} - Wei Jyun Weng (Koa)`;
      const titleElement = document.getElementById('page-title');
      if (titleElement) {
        titleElement.textContent = `${this.projectData.title} - Wei Jyun Weng (Koa)`;
      }
    }
  }

  /**
   * 生成專案HTML內容
   * @returns {string} HTML字串
   */
  generateProjectHTML() {
    const data = this.projectData;
    
    return `
      <!-- 返回按鈕 -->
      <div class="project-nav">
        <a href="index.html" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="back-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Portfolio
        </a>
      </div>

      ${this.generateHeroSection()}
      ${this.generateHeaderSection()}
      ${this.generateContentSections()}
      ${this.generateNavigationSection()}
    `;
  }

  /**
   * 生成主要圖片區域
   * @returns {string} HTML字串
   */
  generateHeroSection() {
    const { heroImage } = this.projectData;
    
    if (!heroImage) return '';

    return `
      <section class="project-hero-media">
        <img src="${heroImage.src}" alt="${heroImage.alt || 'Project Screenshot'}" class="project-hero-image">
        ${heroImage.caption ? `<p class="media-caption">${heroImage.caption}</p>` : ''}
      </section>
    `;
  }

  /**
   * 生成標題區域
   * @returns {string} HTML字串
   */
  generateHeaderSection() {
    const { title, subtitle, tags = [], links = [] } = this.projectData;

    return `
      <header class="project-header">
        <h1 class="project-title">${title}</h1>
        ${subtitle ? `<p class="project-subtitle">${subtitle}</p>` : ''}
        
        <div class="project-meta">
          ${this.generateTags(tags)}
          ${this.generateLinks(links)}
        </div>
      </header>
    `;
  }

  /**
   * 生成標籤
   * @param {Array} tags - 標籤陣列
   * @returns {string} HTML字串
   */
  generateTags(tags) {
    if (!tags || tags.length === 0) return '';

    const tagElements = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    return `
      <div class="project-tags">
        ${tagElements}
      </div>
    `;
  }

  /**
   * 生成連結
   * @param {Array} links - 連結陣列
   * @returns {string} HTML字串
   */
  generateLinks(links) {
    if (!links || links.length === 0) return '';

    const linkElements = links.map(link => `
      <a href="${link.url}" class="project-link" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="link-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
        ${link.title}
      </a>
    `).join('');

    return `
      <div class="project-links">
        ${linkElements}
      </div>
    `;
  }

  /**
   * 生成內容區域
   * @returns {string} HTML字串
   */
  generateContentSections() {
    const { sections = [] } = this.projectData;

    if (sections.length === 0) return '';

    const sectionElements = sections.map(section => {
      return this.generateSection(section);
    }).join('');

    return `
      <article class="project-content">
        ${sectionElements}
      </article>
    `;
  }

  /**
   * 生成單一區域內容
   * @param {Object} section - 區域資料
   * @returns {string} HTML字串
   */
  generateSection(section) {
    const { type, title, content, items, features, challenges, images } = section;

    switch (type) {
      case 'overview':
        return this.generateOverviewSection(title, content);
      
      case 'technologies':
        return this.generateTechnologiesSection(title, items);
      
      case 'features':
        return this.generateFeaturesSection(title, features);
      
      case 'development':
        return this.generateDevelopmentSection(title, content, images);
      
      case 'challenges':
        return this.generateChallengesSection(title, challenges);
      
      case 'learning':
        return this.generateLearningSection(title, items);
      
      default:
        return this.generateDefaultSection(title, content);
    }
  }

  /**
   * 生成概述區域
   */
  generateOverviewSection(title, content) {
    const contentHTML = Array.isArray(content) 
      ? content.map(p => `<p>${p}</p>`).join('')
      : `<p>${content}</p>`;

    return `
      <section class="project-section">
        <h2>${title}</h2>
        ${contentHTML}
      </section>
    `;
  }

  /**
   * 生成技術區域
   */
  generateTechnologiesSection(title, items) {
    if (!items || items.length === 0) return '';

    const listItems = items.map(item => 
      `<li><strong>${item.name}</strong> - ${item.description}</li>`
    ).join('');

    return `
      <section class="project-section">
        <h2>${title}</h2>
        <ul>
          ${listItems}
        </ul>
      </section>
    `;
  }

  /**
   * 生成功能特色區域
   */
  generateFeaturesSection(title, features) {
    if (!features || features.length === 0) return '';

    const featureItems = features.map(feature => `
      <div class="feature-item">
        <h3>${feature.name}</h3>
        <p>${feature.description}</p>
      </div>
    `).join('');

    return `
      <section class="project-section">
        <h2>${title}</h2>
        <div class="feature-list">
          ${featureItems}
        </div>
      </section>
    `;
  }

  /**
   * 生成開發過程區域
   */
  generateDevelopmentSection(title, content, images) {
    const contentHTML = Array.isArray(content) 
      ? content.map(p => `<p>${p}</p>`).join('')
      : `<p>${content}</p>`;

    const imagesHTML = images && images.length > 0 
      ? `<div class="process-images">
          ${images.map(img => `<img src="${img.src}" alt="${img.alt}" class="process-image">`).join('')}
        </div>`
      : '';

    return `
      <section class="project-section">
        <h2>${title}</h2>
        ${contentHTML}
        ${imagesHTML}
      </section>
    `;
  }

  /**
   * 生成挑戰與解決方案區域
   */
  generateChallengesSection(title, challenges) {
    if (!challenges || challenges.length === 0) return '';

    const challengeItems = challenges.map(challenge => `
      <div class="challenge-item">
        <h3>${challenge.title}</h3>
        <p>${challenge.problem}</p>
        <p><strong>Solution:</strong> ${challenge.solution}</p>
      </div>
    `).join('');

    return `
      <section class="project-section">
        <h2>${title}</h2>
        ${challengeItems}
      </section>
    `;
  }

  /**
   * 生成學習成果區域
   */
  generateLearningSection(title, items) {
    if (!items || items.length === 0) return '';

    const listItems = items.map(item => `<li>${item}</li>`).join('');

    return `
      <section class="project-section">
        <h2>${title}</h2>
        <ul>
          ${listItems}
        </ul>
      </section>
    `;
  }

  /**
   * 生成預設區域（通用格式）
   */
  generateDefaultSection(title, content) {
    const contentHTML = Array.isArray(content) 
      ? content.map(p => `<p>${p}</p>`).join('')
      : `<p>${content}</p>`;

    return `
      <section class="project-section">
        <h2>${title}</h2>
        ${contentHTML}
      </section>
    `;
  }

  /**
   * 生成導航區域
   */
  generateNavigationSection() {
    return `
      <nav class="project-navigation">
        <a href="index.html" class="nav-home">
          <span class="nav-label">Back to</span>
          <span class="nav-title">Portfolio</span>
        </a>
      </nav>
    `;
  }

  /**
   * 隱藏載入狀態
   */
  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  /**
   * 顯示錯誤狀態
   * @param {string} message - 錯誤訊息
   */
  showError(message) {
    console.error(message);
    
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
    
    if (this.errorElement) {
      this.errorElement.style.display = 'block';
      const errorMessage = this.errorElement.querySelector('p');
      if (errorMessage) {
        errorMessage.textContent = message;
      }
    }
  }
}

// 當頁面載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ProjectDetailLoader();
  loader.init();
});