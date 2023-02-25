// import modul books dan nanoid
const books = require('./books');
const {nanoid} = require('nanoid');

//membuat handler POST.
//untuk menyimpan buku.
const addBookHandler = (request, h) => {
    // mengambil data" yg dikirim user lewt body request.
    const {
        name, 
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    // menambil data id dengan nanoid.
    const bookId = nanoid(16);
    // ambil nilai waktu ini dari insertedAt dan updatedAt.
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    // mengambil nilai finished.
    const finished = pageCount === readPage;
    // membuat var baru untuk nanti di push ke dalam books array.
    const newBook = {
        id: bookId,
        name, 
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt,
        finished
    }
    
    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }
    // memastikan apakah newBook sudah masuk ke dlm array books.
    books.push(newBook);
    const ifSuccess = books.filter((book) => book.id === bookId).length > 0;
    if(ifSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data:{
                bookId,
            }
        });
        response.code(201);
        return response;
    }
};

    // function handler Get.
    // dapat menampilkan seluruh buku.
    const getAllBookHandler = () =>{
        if(books.length === 0){
            return{
                status: 'success',
                data:{
                    books:[]
                }
            };
        }
        return{
            status: 'success',
            data:{
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                  })),
            },
        };

    }

    // function GetIdHandler
    // menampilkan buku secara detail
    const getAllBookByIdHandler = (request, h) =>{
    // mendapatkan id dri parameter URL.
        const {bookId} = request.params;
    // mendapatkan buku dengan id yg sama dari array notes
        const book = books.filter((n) => n.Id === bookId)[0];
    // memastikan buku tidak undefined
    if(book !== undefined){
            const response = h.response({
                status: 'success',
                data:{
                    book,
                }
            });
            response.code(200);
            return response;
        }
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan'
            });
            response.code(404);
            return response;
        }
    
    // function editBookByIdHandler.
    // mengedit semua buku berdasarkan id.
    const editBookByIdHandler = (request, h) =>{
        // mendapatkan id dari parameter URL.
        const {bookId} = request.params;
        // mendapatkan data book terbaru.
        const {
            name, 
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        } = request.payload;
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage;
        
        if(name === undefined){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }
        
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }
        // mengubah data lama menjadi data baru.
        const index = books.findIndex((book) => book.Id === bookId);
        if(index !== -1){
            books[index] = {
                // mengganti data dgn spread syntax.
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                updatedAt,
            };
        
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
        }
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan'
            });
            response.code(404);
            return response;
    }

    const deleteBookByIdHandler = (request, h) =>{
        const {bookId} = request.params;

        const index = books.findIndex((book) => book.id === bookId);
        if(index !== -1){
            books.splice(index, 1);
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            });
            response.code(200);
            return response;
        }
            const response =h.response({
                status: 'success',
                message: 'Buku gagal dihapus. Id tidak ditemukan'
            });
            response.code(404);
            return response;
    }

module.exports = {addBookHandler, getAllBookHandler, getAllBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
