import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";

const FormPengembalian = ({ data, totalBayarDenda }) => {
    // Dummy data for demonstration
    const [denda, setDenda] = useState();

    console.log("data : ", data);

    const handleBayarDenda = ({ $id, denda }) => {
        const data = {
            id: $id,
            denda: denda,
        };

        Inertia.post(route("pengembalian.bayarDenda"), data);
    };

    useEffect(() => {
        setDenda(totalBayarDenda * data.telat);
    }, []);

    return (
        <div className="p-6 bg-white rounded-md shadow-md">
            {/* logo */}
            <div className="flex justify-center items-center mb-4">
                <img
                    src="/storage/images/landing-pages/the-room.png"
                    alt="logo"
                    className="w-auto h-20"
                />
            </div>

            <h1 className="text-xl font-bold mb-4">Form Pengembalian</h1>
            <table className="min-w-full divide-y divide-gray-200 mb-4">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Buku
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tipe Buku
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Harga Telat
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.p_peminjaman.map((item) => (
                        <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.buku.judul}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.buku.tipe_buku}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.buku.tipe_buku === "Local" ? 5000 : 10000}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">Telat</span>
                <span className="font-bold text-lg">{data.telat} Hari</span>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">Total Bayar Denda:</span>
                <span className="font-bold text-lg">
                    Rp {(totalBayarDenda * data.telat).toLocaleString()}
                </span>
            </div>
            {/* button bayar denda */}
            <div className="flex flex-col items-end">
                <data className="flex gap-3">
                    <button
                        onClick={() =>
                            handleBayarDenda({
                                $id: data.id,
                                denda: denda,
                            })
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
                    >
                        Bayar Denda
                    </button>
                    <button
                        onClick={() =>
                            window.location.replace(route("pengembalian.index"))
                        }
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-4"
                    >
                        Cancel
                    </button>
                </data>
            </div>
        </div>
    );
};

export default FormPengembalian;
