const apiUrl = "https://script.google.com/macros/s/AKfycbxPUqqwKtRcOL95TGzIk46KSC3xM7G9F4pQJ4nFUqd2KCbihWRzlhqt6GaD5nmnuGQy-Q/exec"; 
let files = [];
const itemsPerPage = 5;
let currentPage = 1;
let currentLanguage = 'th'; // ภาษาเริ่มต้น

const translations = {
    th: {
        title: "Feed QC",
        subtitle: "ศูนย์กลาง CPF QC Feed ประเทศไทย",
        previous: "ก่อนหน้า",
        next: "ถัดไป",
        download: "ดาวน์โหลด",
        fileTitle: "ชื่อไฟล์",
        version: "เวอร์ชัน",
        date: "วันที่",
        for: "สำหรับ",
        detail: "รายละเอียด",
        passcodePrompt: "กรุณาใส่รหัสผ่านเพื่อดาวน์โหลดไฟล์" // ข้อความสำหรับ prompt
    },
    en: {
        title: "QC Feed",
        subtitle: "CPF QC Feed Thailand Center",
        previous: "Previous",
        next: "Next",
        download: "Download",
        fileTitle: "File Title",
        version: "Version",
        date: "Date",
        for: "For",
        detail: "Detail",
        passcodePrompt: "Please enter the password to download the file" // Prompt message
    },
    my: {
        title: "QC ဖိဒ်",
        subtitle: "CPF QC Feed မြန်မာ",
        previous: "ယခင်",
        next: "နောက်တစ်ခု",
        download: "ဒေါင်းလုပ်",
        fileTitle: "ဖိုင်အမည်",
        version: "ဗားရှင်း",
        date: "ရက်စွဲ",
        for: "အတွက်",
        detail: "အသေးစိတ်",
        passcodePrompt: "ဖိုင်ဒေါင်းလုပ်ရန် စကားဝှက်ထည့်ပါ" // Prompt message
    },
    ph: {
        title: "QC Feed",
        subtitle: "Sentro ng CPF QC Feed Thailand",
        previous: "Nakaraan",
        next: "Susunod",
        download: "I-download",
        fileTitle: "Pamagat ng File",
        version: "Bersyon",
        date: "Petsa",
        for: "Para sa",
        detail: "Detalyado",
        passcodePrompt: "Mangyaring ilagay ang password upang i-download ang file" // Prompt message
    },
    kh: {
        title: "Feed QC",
        subtitle: "មជ្ឈមណ្ឌល CPF QC Feed ប្រទេសថៃ",
        previous: "មុន",
        next: "បន្ទាប់",
        download: "ទាញយក",
        fileTitle: "ចំណងជើងឯកសារ",
        version: "ជំរៅ",
        date: "កាលបរិច្ឆេទ",
        for: "សម្រាប់",
        detail: "លម្អិត",
        passcodePrompt: "សូមបញ្ចូលសារពើភ័ណ្ឌដើម្បីទាញយកឯកសារ" // Prompt message
    },
    vi: {
        title: "Thức ăn QC",
        subtitle: "Trung tâm CPF QC Feed Thái Lan",
        previous: "Trước",
        next: "Tiếp theo",
        download: "Tải xuống",
        fileTitle: "Tiêu đề Tập tin",
        version: "Phiên bản",
        date: "Ngày",
        for: "Cho",
        detail: "Chi tiết",
        passcodePrompt: "Vui lòng nhập mật khẩu để tải xuống tệp" // Prompt message
    },
    lo: {
        title: "ສາຍ QC",
        subtitle: "ສູນ CPF QC Feed ປະເທດໄທ",
        previous: "ກ່ອນ",
        next: "ຕໍ່ໄປ",
        download: "ໂຫຼດ",
        fileTitle: "ຊື່ແຟຊິໄຟ",
        version: "ເພີ່ມເຕີ",
        date: "ວັນທີ",
        for: "ສໍາລັບ",
        detail: "ລາຍລະອຽດ",
        passcodePrompt: "ກະລຸນາໃສ່ລະຫັດຜ່ານເພື່ອດາວน์โหลดໄຟล์" // Prompt message
    },
    bd: {
        title: "QC ফিড",
        subtitle: "CPF QC Feed থাইল্যান্ড সেন্টার",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
        download: "ডাউনলোড",
        fileTitle: "ফাইলের শিরোনাম",
        version: "সংস্করণ",
        date: "তারিখ",
        for: "জন্য",
        detail: "বিস্তারিত",
        passcodePrompt: "ফাইল ডাউনলোড করার জন্য অনুগ্রহ করে পাসওয়ার্ড প্রবেশ করুন" // Prompt message
    }
    // สามารถเพิ่มการแปลสำหรับภาษาอื่น ๆ ตามต้องการ
};


