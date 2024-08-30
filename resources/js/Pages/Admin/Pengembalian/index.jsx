import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function PengembalianAdminDashboard({ auth, data }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [buku, setBuku] = useState(null);
    const [showQRReader, setShowQRReader] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");

    useEffect(() => {
        // Fetch available video input devices (cameras)
        navigator.mediaDevices
            .enumerateDevices()
            .then((deviceInfos) => {
                const videoDevices = deviceInfos.filter(
                    (device) => device.kind === "videoinput"
                );
                setDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedDeviceId(videoDevices[0].deviceId); // Select the first camera by default
                }
            })
            .catch((error) => {
                console.error("Error enumerating devices:", error);
            });
    }, []);

    const openModal = (item) => {
        setBuku(item);
        setModalOpen(true);
        setShowQRReader(false); // Reset QR reader display when opening the modal
    };

    const handlePengembalian = (id) => {
        Inertia.post(route("pengembalian.pengembalianBuku"), {
            id: id,
        });
    };

    const closeModal = () => {
        setModalOpen(false);
        setBuku(null);
        setQrData(""); // Reset QR data when closing the modal
    };

    const toggleQRReader = () => {
        setShowQRReader(!showQRReader);
    };

    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
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
                            Pengembalian
                        </div>
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
                                                {item.status ==
                                                "Dikembalikan" ? (
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
                                                        openModal(item)
                                                    }
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                                >
                                                    Detail
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

            {/* Modal to display selected item details */}
            {isModalOpen && buku && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 max-w-3xl w-full rounded-lg shadow-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Detail Pengembalian
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
                            <div className="flex justify-center mt-4">
                                {buku.status == "Dikembalikan" ? (
                                    <>
                                        <span
                                            onClick={() => {
                                                closeModal();
                                            }}
                                            className="bg-green-500 text-white font-bold py-2 px-4 mx-2 rounded"
                                        >
                                            Sudah Dikembalikan
                                        </span>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {/* Camera Selection */}
                                        <select
                                            value={selectedDeviceId}
                                            onChange={handleDeviceChange}
                                            className="border border-gray-300 rounded-lg p-2"
                                        >
                                            {devices.map((device, index) => (
                                                <option
                                                    key={index}
                                                    value={device.deviceId}
                                                >
                                                    {device.label ||
                                                        `Camera ${index + 1}`}
                                                </option>
                                            ))}
                                        </select>

                                        {/* QR Code Reader button */}
                                        <button
                                            onClick={toggleQRReader}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                        >
                                            <i className="fas fa-qrcode"></i> QR
                                            Code
                                        </button>
                                        {/* Display QR Code Reader if showQRReader is true */}
                                        {showQRReader && (
                                            <div style={{ width: "100%" }}>
                                                <Scanner
                                                    onScan={(result) => {
                                                        if (result) {
                                                            handlePengembalian(
                                                                result[0]
                                                                    .rawValue
                                                            );
                                                            // console.log(
                                                            //     "QR Code Scanned:",
                                                            //     result
                                                            // );
                                                        }
                                                    }}
                                                    deviceId={selectedDeviceId}
                                                    onError={(error) => {
                                                        console.error(
                                                            "Camera Error:",
                                                            error
                                                        );
                                                        alert(
                                                            "Could not start video source. Please check camera permissions and availability."
                                                        );
                                                    }}
                                                    style={{ width: "100%" }}
                                                    formats={[
                                                        "code_128",
                                                        "qr_code",
                                                    ]}
                                                    allowMultiple={true}
                                                />
                                                <p className="text-center mt-2">
                                                    {qrData
                                                        ? `Scanned Data: ${qrData}`
                                                        : "No result"}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-nowrap mt-4">
                                            <button
                                                onClick={() =>
                                                    handlePengembalian(
                                                        buku.invoice_number
                                                    )
                                                }
                                                className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-2 rounded"
                                            >
                                                Kembalikan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
