/**
 * TrashFlow Jogja - Main JavaScript File
 * 
 * File ini berisi logika untuk:
 * - Simulasi data Bank Sampah
 * - Fungsi Refresh Data
 * - Fungsi Simulasi Redistribusi
 * - Interaksi tabel dan UI
 */

// Data Bank Sampah di 14 Kecamatan Yogyakarta
// Simulasi data dengan variasi kapasitas untuk demonstrasi
const bankSampahData = [
    { id: 1, kecamatan: 'Umbulharjo', nama: 'Bank Sampah Srikandi', kapasitas: 65, status: 'safe' },
    { id: 2, kecamatan: 'Gondokusuman', nama: 'Bank Sampah Hijau Lestari', kapasitas: 85, status: 'warning' },
    { id: 3, kecamatan: 'Jetis', nama: 'Bank Sampah Merapi', kapasitas: 95, status: 'overload' },
    { id: 4, kecamatan: 'Mergangsan', nama: 'Bank Sampah Bumi Hijau', kapasitas: 45, status: 'safe' },
    { id: 5, kecamatan: 'Danurejan', nama: 'Bank Sampah Ceria', kapasitas: 78, status: 'warning' },
    { id: 6, kecamatan: 'Gedongtengen', nama: 'Bank Sampah Sejahtera', kapasitas: 30, status: 'safe' },
    { id: 7, kecamatan: 'Ngampilan', nama: 'Bank Sampah Mandiri', kapasitas: 88, status: 'warning' },
    { id: 8, kecamatan: 'Wirobrajan', nama: 'Bank Sampah Bersih', kapasitas: 92, status: 'overload' },
    { id: 9, kecamatan: 'Mantrijeron', nama: 'Bank Sampah Hijau', kapasitas: 55, status: 'safe' },
    { id: 10, kecamatan: 'Kraton', nama: 'Bank Sampah Keraton', kapasitas: 70, status: 'safe' },
    { id: 11, kecamatan: 'Pakualaman', nama: 'Bank Sampah Pakualaman', kapasitas: 82, status: 'warning' },
    { id: 12, kecamatan: 'Tegalrejo', nama: 'Bank Sampah Tegalrejo', kapasitas: 40, status: 'safe' },
    { id: 13, kecamatan: 'Kotagede', nama: 'Bank Sampah Kotagede', kapasitas: 75, status: 'warning' },
    { id: 14, kecamatan: 'Gondomanan', nama: 'Bank Sampah Gondomanan', kapasitas: 60, status: 'safe' }
];

/**
 * Fungsi untuk menentukan status berdasarkan kapasitas
 * @param {number} kapasitas - Persentase kapasitas (0-100)
 * @returns {string} Status: 'safe', 'warning', atau 'overload'
 */
function getStatus(kapasitas) {
    if (kapasitas <= 70) {
        return 'safe';
    } else if (kapasitas <= 85) {
        return 'warning';
    } else {
        return 'overload';
    }
}

/**
 * Fungsi untuk mendapatkan label status dalam bahasa Indonesia
 * @param {string} status - Status dari getStatus()
 * @returns {string} Label status
 */
function getStatusLabel(status) {
    const labels = {
        'safe': 'Aman',
        'warning': 'Peringatan',
        'overload': 'Overload'
    };
    return labels[status] || 'Unknown';
}

/**
 * Fungsi untuk mendapatkan warna berdasarkan status
 * @param {string} status - Status dari getStatus()
 * @returns {string} Warna Tailwind CSS
 */
