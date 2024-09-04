import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import ModalFormBuku from "./component/ModalFormBuku";
import BookDetailModal from "./component/BookDetailModal";
import { ToastContainer, toast } from "react-toastify";
import { usePage } from "@inertiajs/react";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardBuku({
    auth,
    categories,
    penerbit,
    buku,
    penulis,
}) {
    const { data, setData, processing, errors, reset } = useForm({
        id: null,
        judul: "",
        image_path: "",
        deskripsi: "",
        kategori_id: "",
        stok: 0,
        penerbit: { id: 0, nama: "" }, // Menggunakan objek untuk penerbit
        tahun_terbit: "",
        tipe_buku: "",
        penulis: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false); // Track if we are in edit mode
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Mendapatkan flash messages dari server-side
    const { flash } = usePage().props;

    useEffect(() => {
        console.log("ini flash : ", flash);

        // Jika ada pesan sukses dari server
        if (flash?.success) {
            toast.success(flash?.success);
        }
        // Jika ada pesan error dari server
        if (flash?.error) {
            toast.error(flash?.error);
        }
    }, [flash]);

    const handleBookClick = async (id) => {
        try {
            const response = await fetch(`/dashboard/buku/${id}`);
            const bookData = await response.json();
            setSelectedBook(bookData);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch book details:", error);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    const openModal = (book = null) => {
        if (book) {
            console.log("Opening edit modal with data:", book);
            setData({
                id: book.id,
                judul: book.judul,
                image_path: book.image_path,
                deskripsi: book.deskripsi,
                kategori_id: book.kategori_id,
                stok: book.stok,
                penerbit_id: book.penerbit_id,
                tahun_terbit: book.tahun_terbit,
                tipe_buku: book.tipe_buku,
                penulis: book.penulis,
                p_penulis: book.p_penulis,
            });
            setEditMode(true);
        } else {
            reset();
            setData({
                id: null,
                judul: "",
                image_path: "",
                deskripsi: "",
                kategori_id: "",
                stok: 0,
                penerbit_id: null,
                tahun_terbit: "",
                tipe_buku: "",
                penulis: [],
            });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("judul", data.judul);
        formData.append("kategori_id", data.kategori_id);
        formData.append("penerbit_id", JSON.stringify(data.penerbit)); // Kirim sebagai objek
        formData.append("tahun_terbit", data.tahun_terbit);
        formData.append("tipe_buku", data.tipe_buku);
        formData.append("stok", data.stok);
        formData.append("image_path", data.image_path); // Pastikan 'image_path' berisi file, bukan string path
        formData.append("deskripsi", data.deskripsi);
        formData.append("penulis", JSON.stringify(data.penulis));
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
                    // Menampilkan notifikasi untuk setiap kesalahan validasi
                    Object.keys(errors).forEach((field) => {
                        toast.error(errors[field]);
                    });
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
                    // Menampilkan notifikasi untuk setiap kesalahan validasi
                    Object.keys(errors).forEach((field) => {
                        toast.error(errors[field]);
                    });
                },
            });
        }
    };

    const deleteBuku = async (id) => {
        if (confirm("Are you sure you want to delete this book?")) {
            Inertia.delete(`buku/${id}`, {
                onSuccess: () => {
                    toast.success("Buku berhasil dihapus");
                },
                onError: () => {
                    toast.error("Gagal menghapus buku");
                },
            });
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
            <ToastContainer />

            <Head title="Buku" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-row">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                List Buku
                            </div>
                        </div>

                        {/* Button to add books */}
                        {auth.user.role === 0 && (
                            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => openModal()}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Buku
                                </button>
                            </div>
                        )}

                        {/* card buku */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                            {buku.map((value) => (
                                <div
                                    key={value.id}
                                    className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <img
                                        src={value.image_path}
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
                                            {auth.user.role === 0 ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            openModal(value)
                                                        }
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
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            handleBookClick(
                                                                value.id
                                                            );
                                                        }}
                                                        className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs"
                                                    >
                                                        Detail
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for displaying book details */}
            {selectedBook && (
                <BookDetailModal
                    book={selectedBook}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}

            {/* Modal Form */}
            <ModalFormBuku
                showModal={showModal}
                setShowModal={setShowModal}
                submit={submit}
                data={data}
                setData={setData}
                categories={categories}
                penerbit={penerbit}
                editMode={editMode}
                processing={processing}
                errors={errors}
                penulisList={penulis}
            />
        </AuthenticatedLayout>
    );
}