async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        files = await response.json();
        displayFiles();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function convertToDownloadLink(url) {
    const fileIdMatch = url.match(/\/d\/(.*?)\//);
    if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
    }
    console.warn("Invalid URL format: ", url);
    return url; 
}

function displayFiles() {
    const fileContainer = document.getElementById("file-list");
    fileContainer.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedFiles = files.slice(start, end);

    paginatedFiles.forEach(file => {
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";

        const downloadLink = file.path ? convertToDownloadLink(file.path) : "#";
        let downloadButton;

        if (file.path) {
            if (file.for === "admin") {
                downloadButton = `<button class="download-btn" onclick="promptPasscode('${downloadLink}')">${translations[currentLanguage].download}</button>`;
            } else {
                downloadButton = `<a href="${downloadLink}" target="_blank" class="download-btn">${translations[currentLanguage].download}</a>`;
            }
        } else {
            downloadButton = `<button class="download-btn disabled" disabled>${translations[currentLanguage].download}</button>`;
        }

        fileItem.innerHTML = `
            <div class="file-info">
            ${/*<img src="${file.icon}" alt="File icon">*/''}
                <h2>${translations[currentLanguage].fileTitle}: ${file.title}</h2>
                <p>${translations[currentLanguage].version}: ${file.version}</p>
                <p>${translations[currentLanguage].date}: ${file.date}</p>
                <p>${translations[currentLanguage].for}: ${file.for}</p>
                <p>${translations[currentLanguage].detail}: ${file.detail}</p>
            </div>
            ${downloadButton}
        `;
        fileContainer.appendChild(fileItem);
    });

    const totalPages = Math.ceil(files.length / itemsPerPage);
    document.getElementById("page-info").innerText = `${translations[currentLanguage].previous} ${currentPage} ${translations[currentLanguage].next} ${totalPages}`;
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = end >= files.length;
}

function nextPage() {
    if (currentPage * itemsPerPage < files.length) {
        currentPage++;
        displayFiles();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayFiles();
    }
}

function promptPasscode(downloadLink) {
    const passcode = prompt(translations[currentLanguage].passcodePrompt);
    const correctPasscode = "adminth2"; // รหัสผ่านที่ถูกต้อง

    if (passcode === correctPasscode) {
        window.open(downloadLink, '_blank');
    } else {
        alert(translations[currentLanguage].incorrectPasscode);
    }
}


function changeLanguage(lang) {
    currentLanguage = lang; 
    document.getElementById("title").innerText = translations[currentLanguage].title;
    document.getElementById("subtitle").innerText = translations[currentLanguage].subtitle;

    // ปรับเนื้อหาในปุ่มหน้าก่อนหน้าและถัดไปให้เป็นภาษาที่เลือก
    document.getElementById("prev-btn").innerText = translations[currentLanguage].previous;
    document.getElementById("next-btn").innerText = translations[currentLanguage].next;

    // อัปเดตไฟล์และเนื้อหาที่แสดงให้เป็นภาษาที่เลือก
    displayFiles(); 
}



// เรียก fetchData เมื่อโหลดหน้าเว็บ
fetchData();
