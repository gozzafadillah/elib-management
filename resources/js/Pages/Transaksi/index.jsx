import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function TransaksiDashboard({ auth, data }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpenTransaction, setModalOpenTransaction] = useState(false);
    const [transaksi, setTransaksi] = useState(null);
    const [howToPay, setHowToPay] = useState(null);
    const [showIframe, setShowIframe] = useState(false);
    const [iframeUrl, setIframeUrl] = useState(null);

    const openModal = (transaksi) => {
        setTransaksi(transaksi);
        setModalOpen(true);
    };

    const props = usePage().props;
    useEffect(() => {
        if (props.result) {
            setModalOpenTransaction(true);
        }
    }, [props.result]);

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleToPay = (invoice_number, howToPay) => {
        router.post("/dashboard/transaksi/pay", {
            invoice_number: invoice_number,
            how_to_pay: howToPay,
            _token: props.csrf_token,
        });
        setModalOpen(false);
    };

    const handleClickPayURL = (url) => {
        setIframeUrl(url);
        setShowIframe(true);
    };

    const closeIframeModal = () => {
        setShowIframe(false);
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
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                            Transaksi
                        </div>
                        <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full mt-4">
                                    <thead>
                                        <tr>
                                            <th className="px-2 sm:px-4 py-2">
                                                No
                                            </th>
                                            <th className="px-2 sm:px-4 py-2">
                                                Invoice
                                            </th>
                                            <th className="px-2 sm:px-4 py-2">
                                                Nama
                                            </th>
                                            <th className="px-2 sm:px-4 py-2">
                                                Total Harga
                                            </th>
                                            <th className="px-2 sm:px-4 py-2">
                                                Status
                                            </th>
                                            <th className="px-2 sm:px-4 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {index + 1}
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {item.invoice_number}
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {
                                                        item.peminjaman
                                                            .pelanggan.nama
                                                    }
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    Rp. {item.grand_total}
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    {item.is_pay}
                                                </td>
                                                <td className="border px-2 sm:px-4 py-2">
                                                    <button
                                                        onClick={() =>
                                                            openModal(item)
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
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
            </div>

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                            Detail Transaksi
                                        </h3>
                                        <div className="mt-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                        Rp.{" "}
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
                                            {transaksi.is_pay === "Pending" && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        Pilih Metode Pembayaran
                                                    </label>
                                                    <select
                                                        onChange={(e) =>
                                                            setHowToPay(
                                                                e.target.value
                                                            )
                                                        }
                                                        id="how_to_pay"
                                                        name="how_to_pay"
                                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    >
                                                        <option value="">
                                                            Pilih metode
                                                            pembayaran
                                                        </option>
                                                        <option value="cash">
                                                            Cash
                                                        </option>
                                                        <option value="non-cash">
                                                            Non-Cash
                                                        </option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {transaksi.is_pay === "Pending" && (
                                    <button
                                        onClick={() =>
                                            handleToPay(
                                                transaksi.invoice_number,
                                                howToPay
                                            )
                                        }
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                                    >
                                        Bayar
                                    </button>
                                )}
                                <button
                                    onClick={closeModal}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-2 sm:mt-0"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpenTransaction && props.result && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                            Informasi Pembayaran
                                        </h3>
                                        <div className="mt-2">
                                            <p>{props.result.msg}</p>
                                            <div className="mt-4">
                                                <button
                                                    onClick={() =>
                                                        handleClickPayURL(
                                                            props.result.url
                                                        )
                                                    }
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                                                >
                                                    Lanjutkan Pembayaran
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() =>
                                        setModalOpenTransaction(false)
                                    }
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showIframe && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                            Pembayaran
                                        </h3>
                                        <div className="mt-2">
                                            <iframe
                                                src={iframeUrl}
                                                title="Payment"
                                                className="w-full h-96"
                                                frameBorder="0"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={closeIframeModal}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
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