function getStatusColor(status) {
    const colors = {
        'safe': 'bg-green-500',
        'warning': 'bg-yellow-500',
        'overload': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
}

/**
 * Fungsi untuk mendapatkan warna teks berdasarkan status
 * @param {string} status - Status dari getStatus()
 * @returns {string} Warna Tailwind CSS untuk teks
 */
function getStatusTextColor(status) {
    const colors = {
        'safe': 'text-green-600',
        'warning': 'text-yellow-600',
        'overload': 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
}

/**
 * Fungsi untuk mendapatkan warna badge berdasarkan status
 * @param {string} status - Status dari getStatus()
 * @returns {string} Warna Tailwind CSS untuk badge
 */
function getStatusBadgeColor(status) {
    const colors = {
        'safe': 'bg-green-100 text-green-800',
        'warning': 'bg-yellow-100 text-yellow-800',
        'overload': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Fungsi untuk merender tabel monitoring
 * @param {Array} data - Array data Bank Sampah
 */
function renderTable(data) {
    const tbody = document.getElementById('monitor-table-body');
    
    if (!tbody) {
        console.error('Element monitor-table-body tidak ditemukan');
        return;
    }
    
    // Clear existing content
    tbody.innerHTML = '';
    
    // Render setiap baris data
    data.forEach((item, index) => {
        const status = getStatus(item.kapasitas);
        const row = document.createElement('tr');
        row.className = 'monitor-row fade-in';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.kecamatan}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.nama}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-4 mr-3">
                        <div class="progress-bar ${getStatusColor(status)} h-4 rounded-full" style="width: ${item.kapasitas}%"></div>
                    </div>
                    <span class="text-sm font-semibold ${getStatusTextColor(status)}">${item.kapasitas}%</span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(status)}">
                    ${getStatusLabel(status)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                ${status === 'overload' ? `
                    <button onclick="simulateRedistribution(${item.id})" class="text-nature-green hover:text-nature-green-dark font-semibold transition-colors">
                        <i class="fas fa-exchange-alt mr-1"></i>Redistribusi
                    </button>
                ` : `
                    <span class="text-gray-400">-</span>
                `}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

/**
 * Fungsi untuk mensimulasikan perubahan data (seperti refresh dari server)
 * Menambahkan variasi kecil pada kapasitas untuk menunjukkan data real-time
 */
function simulateDataRefresh() {
    // Simulasi perubahan kapasitas dengan variasi ±5%
    const updatedData = bankSampahData.map(item => {
        const variation = Math.floor(Math.random() * 11) - 5; // -5 sampai +5
        const newKapasitas = Math.max(0, Math.min(100, item.kapasitas + variation));
        return {
            ...item,
            kapasitas: newKapasitas,
            status: getStatus(newKapasitas)
        };
    });
    
    return updatedData;
}

/**
 * Fungsi untuk refresh data (simulasi pengambilan data dari server DLH)
 */
function refreshData() {
    const refreshBtn = document.getElementById('refresh-btn');
    const icon = refreshBtn.querySelector('i');
    
    // Animasi loading
    icon.classList.add('loading');
    refreshBtn.disabled = true;
    refreshBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Simulasi delay network request
    setTimeout(() => {
        const updatedData = simulateDataRefresh();
        renderTable(updatedData);
        
        // Hapus animasi loading
        icon.classList.remove('loading');
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        // Tampilkan notifikasi sukses
        showNotification('Data berhasil diperbarui dari server DLH Kota Yogyakarta', 'success');
    }, 1500);
}

/**
 * Fungsi untuk mensimulasikan proses redistribusi sampah
 * @param {number} bankSampahId - ID Bank Sampah yang akan di-redistribusi
 */
function simulateRedistribution(bankSampahId) {
    const bankSampah = bankSampahData.find(item => item.id === bankSampahId);
    
    if (!bankSampah) {
        showNotification('Data Bank Sampah tidak ditemukan', 'error');
        return;
    }
    
    // Cari Bank Sampah terdekat dengan kapasitas rendah (safe)
    const targetBankSampah = bankSampahData
        .filter(item => item.id !== bankSampahId && item.status === 'safe')
        .sort((a, b) => a.kapasitas - b.kapasitas)[0];
    
    if (!targetBankSampah) {
        showNotification('Tidak ada Bank Sampah tujuan yang tersedia untuk redistribusi', 'warning');
        return;
    }
    
    // Hitung jumlah sampah yang akan dipindahkan (simulasi: mengurangi 20% dari overload)
    const amountToRedistribute = Math.floor((bankSampah.kapasitas - 85) * 0.2);
    const newSourceKapasitas = bankSampah.kapasitas - amountToRedistribute;
    const newTargetKapasitas = Math.min(100, targetBankSampah.kapasitas + amountToRedistribute);
    
    // Tampilkan modal konfirmasi dengan informasi detail
    const modalContent = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-slate-professional">Simulasi Redistribusi</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p class="font-semibold text-red-800 mb-2">Sumber (Overload):</p>
                    <p class="text-sm text-gray-700">${bankSampah.nama}</p>
                    <p class="text-sm text-gray-700">Kecamatan: ${bankSampah.kecamatan}</p>
                    <p class="text-sm text-gray-700">Kapasitas saat ini: ${bankSampah.kapasitas}%</p>
                </div>
                
                <div class="text-center">
                    <i class="fas fa-arrow-down text-2xl text-nature-green"></i>
                    <p class="text-sm font-semibold text-gray-700 mt-2">Memindahkan ${amountToRedistribute}% kapasitas</p>
                </div>
                
                <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p class="font-semibold text-green-800 mb-2">Tujuan (Safe):</p>
                    <p class="text-sm text-gray-700">${targetBankSampah.nama}</p>
                    <p class="text-sm text-gray-700">Kecamatan: ${targetBankSampah.kecamatan}</p>
                    <p class="text-sm text-gray-700">Kapasitas saat ini: ${targetBankSampah.kapasitas}%</p>
                </div>
                
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p class="font-semibold text-blue-800 mb-2">Hasil Setelah Redistribusi:</p>
                    <p class="text-sm text-gray-700">Sumber: ${newSourceKapasitas}% ${getStatusLabel(getStatus(newSourceKapasitas))}</p>
                    <p class="text-sm text-gray-700">Tujuan: ${newTargetKapasitas}% ${getStatusLabel(getStatus(newTargetKapasitas))}</p>
                </div>
            </div>
            
            <div class="mt-6 flex gap-3">
                <button onclick="executeRedistribution(${bankSampahId}, ${targetBankSampah.id}, ${amountToRedistribute})" 
                        class="flex-1 bg-nature-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-nature-green-dark transition-colors">
                    <i class="fas fa-check mr-2"></i>Konfirmasi
                </button>
                <button onclick="closeModal()" 
                        class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Batal
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

/**
 * Fungsi untuk mengeksekusi redistribusi setelah konfirmasi
 * @param {number} sourceId - ID Bank Sampah sumber
 * @param {number} targetId - ID Bank Sampah tujuan
 * @param {number} amount - Jumlah kapasitas yang dipindahkan
 */
function executeRedistribution(sourceId, targetId, amount) {
    const sourceIndex = bankSampahData.findIndex(item => item.id === sourceId);
    const targetIndex = bankSampahData.findIndex(item => item.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) {
        showNotification('Data tidak valid', 'error');
        return;
    }
    
    // Update kapasitas
    bankSampahData[sourceIndex].kapasitas = Math.max(0, bankSampahData[sourceIndex].kapasitas - amount);
    bankSampahData[sourceIndex].status = getStatus(bankSampahData[sourceIndex].kapasitas);
    
    bankSampahData[targetIndex].kapasitas = Math.min(100, bankSampahData[targetIndex].kapasitas + amount);
    bankSampahData[targetIndex].status = getStatus(bankSampahData[targetIndex].kapasitas);
    
    // Render ulang tabel
    renderTable(bankSampahData);
    
    // Tutup modal
    closeModal();
    
    // Tampilkan notifikasi sukses
    showNotification(`Redistribusi berhasil! ${amount}% kapasitas telah dipindahkan.`, 'success');
}

/**
 * Fungsi untuk menampilkan modal
 * @param {string} content - HTML content untuk modal
 */
function showModal(content) {
    // Hapus modal yang sudah ada jika ada
    const existingModal = document.getElementById('redistribution-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Buat modal baru
    const modal = document.createElement('div');
    modal.id = 'redistribution-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4';
    modal.innerHTML = content;
    
    document.body.appendChild(modal);
}

/**
 * Fungsi untuk menutup modal
 */
function closeModal() {
    const modal = document.getElementById('redistribution-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Fungsi untuk menampilkan notifikasi
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe notifikasi: 'success', 'error', 'warning'
 */
function showNotification(message, type = 'success') {
    // Hapus notifikasi yang sudah ada
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const colors = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500'
    };
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle'
    };
    
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center space-x-3 fade-in`;
    notification.innerHTML = `
        <i class="fas ${icons[type]} text-xl"></i>
        <span class="font-semibold">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Fungsi untuk toggle mobile menu
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const icon = menuBtn.querySelector('i');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        mobileMenu.classList.add('hidden');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

/**
 * Event Listeners - Inisialisasi saat DOM siap
 */
document.addEventListener('DOMContentLoaded', function() {
    // Render tabel dengan data awal
    renderTable(bankSampahData);
    
    // Event listener untuk tombol refresh
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // Event listener untuk tombol simulasi redistribusi
    const simulateBtn = document.getElementById('simulate-btn');
    if (simulateBtn) {
        simulateBtn.addEventListener('click', () => {
            // Cari Bank Sampah dengan status overload
            const overloadBank = bankSampahData.find(item => item.status === 'overload');
            if (overloadBank) {
                simulateRedistribution(overloadBank.id);
            } else {
                showNotification('Tidak ada Bank Sampah dengan status Overload saat ini', 'warning');
            }
        });
    }
    
    // Event listener untuk mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Event listener untuk smooth scroll pada anchor links (hanya untuk link internal dengan #)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Hanya prevent default jika link mengarah ke anchor di halaman yang sama
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Tutup mobile menu jika terbuka
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        toggleMobileMenu();
                    }
                }
            }
        });
    });
    
    // Event listener untuk klik di luar modal untuk menutup modal
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('redistribution-modal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });
});


