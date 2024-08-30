import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function PengembalianDashboard({ auth, data }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [buku, setBuku] = useState(null);
    const [showQR, setShowQR] = useState(false);

    const getBuku = (buku) => {
        setBuku(buku);
        setModalOpen(true);
        setShowQR(false); // Reset QR code display when opening the modal
    };

    const closeModal = () => {
        setModalOpen(false);
        setBuku(null); // Reset buku state when closing modal
    };

    const toggleQRCode = () => {
        setShowQR(!showQR);
    };

    const showQRCode = (value) => {
        return (
            <QRCode
                size={256}
                style={{ height: "auto", width: "200px" }}
                value={value}
                viewBox={`0 0 256 256`}
            />
        );
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
                                        <th className="px-4 py-2">Status</th>
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
                                                {item.tanggal_pengembalian ? (
                                                    <span className="bg-green-500 text-white font-bold py-2 px-4 mx-2 rounded">
                                                        Selesai
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-500 text-white font-bold py-2 px-4 mx-2 rounded">
                                                        Dipinjam
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        getBuku(item)
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
            {/* Modal for Buku Details */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 max-w-3xl w-full rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Detail Buku
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-red-500"
                            >
                                Close
                            </button>
                        </div>
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {buku.p_peminjaman.map((item, index) => (
                                    <div
                                        className="flex flex-col p-4 border border-gray-200 rounded"
                                        key={index}
                                    >
                                        <h3 className="text-lg font-semibold">
                                            {item.buku.judul}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Tahun Terbit:{" "}
                                            {item.buku.tahun_terbit}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Tipe Buku: {item.buku.tipe_buku}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 w-auto items-center mt-4">
                                <button
                                    onClick={toggleQRCode}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                >
                                    <i className="fas fa-qrcode"></i> QR Code
                                </button>
                                {/* Display QR Code if showQR is true */}
                                {showQR && showQRCode(buku.invoice_number)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
