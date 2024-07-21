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
}) => {
    return (
        <>
            {/* Modal Form */}
            {showModal && (
                // besaran modal sedikit lebih besar
                <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white w-1/2 p-6 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {editMode ? "Edit Buku" : "Add New Buku"}
                        </h2>
                        {/* content type */}
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
                            {/* input asset image file and show image beside input file and image need bigest, input must type file */}
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
                                        src={
                                            "/storage/images/buku/" +
                                            data.image_path
                                        }
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
                            <select
                                value={data.penerbit_id}
                                onChange={(e) =>
                                    setData("penerbit_id", e.target.value)
                                }
                                name="penerbit_id"
                                className="border p-2 w-full mt-2"
                            >
                                <option value="">Select Publisher</option>
                                {penerbit.map((publisher) => (
                                    <option
                                        key={publisher.id}
                                        value={publisher.id}
                                    >
                                        {publisher.nama}
                                    </option>
                                ))}
                            </select>
                            {/* tambahkan select untuk tipe_buku (Import atau Local) */}
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
