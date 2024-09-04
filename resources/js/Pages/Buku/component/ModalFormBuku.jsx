import React, { useState, useEffect } from "react";

const ModalFormBuku = ({
    showModal,
    data,
    setData,
    submit,
    setShowModal,
    processing,
    editMode,
    categories,
    penerbit,
    penulisList, // daftar penulis yang sudah ada
}) => {
    // State untuk menampung daftar penulis sebagai array objek
    const [penulis, setPenulis] = useState(
        data.penulis || [{ id: 0, nama: "" }]
    );

    console.log(data);

    // State untuk penerbit sebagai objek { id, nama }
    const [publisher, setPublisher] = useState({
        id: data.penerbit_id || 0,
        nama: penerbit.find((p) => p.id === data.penerbit_id)?.nama || "",
    });
    useEffect(() => {
        // Set penerbit jika data berubah
        setPublisher({
            id: data.penerbit_id || 0,
            nama: penerbit.find((p) => p.id === data.penerbit_id)?.nama || "",
        });
    }, [data.penerbit_id]);

    useEffect(() => {
        // Set penulis jika data berubah
        setPenulis(data.penulis || [{ id: 0, nama: "" }]);
    }, [data]);

    const handlePenulisChange = (index, value) => {
        // Cari penulis berdasarkan nama yang dipilih
        const selectedPenulis = penulisList.find((p) => p.nama === value);

        const updatedPenulis = [...penulis];
        // Jika penulis ditemukan, perbarui objek dengan id dan nama
        // Jika tidak ditemukan, buat objek baru dengan id = 0
        updatedPenulis[index] = selectedPenulis
            ? { id: selectedPenulis.id, nama: selectedPenulis.nama }
            : { id: 0, nama: value };

        setPenulis(updatedPenulis);
        setData("penulis", updatedPenulis);
    };

    const addPenulisField = () => {
        setPenulis([...penulis, { id: 0, nama: "" }]);
    };

    const removePenulisField = (index) => {
        const updatedPenulis = penulis.filter((_, i) => i !== index);
        setPenulis(updatedPenulis);
        setData("penulis", updatedPenulis);
    };

    const handlePublisherChange = (value) => {
        const selectedPublisher = penerbit.find((p) => p.nama === value);

        if (selectedPublisher) {
            // Jika ditemukan, gunakan objek yang ada
            setPublisher({
                id: selectedPublisher.id,
                nama: selectedPublisher.nama,
            });
            setData("penerbit", {
                id: selectedPublisher.id,
                nama: selectedPublisher.nama,
            });
        } else {
            // Jika tidak ditemukan, gunakan id 0 untuk penerbit baru
            setPublisher({ id: 0, nama: value });
            setData("penerbit", { id: 0, nama: value });
        }
    };

    useEffect(() => {
        // Sinkronisasi data penerbit setiap kali publisher state berubah
        setData("penerbit_id", publisher.id);
        setData("penerbit_nama", publisher.nama);
    }, [publisher]); // Memastikan perubahan disimpan ke data

    return (
        <>
            {/* Modal Form */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white w-1/2 p-6 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {editMode ? "Edit Buku" : "Add New Buku"}
                        </h2>
                        <form onSubmit={submit}>
                            <input
                                type="text"
                                value={data.judul}
                                name="judul"
                                onChange={(e) =>
                                    setData("judul", e.target.value)
                                }
                                placeholder="Judul"
                                className="border p-2 w-full"
                            />
                            <input
                                type="file"
                                name="image_path"
                                onChange={(e) =>
                                    setData("image_path", e.target.files[0])
                                }
                                className="border p-2 w-full mt-2"
                            />

                            {data.image_path &&
                                (data.image_path instanceof File ? (
                                    <img
                                        src={URL.createObjectURL(
                                            data.image_path
                                        )}
                                        alt="preview"
                                        className="w-1/4 mt-2"
                                    />
                                ) : (
                                    <img
                                        src={data.image_path}
                                        alt="preview"
                                        className="w-1/4 mt-2"
                                    />
                                ))}

                            <textarea
                                value={data.deskripsi}
                                name="deskripsi"
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                                placeholder="Deskripsi"
                                className="border p-2 w-full mt-2"
                            ></textarea>
                            <select
                                value={data.kategori_id}
                                name="kategori_id"
                                onChange={(e) =>
                                    setData("kategori_id", e.target.value)
                                }
                                className="border p-2 w-full mt-2"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.nama}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                name="stok"
                                value={data.stok}
                                onChange={(e) =>
                                    setData("stok", e.target.value)
                                }
                                placeholder="stok"
                                className="border p-2 w-full mt-2"
                            />
                            {/* Input yang bisa diketik untuk penerbit */}
                            <input
                                list="penerbitList"
                                value={publisher.nama}
                                onChange={(e) =>
                                    handlePublisherChange(e.target.value)
                                }
                                placeholder="Pilih atau Tambah Penerbit"
                                className="border p-2 w-full mt-2"
                            />
                            <datalist id="penerbitList">
                                {penerbit.map((publisher) => (
                                    <option
                                        key={publisher.id}
                                        value={publisher.nama}
                                    />
                                ))}
                            </datalist>

                            {/* Input untuk multiple penulis */}
                            <div className="mt-4">
                                <label className="font-bold">Penulis:</label>
                                {penulis.map((penulisItem, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center mt-2"
                                    >
                                        <input
                                            list="penulisList"
                                            type="text"
                                            value={penulisItem.nama}
                                            onChange={(e) =>
                                                handlePenulisChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Pilih atau Tambah Penulis"
                                            className="border p-2 w-full"
                                        />
                                        <datalist id="penulisList">
                                            {penulisList.map((item, i) => (
                                                <option
                                                    key={i}
                                                    value={item.nama}
                                                />
                                            ))}
                                        </datalist>
                                        {penulis.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removePenulisField(index)
                                                }
                                                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addPenulisField}
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Tambah Penulis
                                </button>
                            </div>
                            <select
                                value={data.tipe_buku}
                                onChange={(e) =>
                                    setData("tipe_buku", e.target.value)
                                }
                                name="tipe_buku"
                                className="border p-2 w-full mt-2"
                            >
                                <option value="">Select Book Type</option>
                                <option value="Import">Import</option>
                                <option value="Local">Local</option>
                            </select>
                            <input
                                type="date"
                                name="tahun_terbit"
                                value={data.tahun_terbit}
                                onChange={(e) =>
                                    setData("tahun_terbit", e.target.value)
                                }
                                className="border p-2 w-full mt-2"
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalFormBuku;
