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
            let certId = document.getElementById('certIdManual').value;

            // Generate ID if not provided
            if (!certId) {
                certId = 'DS-' + Math.floor(1000 + Math.random() * 9000) + '-' + new Date().getFullYear();
            }

            // Build Verification URL
            // In development, this is localhost. In production, use the vercel URL.
            const siteUrl = window.location.origin;
            const verifyUrl = `${siteUrl}/verify.html?id=${certId}`;

            // Clear previous QR code
            qrcodeContainer.innerHTML = '';

            // Generate New QR Code
            new QRCode(qrcodeContainer, {
                text: verifyUrl,
                width: 128,
                height: 128,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Display Results
            resCertId.innerText = certId;
            resCertUrl.innerText = verifyUrl;
            certResult.style.display = 'block';

            // Store in "Verified" Database (localStorage for prototype)
            const VERIFIED_CERTS_KEY = 'devsurge_verified_certs';
            let verifiedCerts = JSON.parse(localStorage.getItem(VERIFIED_CERTS_KEY) || '{}');

            verifiedCerts[certId] = {
                name: studentName,
                course: course,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            localStorage.setItem(VERIFIED_CERTS_KEY, JSON.stringify(verifiedCerts));

            alert('Certificate Created and Verified ID stored locally!');
        });
    }

    // Global Print Function
    window.printCertificate = function () {
        const certId = resCertId.innerText;
        const studentName = document.getElementById('certStudentName').value;
        const course = document.getElementById('certCourse').value;
        const qrcodeImg = qrcodeContainer.querySelector('img').src;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Dev Surge Certificate - ${studentName}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; text-align: center; padding: 50px; background: #f4f4f4; }
                    .cert-border { border: 15px solid #0072ff; padding: 50px; background: white; position: relative; max-width: 800px; margin: auto; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { color: #0072ff; font-size: 40px; font-weight: bold; margin-bottom: 10px; }
                    .sub-header { font-size: 20px; color: #555; margin-bottom: 40px; }
                    .student-name { font-size: 35px; border-bottom: 2px solid #333; display: inline-block; margin-bottom: 10px; padding: 0 20px; }
                    .course-text { font-size: 20px; margin: 20px 0; }
                    .course-name { font-weight: bold; color: #0072ff; font-size: 24px; }
                    .qr-section { margin-top: 50px; display: flex; justify-content: space-around; align-items: flex-end; }
                    .footer-text { font-size: 14px; color: #888; margin-top: 50px; }
                    .verify-tag { font-size: 12px; color: #0072ff; font-weight: bold; margin-top: 5px; }
                </style>
            </head>
            <body>
                <div class="cert-border">
                    <div class="header">DEV SURGE INFOTECH</div>
                    <div class="sub-header">CERTIFICATE OF COMPLETION</div>
                    <p>This is to certify that</p>
                    <div class="student-name">${studentName}</div>
                    <p class="course-text">has successfully completed the immersive track in</p>
                    <div class="course-name">${course}</div>
                    <p>attained on ${new Date().toLocaleDateString()}</p>
                    
                    <div class="qr-section">
                        <div style="text-align: left;">
                            <p><strong>Verified ID:</strong> ${certId}</p>
                            <p style="font-size: 12px; max-width: 250px;">Scan the QR code to verify this certificate's authenticity on our official portal.</p>
                        </div>
                        <div>
                            <img src="${qrcodeImg}" width="120">
                            <div class="verify-tag">VERIFY AUTHENTICITY</div>
                        </div>
                    </div>
                    
                    <div class="footer-text">© 2026 Dev Surge Infotech Solutions. All rights reserved.</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
});
