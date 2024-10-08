import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function TransaksiAdminDashboard({ auth, data }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [transaksi, setTransaksi] = useState(null);

    const openModal = (transaksi) => {
        setTransaksi(transaksi);
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
                    Transaksi Saya
                </h2>
            }
        >
            <Head title="Buku" />
            {/* feature search */}
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

            {/* table */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Transaksi
                        </div>
                        <div></div>
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <table className="table-auto w-full mt-4">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">No</th>
                                        <th className="px-4 py-2">Invoice</th>
                                        <th className="px-4 py-2">Nama</th>
                                        <th className="px-4 py-2">
                                            Total Harga
                                        </th>
                                        <th className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="border px-4 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.invoice_number}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.peminjaman.pelanggan.nama}
                                            </td>
                                            <td className="border px-4 py-2">
                                                Rp.
                                                {item.grand_total}
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
                    </div>
                </div>
            </div>
            {/* modal */}
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div
                            className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline"
                        >
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3
                                            className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                                            id="modal-headline"
                                        >
                                            Detail Transaksi
                                        </h3>
                                        <div className="mt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="font-bold">
                                                        Invoice Number
                                                    </p>
                                                    <p>
                                                        {
                                                            transaksi.invoice_number
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Nama Pelanggan
                                                    </p>
                                                    <p>
                                                        {
                                                            transaksi.peminjaman
                                                                .pelanggan.nama
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Tanggal Peminjaman
                                                    </p>
                                                    <p>
                                                        {
                                                            transaksi.peminjaman
                                                                .tanggal_pinjam
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Tanggal Pengembalian
                                                    </p>
                                                    <p>
                                                        {
                                                            transaksi.peminjaman
                                                                .tanggal_kembali
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Total Harga
                                                    </p>
                                                    <p>
                                                        Rp.
                                                        {transaksi.grand_total}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="font-bold">
                                                        Status
                                                    </p>
                                                    <p>{transaksi.is_pay}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
