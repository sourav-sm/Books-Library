const Books=document.getElementById('books');
const searchBar=document.getElementById('search');

let allBooks=[];

function fetchBooks(){
    fetch('https://api.freeapi.app/api/v1/public/books')
          .then(res=>res.json())
         .then(books=>{
                console.log(books);
                allBooks=books.data.data;
                const totalPages=books.data.totalPages;
                const cuurentPage=books.data.page;
                

                DisplayBooks(allBooks);
         })
}

function DisplayBooks(books){
    Books.innerHTML=books.map(book=>{
        const InfoLink=book.volumeInfo.infoLink;
        return `
        <div class="book" onclick="window.open('${InfoLink}')">
            <h2>${book.volumeInfo.title}</h2>
            <p>${book.volumeInfo.authors}</p>
            <p>${book.volumeInfo.publisher}</p>
            <p>${book.volumeInfo.publishedDate}</p>
            <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="${book.title}">
        </div>
        `
    })
}

searchBar.addEventListener("input",function () {
    const searchText=searchBar.value.toLowerCase();
    const filteredBooks=allBooks.filter((book)=>{
           const title=book.volumeInfo.title.toLowerCase();
           const authors=book.volumeInfo.authors ? book.volumeInfo.authors.join(', ').toLowerCase() : '';

           return title.includes(searchText) || authors.includes(searchText);
    });
    DisplayBooks(filteredBooks)
})


fetchBooks();