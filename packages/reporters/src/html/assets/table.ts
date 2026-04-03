export const script = `
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  if (!table) return;
  
  const rows = Array.from(table.querySelectorAll('tbody tr.main-row'));
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Filter logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.getAttribute('data-status');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        const detailRow = row.nextElementSibling;
        
        if (status === 'all' || rowStatus === status) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
          if (detailRow && detailRow.classList.contains('detail-row')) {
            detailRow.classList.remove('open');
          }
        }
      });
    });
  });

  // Expand logic
  rows.forEach(row => {
    row.addEventListener('click', () => {
      const detailRow = row.nextElementSibling;
      if (detailRow && detailRow.classList.contains('detail-row')) {
        detailRow.classList.toggle('open');
      }
    });
  });

  // Sort logic
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const isAscending = header.classList.contains('sort-asc');
      const direction = isAscending ? -1 : 1;
      
      headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');

      const sortedRows = rows.sort((a, b) => {
        const aValue = a.children[index].innerText.trim();
        const bValue = b.children[index].innerText.trim();
        
        if (!isNaN(aValue) && !isNaN(bValue)) {
          return (parseFloat(aValue) - parseFloat(bValue)) * direction;
        }
        return aValue.localeCompare(bValue) * direction;
      });

      const tbody = table.querySelector('tbody');
      sortedRows.forEach(row => {
        tbody.appendChild(row);
        const detailRow = row.nextElementSibling;
        if (detailRow && detailRow.classList.contains('detail-row')) {
          tbody.appendChild(detailRow);
        }
      });
    });
  });
});
`;
