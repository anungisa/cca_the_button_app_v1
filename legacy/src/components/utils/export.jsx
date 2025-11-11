export const exportToCsv = (filename, data) => {
    if (!data || data.length === 0) {
        alert('No data to export.');
        return;
    }

    const convertToCSV = (objArray) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        const headers = Object.keys(array[0]);
        str += headers.join(',') + '\r\n';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (const index in array[i]) {
                if (line !== '') line += ',';
                // Escape commas in data
                let value = array[i][index]?.toString() || '';
                if (value.includes(',')) {
                    value = `"${value}"`;
                }
                line += value;
            }
            str += line + '\r\n';
        }
        return str;
    };

    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
};