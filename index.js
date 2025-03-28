const Books = document.getElementById('books');
const searchBar = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const toggleViewBtn=document.getElementById('toggleView');

let allBooks = [];
let currentPage = 1;
let hasNextPage = true;
let isLoading = false;
let isGridView=true;

function fetchBooks(page = 1) {
    isLoading = true;
    fetch(`https://api.freeapi.app/api/v1/public/books?page=${page}`)
        .then(res => res.json())
        .then(books => {
            const newBooks = books.data.data;
            allBooks = [...allBooks, ...newBooks];
            currentPage = books.data.page;
            hasNextPage = books.data.nextPage;

            DisplayBooks(allBooks);
            isLoading = false;
        });
}

function DisplayBooks(books) {
    Books.innerHTML = books.map(book => {
        return `
        <div class="book">
            <h2>${book.volumeInfo.title}</h2>
            <p>${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
            <p>${book.volumeInfo.publisher || 'Unknown Publisher'}</p>
            <p>${book.volumeInfo.publishedDate || 'No Date'}</p>
            <img src="${book.volumeInfo.imageLinks?.thumbnail || ''}" alt="${book.volumeInfo.title}">
        </div>
        `;
    }).join('');
}

// Infinite Scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (hasNextPage && !isLoading) {
            fetchBooks(currentPage + 1);
        }
    }
});

// Search functionality
searchBar.addEventListener("input", function () {
    const searchText = searchBar.value.toLowerCase();
    const filteredBooks = allBooks.filter((book) => {
        const title = book.volumeInfo.title?.toLowerCase() || '';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ').toLowerCase() : '';
        return title.includes(searchText) || authors.includes(searchText);
    });
    DisplayBooks(filteredBooks);
});

// Sort functionality
sortSelect.addEventListener('change', () => {
    const sortValue = sortSelect.value;
    let sortedBooks = [...allBooks];

    if (sortValue === 'title') {
        sortedBooks.sort((a, b) => {
            const titleA = a.volumeInfo.title?.toLowerCase() || '';
            const titleB = b.volumeInfo.title?.toLowerCase() || '';
            return titleA.localeCompare(titleB);
        });
    } else if (sortValue === 'date') {
        sortedBooks.sort((a, b) => {
            const dateA = new Date(a.volumeInfo.publishedDate || '1900');
            const dateB = new Date(b.volumeInfo.publishedDate || '1900');
            return dateB - dateA;
        });
    }

    DisplayBooks(sortedBooks);
});

// Toggle List/Grid View
toggleViewBtn.addEventListener("click",function(){
    isGridView=!isGridView;
    Books.className=isGridView ? "grid-view" : "list-view";
    toggleViewBtn.textContent=isGridView ? "Switch to List View" : "Switch to Grid View";
})

// Initial Fetch
fetchBooks();
