import TableFunctions from './table-functions';

// Initialize all modules
const initializeModules = () => {
    // Initialize table functions if table exists
    const dataTable = document.getElementById('data_table');
    if (dataTable) {
        new TableFunctions();
    }
};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeModules); 