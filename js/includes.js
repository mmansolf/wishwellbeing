document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with the data-include attribute
    const includes = document.querySelectorAll('[data-include]');
    
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
                // Replace the placeholder with the actual content
                element.innerHTML = html;
                
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
            })
            .catch(error => {
                console.error('Error loading component:', error);
                element.innerHTML = `<p>Error loading component: ${file}</p>`;
            });
    });
});