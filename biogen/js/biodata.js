// biodata.js

function renderBiodataSections() {
    const sections = [
        { title: 'Personal Details', fields: ['Name', 'Age', 'Height', 'Highest Education', 'Religion', 'Hobbies'] },
        { title: 'Family Details', fields: ['Father\'s Name', 'Mother\'s Name', 'Siblings'] },
        //{ title: 'Other Details', fields: [''] }
    ];

    const biodataColumn = document.querySelector('.biodata-column');
    sections.forEach(section => {
        biodataColumn.appendChild(createSection(section));
    });
}

function createSection(section) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    sectionDiv.innerHTML = `
        <h3 class="sections">${section.title}</h3>
        <table class="key-value-table">
            <tbody>
                ${section.fields.map((field, index) => createRow(field, index === 0)).join('')}
            </tbody>
        </table>
    `;
    return sectionDiv;
}

function createRow(field, isFirstRow) {
    return `
        <tr>
            <td class="actions"><i class="fas fa-plus-circle text-success action-icon add-row"></i></td>
            <th ${isFirstRow ? 'style="width: 25%;"' : ''}><input type="text" class="form-control" value="${field}"></th>
            <td ${isFirstRow ? 'style="width: 65%;"' : ''}><input type="text" class="form-control" placeholder="Enter ${field}"></td>
            <td class="actions">${isFirstRow ? '' : '<i class="fas fa-trash-alt text-danger action-icon delete-row"></i>'}</td>
        </tr>
    `;
}

function handleRowActions(event) {
    if (event.target.classList.contains('add-row')) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = createRow('', false);
        event.target.closest('tr').after(newRow);
    } else if (event.target.classList.contains('delete-row')) {
        event.target.closest('tr').remove();
    }
}
