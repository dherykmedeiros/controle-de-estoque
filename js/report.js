import { isAuthenticated } from './auth.js';

if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.getElementById('generate-report');
    const generateXlsxButton = document.getElementById('generate-xlsx');
    const reportOutput = document.getElementById('report-output');
    const daysFilter = document.getElementById('days-filter');

    generateReportButton.addEventListener('click', () => {
        const days = parseInt(daysFilter.value, 10);
        generateReport(days);
    });

    generateXlsxButton.addEventListener('click', () => {
        const days = parseInt(daysFilter.value, 10);
        generateXlsxReport(days);
    });

    const generateReport = (days) => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const reportData = products.filter(product => {
            const expiryDate = new Date(product.expiry);
            return expiryDate <= futureDate && expiryDate >= new Date(today);
        });

        reportOutput.innerHTML = '';

        if (reportData.length > 0) {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headers = ['Nome', 'Categoria', 'Validade', 'Quantidade', 'Lote', 'Fornecedor', 'Ações'];
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            reportData.forEach(product => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                const categoryCell = document.createElement('td');
                categoryCell.textContent = product.category;
                row.appendChild(categoryCell);

                const expiryCell = document.createElement('td');
                expiryCell.textContent = product.expiry;
                row.appendChild(expiryCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = product.quantity;
                row.appendChild(quantityCell);

                const lotCell = document.createElement('td');
                lotCell.textContent = product.lot;
                row.appendChild(lotCell);

                const supplierCell = document.createElement('td');
                supplierCell.textContent = product.supplier;
                row.appendChild(supplierCell);

                const actionsCell = document.createElement('td');
                actionsCell.textContent = product.actions;
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            reportOutput.appendChild(table);
        } else {
            reportOutput.textContent = 'Nenhum produto próximo da validade nos próximos ' + days + ' dias.';
        }
    };

    const generateXlsxReport = (days) => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const reportData = products.filter(product => {
            const expiryDate = new Date(product.expiry);
            return expiryDate <= futureDate && expiryDate >= new Date(today);
        });

        if (reportData.length > 0) {
            const worksheetData = [['Nome', 'Categoria', 'Validade', 'Quantidade', 'Lote', 'Fornecedor', 'Ações']];
            reportData.forEach(product => {
                worksheetData.push([product.name, product.category, product.expiry, product.quantity, product.lot, product.supplier, product.actions]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
            XLSX.writeFile(workbook, 'relatorio.xlsx');
        } else {
            alert('Nenhum produto próximo da validade nos próximos ' + days + ' dias.');
        }
    };
});
