document.addEventListener('DOMContentLoaded', () => {
    const certForm = document.getElementById('certForm');
    const certResult = document.getElementById('certResult');
    const qrcodeContainer = document.getElementById('qrcode');
    const resCertId = document.getElementById('resCertId');
    const resCertUrl = document.getElementById('resCertUrl');

    if (certForm) {
        certForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentName = document.getElementById('certStudentName').value;
            const course = document.getElementById('certCourse').value;
            const issueDateRaw = document.getElementById('certIssueDate').value;
            let certId = document.getElementById('certIdManual').value;

            // Format Date
            const dateObj = new Date(issueDateRaw);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            // Generate ID if not provided
            if (!certId) {
                // Create a prefix based on course initials (e.g. MOP for Microsoft Office Productivity)
                const prefix = course.split(' ').map(w => w[0]).join('').toUpperCase().replace(/[^A-Z]/g, '');
                certId = `DS-${prefix}-${dateObj.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            }

            // Build Verification URL
            const siteUrl = window.location.origin;
            const verifyUrl = `${siteUrl}/verify.html?id=${certId}`;

            // Clear previous QR code
            qrcodeContainer.innerHTML = '';

            // Generate New QR Code
            // We use a slightly larger size for better quality in Canva
            new QRCode(qrcodeContainer, {
                text: verifyUrl,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Display Results
            resCertId.innerText = certId;
            resCertUrl.innerText = verifyUrl;
            certResult.style.display = 'block';

            // Store in "Verified" Database (Firebase Firestore)
            const certData = {
                name: studentName,
                course: course,
                date: formattedDate,
                id: certId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            const submitBtn = certForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Generating & Saving...';
            submitBtn.disabled = true;

            // 1. Always save to LocalStorage as a local history/fallback
            const VERIFIED_CERTS_KEY = 'devsurge_verified_certs';
            let localCerts = JSON.parse(localStorage.getItem(VERIFIED_CERTS_KEY) || '{}');
            localCerts[certId] = certData;
            localStorage.setItem(VERIFIED_CERTS_KEY, JSON.stringify(localCerts));

            // 2. Save to Cloud Firestore (The REAL Verification Source)
            if (window.db) {
                window.db.collection('verified_certs').doc(certId).set(certData)
                    .then(() => {
                        console.log("Certificate synced to cloud.");
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                        alert('Success! Certificate ID: ' + certId + ' has been synced to the global database.');
                    })
                    .catch((error) => {
                        console.error("Cloud Sync Error:", error);
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                        alert('Critical Error: Could not sync to cloud. Error: ' + error.message);
                    });
            } else {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                alert('Database Error: Cloud connection initialization failed.');
            }

            // Smooth scroll to result
            certResult.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Helper to Copy URL
    window.copyVerifyUrl = function () {
        const url = resCertUrl.innerText;
        navigator.clipboard.writeText(url).then(() => {
            alert('Verification Link copied to clipboard!');
        });
    };

    // Helper to Download QR Code for Canva
    window.downloadQRCode = function () {
        const qrImg = qrcodeContainer.querySelector('img');
        if (!qrImg) return;

        // Create a canvas to combine QR and Text
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Define dimensions
        const padding = 50;
        const textSpace = 70;
        canvas.width = qrImg.width + (padding * 2);
        canvas.height = qrImg.height + (padding * 2) + textSpace;

        // Fill background white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR Code
        ctx.drawImage(qrImg, padding, padding);

        // Draw Text "VERIFY AUTHENTICITY"
        ctx.fillStyle = '#0072ff'; // Brand Blue
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '2px';
        ctx.fillText('VERIFY AUTHENTICITY', canvas.width / 2, canvas.height - 50);

        // Trigger Download
        const link = document.createElement('a');
        link.download = `QR_${resCertId.innerText}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
});
