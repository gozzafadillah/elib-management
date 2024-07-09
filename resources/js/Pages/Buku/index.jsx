import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function DashboardBuku({ auth, categories, penerbit, buku }) {
    const { data, setData, processing, errors, reset } = useForm({
        id: null,
        judul: "",
        image_path: "",
        kategori_id: "",
        stok: 0,
        penerbit_id: "",
        tahun_terbit: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false); // Track if we are in edit mode

    const openModal = (book = null) => {
        if (book) {
            console.log("Opening edit modal with data:", book);
            setData({
                id: book.id,
                judul: book.judul,
                image_path: book.image_path,
                kategori_id: book.kategori_id,
                stok: book.stok,
                penerbit_id: book.penerbit_id,
                tahun_terbit: book.tahun_terbit,
            });
            setEditMode(true);
        } else {
            reset();
            setData({
                id: null,
                judul: "",
                image_path: "",
                kategori_id: "",
                stok: 0,
                penerbit_id: "",
                tahun_terbit: "",
            });
            setEditMode(false);
        }
        setShowModal(true);
    };

    console.log(data);

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("judul", data.judul);
        formData.append("kategori_id", data.kategori_id);
        formData.append("penerbit_id", data.penerbit_id);
        formData.append("tahun_terbit", data.tahun_terbit);
        formData.append("stok", data.stok);
        formData.append("image_path", data.image_path); // Pastikan 'image_path' berisi file, bukan string path
        console.log([...formData]); // Cetak isi formData untuk debug
        if (data.image_path instanceof File) {
            formData.append("image_path", data.image_path);
        } else {
            formData.append("image_path", ""); // Kirim string kosong jika tidak ada file baru
        }

        if (editMode) {
            formData.append("_method", "put");
            Inertia.post(`/dashboard/buku/${data.id}`, formData, {
                forceFormData: true,
                onFinish: () => {
                    setEditMode(false);
                },
                onSuccess: () => {
                    setShowModal(false);
                    setEditMode(false);
                    reset();
                },
                onError: (errors) => {
                    console.log("Submission errors:", errors);
                },
            });
        } else {
            Inertia.post(route("buku.store"), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    setEditMode(false);
                    reset();
                },
                onError: (errors) => {
                    console.log("Submission errors:", errors);
                },
            });
        }
    };

    const deleteBuku = async (id) => {
        if (confirm("Are you sure you want to delete this book?")) {
            Inertia.delete(`buku/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    List Buku
                </h2>
            }
        >
            <Head title="Buku" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Data Buku
                        </div>

                        {/* Button to add books */}
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => openModal()}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Buku
                            </button>
                        </div>

                        {/* card buku */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                            {buku.map((value) => (
                                <div
                                    key={value.id}
                                    className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <img
                                        src={
                                            "/storage/images/buku/" +
                                            value.image_path
                                        }
                                        alt={value.judul}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            {value.judul}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {value.kategori.nama}
                                        </p>
                                        <div className="flex items-center mt-4">
                                            <button
                                                onClick={() => openModal(value)}
                                                className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteBuku(value.id)
                                                }
                                                className="mx-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
        </AuthenticatedLayout>
    );
}
