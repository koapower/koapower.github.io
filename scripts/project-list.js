// This script is a module and will be deferred by default, so it runs after the DOM is parsed.
const container = document.getElementById('project-list-container');

if (container) {
    fetch('config/projects-config.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const nav = document.createElement('nav');
            nav.id = 'project-list-nav';
            nav.className = 'project-list-nav';

            let htmlContent = '';
            data.categories.forEach(category => {
                htmlContent += `<h2>${category.name}</h2>`;
                htmlContent += '<ul>';
                category.projects.forEach(project => {
                    htmlContent += `<li><a href="${project.url}">${project.name}</a></li>`;
                });
                htmlContent += '</ul>';
            });

            nav.innerHTML = htmlContent;
            container.innerHTML = ''; // Clear container before appending
            container.appendChild(nav);
        })
        .catch(error => {
            console.error('Error loading project list:', error);
            container.innerHTML = '<p style="color: red; padding: 1rem;">Error loading project list.</p>';
        });
} else {
    console.error('Project list container not found.');
}