interface MimeTypes {
    [key: string]: string;
}

class TableFunctions {
    private tableElement: HTMLElement;
    private search: HTMLInputElement | null;
    private tableRows: NodeListOf<HTMLTableRowElement>;
    private tableHeadings: NodeListOf<HTMLTableHeaderCellElement>;

    constructor(tableId: string = 'data_table') {
        this.tableElement = document.getElementById(tableId) as HTMLElement;
        this.search = this.tableElement.querySelector('[data-tblaction="search"]');
        this.tableRows = this.tableElement.querySelectorAll('tbody tr');
        this.tableHeadings = this.tableElement.querySelectorAll('thead th');
        this.initialize();
    }

    private initialize(): void {
        // Add event listeners
        this.addSearchListener();
        this.addSortListeners();
        this.addExportListeners();
    }

    private addSearchListener(): void {
        if (this.search) {
            this.search.addEventListener('input', () => this.searchTable());
        }
    }

    private addSortListeners(): void {
        this.tableHeadings.forEach((head, i) => {
            let sortAsc = true;
            head.addEventListener('click', () => {
                this.tableHeadings.forEach(h => h.classList.remove('active'));
                head.classList.add('active');

                this.tableElement.querySelectorAll('td').forEach(td => td.classList.remove('active'));
                this.tableRows.forEach(row => {
                    row.querySelectorAll('td')[i].classList.add('active');
                });

                head.classList.toggle('asc', sortAsc);
                sortAsc = head.classList.contains('asc') ? false : true;

                this.sortTable(i, sortAsc);
            });
        });
    }

    private addExportListeners(): void {
        this.tableElement.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const action = target.closest('[data-tblaction]')?.getAttribute('data-tblaction');

            if (!action) return;

            switch (action) {
                case 'export-pdf':
                    this.toPDF(this.tableElement);
                    break;
                case 'export-json':
                    this.downloadJSON(this.tableElement);
                    break;
                case 'export-csv':
                    this.downloadCSV(this.tableElement);
                    break;
                case 'export-excel':
                    this.downloadEXCEL(this.tableElement);
                    break;
            }
        });
    }

    private refreshSearchTable(): void {
        this.search = this.tableElement.querySelector('[data-tblaction="search"]');
        this.tableRows = this.tableElement.querySelectorAll('tbody tr');
        this.tableHeadings = this.tableElement.querySelectorAll('thead th');
    }

    private searchTable(): void {
        this.refreshSearchTable();
        this.tableRows.forEach((row, i) => {
            const tableData = row.textContent?.toLowerCase() || '';
            const searchData = this.search?.value.toLowerCase() || '';

            row.classList.toggle('hide', tableData.indexOf(searchData) < 0);
            if (row.classList.contains('hide')) {
                row.style.height = "1px";
                row.style.overflow = "hidden";
            }
            row.style.setProperty('--delay', `${i / 25}s`);
        });
    }

    private sortTable(column: number, sortAsc: boolean): void {
        this.refreshSearchTable();
        const tbody = this.tableElement.querySelector('tbody');
        if (!tbody) return;

        [...this.tableRows]
            .sort((a, b) => {
                const firstRow = a.querySelectorAll('td')[column].textContent?.toLowerCase() || '';
                const secondRow = b.querySelectorAll('td')[column].textContent?.toLowerCase() || '';
                return sortAsc ? (firstRow < secondRow ? 1 : -1) : (firstRow < secondRow ? -1 : 1);
            })
            .forEach(sortedRow => tbody.appendChild(sortedRow));
    }

    private toPDF(dataTable: HTMLElement): void {
        setTimeout(() => {
            const htmlCode = `
                <!DOCTYPE html>
                <link rel="stylesheet" href="/static/fontawesome/css/all.min.css">
                <link rel="stylesheet" href="/static/dist/bundle.css">
                <main class="table" id="data_table">${dataTable.innerHTML}</main>`;

            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(htmlCode);
                newWindow.document.close();
                newWindow.print();
            }
        }, 500);
    }

    private toJSON(table: HTMLElement): string {
        const tableData: any[] = [];
        const tHead: string[] = [];
        const tHeadings = table.querySelectorAll('th');
        const tRows = table.querySelectorAll('tbody tr');

        tHeadings.forEach(heading => {
            const actualHead = heading.textContent?.trim().split(' ') || [];
            tHead.push(actualHead.splice(0, actualHead.length - 1).join(' ').toLowerCase());
        });

        tRows.forEach(row => {
            const rowObject: { [key: string]: string } = {};
            const tCells = row.querySelectorAll('td');

            tCells.forEach((tCell, cellIndex) => {
                const img = tCell.querySelector('img');
                if (img) {
                    rowObject['image'] = decodeURIComponent(img.src);
                }
                rowObject[tHead[cellIndex]] = tCell.textContent?.trim() || '';
            });
            tableData.push(rowObject);
        });

        return JSON.stringify(tableData, null, 4);
    }

    private downloadJSON(dataTable: HTMLElement): void {
        const json = this.toJSON(dataTable);
        this.downloadFile(json, 'json');
    }

    private toCSV(table: HTMLElement): string {
        const tHeads = table.querySelectorAll('th');
        const tbodyRows = table.querySelectorAll('tbody tr');

        const headings = [...tHeads]
            .map(head => {
                const actualHead = head.textContent?.trim().split(' ') || [];
                return actualHead.splice(0, actualHead.length - 1).join(' ').toLowerCase();
            })
            .join(',') + ',image name';

        const tableData = [...tbodyRows]
            .map(row => {
                const cells = row.querySelectorAll('td');
                const img = row.querySelector('img');
                const imgSrc = img ? decodeURIComponent(img.src) : '';
                const dataWithoutImg = [...cells]
                    .map(cell => cell.textContent?.replace(/,/g, ".").trim() || '')
                    .join(',');

                return `${dataWithoutImg},${imgSrc}`;
            })
            .join('\n');

        return `${headings}\n${tableData}`;
    }

    private downloadCSV(dataTable: HTMLElement): void {
        const csv = this.toCSV(dataTable);
        this.downloadFile(csv, 'csv', 'data');
    }

    private toExcel(table: HTMLElement): string {
        const tHeads = table.querySelectorAll('th');
        const tbodyRows = table.querySelectorAll('tbody tr');

        const headings = [...tHeads]
            .map(head => {
                const actualHead = head.textContent?.trim().split(' ') || [];
                return actualHead.splice(0, actualHead.length - 1).join(' ').toLowerCase();
            })
            .join('\t') + '\t' + 'image name';

        const tableData = [...tbodyRows]
            .map(row => {
                const cells = row.querySelectorAll('td');
                const img = row.querySelector('img');
                const imgSrc = img ? decodeURIComponent(img.src) : '';
                const dataWithoutImg = [...cells]
                    .map(cell => cell.textContent?.trim() || '')
                    .join('\t');

                return `${dataWithoutImg}\t${imgSrc}`;
            })
            .join('\n');

        return `${headings}\n${tableData}`;
    }

    private downloadEXCEL(dataTable: HTMLElement, filename: string = "data"): void {
        const excelData = this.toExcel(dataTable);
        const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.xls`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    private downloadFile(data: string, fileType: string, fileName: string = ''): void {
        const mimeTypes: MimeTypes = {
            'json': 'application/json',
            'csv': 'text/csv',
            'xls': 'application/vnd.ms-excel'
        };
        
        const blob = new Blob([data], { type: mimeTypes[fileType] });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `export.${fileType}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TableFunctions();
});

export default TableFunctions; 