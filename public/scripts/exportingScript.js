import xmlbuilder from "xmlbuilder";

function exportToCSV(id) {
    const chartCanvas = document.getElementById('mostRatedBooks');
    const chart = Chart.getChart(chartCanvas);
    if (chart) {
        const labels = chart.data.labels || [];
        const datasets = chart.data.datasets || [];

        const csvContent = 'data:text/csv;charset=utf-8,' + generateCSVContent(labels, datasets);

        const link = document.createElement('a');
        link.href = encodeURI(csvContent);
        link.download = `${id}.csv`;
        link.click();
    }
}

function generateCSVContent(labels, datasets) {
    let csvContent = '';

    const header = ['Title', ...datasets.map(dataset => dataset.label)];
    csvContent += header.join(',') + '\n';

    for (let i = 0; i < labels.length; i++) {
        const row = [labels[i], ...datasets.map(dataset => dataset.data[i])];
        csvContent += row.join(',') + '\n';
    }

    return csvContent;
}

function exportToDocBook(id){
    const chartCanvas = document.getElementById(id);
    const chart = Chart.getChart(chartCanvas);
    if (chart) {
        const labels = chart.data.labels || [];
        const datasets = chart.data.datasets || [];

        const docBookContent = generateDocBookContent(labels, datasets);

        const link = document.createElement('a');
        link.href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(docBookContent);
        link.download = `${id}.xml`;
        link.click();
    }
}

function generateDocBookContent(labels, datasets){
    const root = xmlbuilder.create('book', { version: '1.0', encoding: 'UTF-8' });
    const chapter = root.ele('chapter');
    chapter.ele('title', 'Most Rated Books');
    const table = chapter.ele('table');
    const tgroup = table.ele('tgroup', { cols: datasets.length + 1 });
    const thead = tgroup.ele('thead');
    const tbody = tgroup.ele('tbody');

    // Generate table header
    const headerRow = thead.ele('row');
    headerRow.ele('entry', 'Label');
    datasets.forEach(dataset => {
        headerRow.ele('entry', dataset.label);
    });

    // Generate table body
    for (let i = 0; i < labels.length; i++) {
        const dataRow = tbody.ele('row');
        dataRow.ele('entry', labels[i]);
        datasets.forEach(dataset => {
            dataRow.ele('entry', dataset.data[i]);
        });
    }

    return root.end({ pretty: true });
}



document.addEventListener('DOMContentLoaded', function() {
    const exportCsvButton = document.getElementById('most-rated-csv');
    const exportDocBookButton = document.getElementById('most-rated-doc');
    exportCsvButton.addEventListener('click', function () {
        exportToCSV('mostRatedBooks')
    });
    exportDocBookButton.addEventListener('click', function () {
        exportToDocBook('mostRatedBooks')
    });
});