export class PortfolioEventHandler {
    constructor() {
        // Portfolio项目点击处理不需要其他依赖
    }

    attachPortfolioListeners(container) {
        const portfolioItems = container.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            this.attachItemListeners(item, container);
        });
    }

    attachItemListeners(item, container) {
        const newItem = this.replaceItemToAvoidDuplicates(item, container);
        
        newItem.addEventListener('click', (e) => {
            this.handleItemClick(e, newItem);
        });
        
        newItem.addEventListener('keydown', (e) => {
            this.handleItemKeydown(e, newItem);
        });
    }

    replaceItemToAvoidDuplicates(item, container) {
        item.replaceWith(item.cloneNode(true));
        return container.querySelector(`[data-project="${item.getAttribute('data-project')}"]`) || item;
    }

    handleItemClick(e, item) {
        const projectId = item.getAttribute('data-project');
        
        console.log(`Clicked on project: ${projectId}`);
        
        this.showProjectDetails(item, projectId);
    }

    handleItemKeydown(e, item) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    }

    showProjectDetails(item, projectId) {
        // 跳轉到動態專案詳細頁面
        window.location.href = `project-detail.html?project=${projectId}`;
    }


    // 公共方法供外部调用
    attachToContainer(container) {
        this.attachPortfolioListeners(container);
    }

    // 批量处理多个容器
    attachToMultipleContainers(containers) {
        containers.forEach(container => {
            this.attachPortfolioListeners(container);
        });
    }

    // 检查容器中是否有portfolio项目
    hasPortfolioItems(container) {
        return container.querySelectorAll('.portfolio-item').length > 0;
    }
}