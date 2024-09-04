import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({
    auth,
    card_1,
    card_2,
    card_3,
    riwayatPengguna,
}) {
    console.log(riwayatPengguna);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {auth.user.role === 0 ? (
                // Admin Dashboard
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Card 1: Pengguna */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="text-3xl text-blue-500">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Pengguna
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {card_1}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Banyak Peminjam */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="text-3xl text-green-500">
                                        <i className="fas fa-book-reader"></i>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Banyak Peminjam
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {card_2}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Total Transaksi Keuangan */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="text-3xl text-red-500">
                                        <i className="fas fa-dollar-sign"></i>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Total Transaksi Keuangan
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            Rp {card_3}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <h3 className="text-lg font-semibold mb-4">
                                    Riwayat Pengguna
                                </h3>
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Invoice
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Terlambat
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riwayatPengguna?.map(
                                            (value, index) => (
                                                <tr key={index}>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {value.invoice_number}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {
                                                            value.peminjaman
                                                                .pelanggan.nama
                                                        }
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {
                                                            value.peminjaman
                                                                .tanggal_pinjam
                                                        }
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {value.peminjaman
                                                            .status ===
                                                        "Dikembalikan"
                                                            ? value.peminjaman
                                                                  .status
                                                            : "Dipinjam"}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {value.peminjaman
                                                            .telat == null
                                                            ? "Sedang Dipinjam"
                                                            : `${value.peminjaman.telat} Hari`}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                            Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // User (Pelanggan) Dashboard
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Card 1: Banyak Buku Dipinjam */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="text-3xl text-blue-500">
                                        <i className="fas fa-book"></i>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Banyak Buku Dipinjam
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {card_2}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Banyak Peminjaman */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="text-3xl text-green-500">
                                        <i className="fas fa-book-reader"></i>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Banyak Peminjaman
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {card_1}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Total Keterlambatan */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="text-3xl text-red-500">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Total Keterlambatan
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {card_3}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Transaction History Table */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <h3 className="text-lg font-semibold mb-4">
                                    History Transaksi
                                </h3>
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Invoice
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Grand Total
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                                                Detail
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riwayatPengguna?.map(
                                            (value, index) => (
                                                <tr key={index}>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {value.invoice_number}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        Rp {value.sub_total}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        {value.status}
                                                    </td>
                                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                            Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
