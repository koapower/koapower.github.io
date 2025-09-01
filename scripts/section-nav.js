import { ContentLoader } from './modules/ContentLoader.js';
import { NavigationController } from './modules/NavigationController.js';
import { ScrollManager } from './modules/ScrollManager.js';
import { URLHandler } from './modules/URLHandler.js';
import { PortfolioEventHandler } from './modules/PortfolioEventHandler.js';

class SectionNavigation {
    constructor() {
        this.contentLoader = new ContentLoader();
        this.portfolioEventHandler = new PortfolioEventHandler();
        
        // 設置內容載入完成的回調
        this.contentLoader.setContentLoadedCallback((container) => {
            this.portfolioEventHandler.attachToContainer(container);
        });
        
        // 創建導航控制器
        this.navigationController = new NavigationController(
            this.contentLoader, 
            null // ScrollManager 會在後面創建
        );
        
        // 創建滾動管理器
        this.scrollManager = new ScrollManager(this.navigationController);
        
        // 創建URL處理器
        this.urlHandler = new URLHandler(this.navigationController, this.contentLoader);
    }

    async initialize() {
        try {
            // 初始化所有內容
            await this.contentLoader.initializeAllSections();
            console.log('Section Navigation initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Section Navigation:', error);
        }
    }
}

// 主入口點
document.addEventListener('DOMContentLoaded', async function() {
    const sectionNavigation = new SectionNavigation();
    await sectionNavigation.initialize();
});