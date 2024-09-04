// components/BookDetailModal.js
import React from "react";

const BookDetailModal = ({ book, isOpen, onClose }) => {
    if (!isOpen) return null;

    // function pinjam buku save to local storage
    const pinjamBuku = () => {
        const borrowedBooks =
            JSON.parse(localStorage.getItem("borrowedBooks")) || [];
        const bookToBorrow = {
            id: book.id,
            judul: book.judul,
            image_path: book.image_path,
            tipe_buku: book.tipe_buku,
        };

        const existingBook = borrowedBooks.find((b) => b.id === book.id);
        if (!existingBook) {
            borrowedBooks.push(bookToBorrow);
        }

        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white rounded-lg shadow-xl md:flex w-3/4 max-w-4xl">
                    {/* Image container */}
                    <div className="md:w-1/2">
                        <img
                            src={`${book.image_path}`}
                            alt={book.judul}
                            className="object-cover w-full h-full rounded-l-lg"
                        />
                    </div>
                    {/* Details container */}
                    <div className="md:w-1/2 p-4">
                        <h2 className="font-bold text-xl mb-2">{book.judul}</h2>
                        <p>{book.deskripsi || "No description available."}</p>
                        <p className="mt-2">
                            <strong>Penerbit:</strong> {book.penerbit.nama}
                        </p>
                        <p>
                            <strong>Penulis:</strong> {book.penulis || "TBA"}
                        </p>
                        <p>
                            <strong>Stok:</strong> {book.stok}
                        </p>
                        <div className="mt-4 flex gap-2">
                            {/* pinjam buku */}
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => pinjamBuku()}
                            >
                                Pinjam Buku
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailModal;
