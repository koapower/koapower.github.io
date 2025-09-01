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
        const projectTitle = item.querySelector('.portfolio-title')?.textContent || 'Unknown Project';
        
        // 临时的项目详情显示 - 可以后续扩展为模态窗口或页面跳转
        this.showTemporaryAlert(projectTitle);
        
        // 可以在此处添加更复杂的项目详情展示逻辑
        // 例如: this.openProjectModal(projectId);
        // 或者: window.location.href = `/projects/${projectId}`;
    }

    showTemporaryAlert(projectTitle) {
        alert(`Opening details for: ${projectTitle}\n\nThis feature will be implemented soon!`);
    }

    // 未来可以扩展的方法
    openProjectModal(projectId) {
        // 模态窗口逻辑
        console.log(`Opening modal for project: ${projectId}`);
    }

    navigateToProjectPage(projectId) {
        // 页面跳转逻辑
        window.location.href = `/projects/${projectId}`;
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