document.addEventListener('DOMContentLoaded', function() {
    // Function to handle component inclusion
    function processIncludes() {
        // Find all elements with the data-include attribute
        const includes = document.querySelectorAll('[data-include]');
        let totalComponents = includes.length;
        let loadedComponents = 0;
        
        // Process each include element
        includes.forEach(function(element) {
            const file = element.getAttribute('data-include');
            
            // Fetch the content of the include file
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${file}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Check if this element has any data attributes for customization
                    const dataAttributes = Array.from(element.attributes)
                        .filter(attr => attr.name.startsWith('data-') && attr.name !== 'data-include');
                    
                    // If there are data attributes for customization, replace placeholders
                    if (dataAttributes.length > 0) {
                        // Replace placeholders in the HTML with data attribute values
                        dataAttributes.forEach(attr => {
                            const placeholder = `{{${attr.name.replace('data-', '')}}}`;
                            const value = attr.value;
                            html = html.replace(new RegExp(placeholder, 'g'), value);
                        });
                    }
                    
                    // Replace the placeholder with the actual content
                    element.innerHTML = html;
                    
                    // Store original attributes on the root element for reference
                    dataAttributes.forEach(attr => {
                        element.firstElementChild?.setAttribute(`original-${attr.name}`, attr.value);
                    });
                    
                    // Optional: Execute any scripts that might be in the included HTML
                    element.querySelectorAll('script').forEach(function(script) {
                        const newScript = document.createElement('script');
                        
                        // Copy all attributes from the original script
                        Array.from(script.attributes).forEach(attr => {
                            newScript.setAttribute(attr.name, attr.value);
                        });
                        
                        // Copy the content of the script
                        newScript.textContent = script.textContent;
                        
                        // Replace the original script with the new one to execute it
                        script.parentNode.replaceChild(newScript, script);
                    });
                    
                    // Track loaded components
                    loadedComponents++;
                    
                    // If all components are loaded, trigger the onAllComponentsLoaded event
                    if (loadedComponents === totalComponents) {
                        // Create and dispatch a custom event when all components are loaded
                        const event = new CustomEvent('allComponentsLoaded');
                        document.dispatchEvent(event);
                        
                        // Process the table of contents if it exists
                        processTOC();
                    }
                })
                .catch(error => {
                    console.error('Error loading component:', error);
                    element.innerHTML = `<p>Error loading component: ${file}</p>`;
                    
                    // Still count failed loads toward the total
                    loadedComponents++;
                    if (loadedComponents === totalComponents) {
                        const event = new CustomEvent('allComponentsLoaded');
                        document.dispatchEvent(event);
                        processTOC();
                    }
                });
        });
        
        // If there are no includes, trigger the event immediately
        if (totalComponents === 0) {
            const event = new CustomEvent('allComponentsLoaded');
            document.dispatchEvent(event);
            processTOC();
        }
    }
    
    // Function to process the table of contents
    function processTOC() {
        const tocElements = document.querySelectorAll('.table-of-contents');
        if (tocElements.length === 0) return;
        
        // Find all content headers on the page
        const contentHeaders = document.querySelectorAll('.content-header');
        
        // Build TOC for each TOC element
        tocElements.forEach(toc => {
            if (contentHeaders.length === 0) {
                toc.innerHTML = '<p>No sections found</p>';
                return;
            }
            
            const tocList = document.createElement('ul');
            tocList.className = 'toc-list';
            
            contentHeaders.forEach((header, index) => {
                // Get the title from the header
                const titleElement = header.querySelector('.content-title');
                if (!titleElement) return;
                
                const title = titleElement.textContent;
                
                // Create or ensure the header has an ID
                const headerId = header.id || `section-${index}`;
                header.id = headerId;
                
                // Create a list item for this header
                const listItem = document.createElement('li');
                listItem.className = 'toc-item';
                
                const link = document.createElement('a');
                link.href = `#${headerId}`;
                link.textContent = title;
                link.className = 'toc-link';
                
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
            
            toc.innerHTML = '';
            toc.appendChild(tocList);
        });
    }
    
    // Start processing includes
    processIncludes();
});
