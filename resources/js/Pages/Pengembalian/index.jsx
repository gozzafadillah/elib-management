import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function PengembalianDashboard({ auth, data }) {
    console.log(data);
    const [isModalOpen, setModalOpen] = useState(false);

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
                    Pengembalian Saya
                </h2>
            }
        >
            <Head title="Buku" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Pengembalian
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
                                            Tanggal Peminjaman
                                        </th>
                                        <th className="px-4 py-2">
                                            Tanggal Pengembalian
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
                                                {item.pelanggan.nama}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.tanggal_pinjam}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {item.tanggal_kembali}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        openModal(item)
                                                    }
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                                >
                                                    Kembalikan
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
