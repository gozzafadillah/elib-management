import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";

export default function ChartBooks({ auth }) {
    const formatDateToDateTimeLocal = (date) => {
        const local = new Date(date);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toJSON().slice(0, 16);
    };

    // Set default start date to today and end date to one week from today
    const [startDate, setStartDate] = useState(
        formatDateToDateTimeLocal(new Date())
    );
    const [endDate, setEndDate] = useState(
        formatDateToDateTimeLocal(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        )
    );

    // Update the end date when the start date changes
    useEffect(() => {
        const newEndDate = formatDateToDateTimeLocal(
            new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000)
        );
        setEndDate(newEndDate);
    }, [startDate]);

    const borrowedBooks =
        JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    const removeBook = (book) => {
        if (confirm("Apakah anda yakin ingin menghapus buku ini dari chart?")) {
            const updatedBooks = borrowedBooks.filter((b) => b.id !== book.id);
            localStorage.setItem("borrowedBooks", JSON.stringify(updatedBooks));
            window.location.reload();
        }
    };

    const pinjamBuku = () => {
        Inertia.post(route("peminjaman.store"), {
            data: borrowedBooks,
            start: startDate,
            end: endDate,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Keranjang Saya
                </h2>
            }
        >
            <Head title="Buku" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Keranjang
                        </div>
                        <div>
                            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href="/dashboard/buku"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                >
                                    Tambah Pinjam Buku
                                </Link>
                                <button
                                    onClick={pinjamBuku}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                >
                                    Pinjam Buku
                                </button>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="start"
                                            className="text-sm"
                                        >
                                            Tanggal Mulai
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="start"
                                            id="start"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(
                                                    formatDateToDateTimeLocal(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="end"
                                            className="text-sm"
                                        >
                                            Tanggal Selesai
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="end"
                                            id="end"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(
                                                    formatDateToDateTimeLocal(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Judul</th>
                                        <th className="px-4 py-2">image</th>
                                        <th className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {borrowedBooks.map((book) => (
                                        <tr key={book.id}>
                                            <td className="border px-4 py-2 text-center">
                                                {book.judul}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <img
                                                        src={`/storage/images/buku/${book.image_path}`}
                                                        alt={book.judul}
                                                        style={{
                                                            maxWidth: "20%",
                                                            height: "auto",
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() =>
                                                        removeBook(book)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
