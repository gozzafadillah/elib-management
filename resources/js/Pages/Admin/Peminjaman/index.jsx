import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function PeminjamanAdminDashboard({ auth, peminjaman }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);

    console.log(peminjaman);

    const openModal = (peminjaman) => {
        setSelectedPeminjaman(peminjaman);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Peminjaman Saya
                </h2>
            }
        >
            <Head title="Buku" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* search feature */}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-1/2"
                                    placeholder="Cari berdasarkan Invoice"
                                />

                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded">
                                    Cari
                                </button>

                                <button className="bg-green-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 mx-2 rounded">
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Peminjaman
                        </div>
                        <div>
                            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href="/dashboard/buku"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                >
                                    Tambah Pinjam Buku
                                </Link>
                            </div>
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Judul
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Invoice
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Total Harga
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Tanggal Pinjam
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Tanggal Kembali
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {peminjaman.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="border px-4 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.invoice_number}
                                            </td>
                                            <td className="border px-4 py-2">
                                                Rp.{item.sub_total}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.tanggal_pinjam}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.tanggal_kembali}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.status !=
                                                "Dikembalikan" ? (
                                                    <span className="bg-yellow-500 text-white font-bold py-1 px-2 rounded">
                                                        Dipinjam
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-500 text-white font-bold py-1 px-2 rounded">
                                                        Selesai
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        openModal(item)
                                                    }
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {isModalOpen && (
                            <div
                                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                                id="my-modal"
                            >
                                <div className="flex justify-center items-center min-h-screen">
                                    <div className="bg-white rounded-lg shadow-xl w-3/4 max-w-4xl">
                                        <div className="p-5">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Peminjaman Details:{" "}
                                                {
                                                    selectedPeminjaman.invoice_number
                                                }
                                            </h3>
                                            <ul className="mt-2 list-disc list-inside">
                                                {selectedPeminjaman.p_peminjaman.map(
                                                    (detail) => (
                                                        <li key={detail.id}>
                                                            {detail.buku.judul}{" "}
                                                            -{" "}
                                                            {
                                                                detail.buku
                                                                    .tahun_terbit
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <div className="mt-4">
                                                <button
                                                    onClick={closeModal}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
