import "./style.scss";


function createTable(): HTMLTableElement {
  const table = document.createElement('table');
  table.classList.add('table-2cols');
  table.append(document.createElement('tbody'));
  return table;
}

function addRow(table: HTMLTableElement, col1: string, col2: string): void {
  const body = table.querySelector('tbody') as HTMLTableSectionElement;
  const row = document.createElement('tr');
  const cell1 = document.createElement('td');
  cell1.textContent = col1;
  const cell2 = document.createElement('td');
  cell2.textContent = col2;
  row.append(cell1, cell2);
  body.append(row);
}

export { createTable, addRow };