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
                // Create a prefix based on course initials
                const prefix = course.split(' ').map(w => w[0]).join('').toUpperCase();
                certId = `DS-${prefix}-${dateObj.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            }

            // Build Verification URL
            const siteUrl = window.location.origin;
            const verifyUrl = `${siteUrl}/verify.html?id=${certId}`;

            // Clear previous QR code
            qrcodeContainer.innerHTML = '';

            // Generate New QR Code
            new QRCode(qrcodeContainer, {
                text: verifyUrl,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Display Results
            resCertId.innerText = certId;
            resCertUrl.innerText = verifyUrl;
            certResult.style.display = 'block';

            // Store in "Verified" Database
            const VERIFIED_CERTS_KEY = 'devsurge_verified_certs';
            let verifiedCerts = JSON.parse(localStorage.getItem(VERIFIED_CERTS_KEY) || '{}');

            verifiedCerts[certId] = {
                name: studentName,
                course: course,
                date: formattedDate
            };

            localStorage.setItem(VERIFIED_CERTS_KEY, JSON.stringify(verifiedCerts));

            alert('Certificate Created Successfully!');
        });
    }

    // Global Print Function
    window.printCertificate = function () {
        const certId = resCertId.innerText;
        const studentName = document.getElementById('certStudentName').value;
        const course = document.getElementById('certCourse').value;
        const issueDateRaw = document.getElementById('certIssueDate').value;
        const qrcodeImg = qrcodeContainer.querySelector('img').src;

        const dateObj = new Date(issueDateRaw);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Dev Surge Certificate - ${studentName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Charm:wght@400;700&family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
                <style>
                    @page { size: landscape; margin: 0; }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Lato', sans-serif; 
                        background: #f0f0f0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        padding: 20px;
                    }
                    .certificate-container {
                        width: 297mm; /* A4 Landscape width */
                        height: 210mm; /* A4 Landscape height */
                        background: #020b1c; 
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 40px 60px;
                        color: white;
                        box-shadow: 0 50px 100px rgba(0,0,0,0.5);
                    }

                    /* Background Curves */
                    .curve-top {
                        position: absolute;
                        top: -150px;
                        right: -150px;
                        width: 500px;
                        height: 500px;
                        border: 4px solid rgba(226, 176, 76, 0.4);
                        border-radius: 50%;
                        z-index: 1;
                    }

                    .curve-bottom {
                        position: absolute;
                        bottom: -400px;
                        right: -100px;
                        width: 900px;
                        height: 900px;
                        border: 2px solid rgba(226, 176, 76, 0.2);
                        border-radius: 50%;
                        z-index: 1;
                    }

                    .logo-section {
                        z-index: 10;
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                    }

                    .logo-text {
                        font-weight: 700;
                        font-size: 1.1rem;
                        letter-spacing: 2px;
                        color: white;
                    }

                    .title-section {
                        z-index: 10;
                        text-align: center;
                        margin-bottom: 25px;
                    }

                    .title-main {
                        font-family: 'Playfair Display', serif;
                        font-size: 85px;
                        font-weight: 700;
                        letter-spacing: 4px;
                        line-height: 1;
                        margin-bottom: 5px;
                    }

                    .title-sub {
                        font-size: 28px;
                        font-weight: 300;
                        letter-spacing: 12px;
                        text-transform: uppercase;
                    }

                    .certifies-text {
                        font-family: 'Playfair Display', serif;
                        color: #e2b04c;
                        font-size: 20px;
                        margin-bottom: 20px;
                        z-index: 10;
                    }

                    .student-name {
                        font-family: 'Charm', cursive;
                        font-size: 82px;
                        color: white;
                        margin-bottom: 30px;
                        z-index: 10;
                    }

                    .completion-text {
                        font-size: 16px;
                        font-weight: 300;
                        margin-bottom: 12px;
                        z-index: 10;
                        max-width: 800px;
                        text-align: center;
                        opacity: 0.8;
                    }

                    .course-name {
                        font-family: 'Playfair Display', serif;
                        font-size: 38px;
                        color: #e2b04c;
                        font-weight: 700;
                        text-transform: uppercase;
                        margin-bottom: 15px;
                        z-index: 10;
                        letter-spacing: 1px;
                    }

                    .description {
                        font-size: 14px;
                        max-width: 700px;
                        text-align: center;
                        margin-bottom: 30px;
                        z-index: 10;
                        opacity: 0.7;
                        line-height: 1.5;
                    }

                    .award-date {
                        font-size: 16px;
                        margin-bottom: 30px;
                        z-index: 10;
                        font-weight: 300;
                    }

                    .footer-section {
                        margin-top: auto;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        z-index: 10;
                    }

                    .cert-id-section {
                        font-size: 12px;
                        font-weight: 300;
                        opacity: 0.8;
                    }

                    .signature-section {
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .qr-verify-section {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 15px;
                    }

                    .qr-verify-text {
                        font-size: 9px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #e2b04c;
                        font-weight: 700;
                    }

                    .signature-image {
                        font-family: 'Charm', cursive; 
                        font-size: 38px; 
                        color: #e2b04c; 
                        margin-bottom: -5px;
                    }

                    .signature-line {
                        width: 280px;
                        height: 1px;
                        background: rgba(255,255,255,0.5);
                        margin-bottom: 10px;
                    }

                    .signature-name {
                        font-weight: 700;
                        font-size: 18px;
                    }

                    .signature-title {
                        font-size: 13px;
                        font-weight: 300;
                        font-style: italic;
                        opacity: 0.8;
                    }

                    .seal-section {
                        position: absolute;
                        right: 200px;
                        bottom: 50px;
                        z-index: 5;
                    }

                    .seal-outer {
                        width: 110px;
                        height: 110px;
                        background: #e2b04c;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                        position: relative;
                    }

                    .seal-inner {
                        width: 95px;
                        height: 95px;
                        border: 1px solid rgba(0,0,0,0.1);
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }

                    .seal-text {
                        color: #1a1a1a;
                        font-size: 9px;
                        font-weight: 800;
                        line-height: 1.2;
                    }

                    @media print {
                        body { background: none; padding: 0; }
                        .certificate-container { box-shadow: none; border: none; }
                    }
                </style>
            </head>
            <body>
                <div class="certificate-container">
                    <div class="curve-top"></div>
                    <div class="curve-bottom"></div>

                    <div class="logo-section">
                        <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 5L10 25V75L50 95L90 75V25L50 5Z" stroke="#e2b04c" stroke-width="4"/>
                            <path d="M50 25L25 37.5V62.5L50 75L75 62.5V37.5L50 25Z" fill="#e2b04c"/>
                        </svg>
                        <div class="logo-text">DEV SURGE INFOTECH</div>
                    </div>

                    <div class="title-section">
                        <h1 class="title-main">CERTIFICATE</h1>
                        <p class="title-sub">of completion</p>
                    </div>

                    <p class="certifies-text">This certifies that</p>
                    
                    <h2 class="student-name">${studentName}</h2>

                    <p class="completion-text">Has successfully completed The Advanced Corporate Training Program:</p>
                    <h3 class="course-name">${course}</h3>

                    <p class="description">
                        An intensive performance-based training program demonstrating proficiency through 
                        comprehensive practical application, specialized industry-standard projects, 
                        and verified domain expertise.
                    </p>

                    <div class="award-date">Awarded on ${formattedDate}</div>

                    <div class="footer-section">
                        <div class="cert-id-section">
                            Certificate ID: ${certId}
                        </div>

                        <div class="signature-section">
                            <div class="qr-verify-section">
                                <div style="padding: 5px; background: white; border-radius: 4px;">
                                    <img src="${qrcodeImg}" width="85">
                                </div>
                                <span class="qr-verify-text">Verify Authenticity</span>
                            </div>
                            
                            <div class="signature-image">Martin Cofie</div>
                            <div class="signature-line"></div>
                            <p class="signature-name">Mr Martin Cofie</p>
                            <p class="signature-title">(Managing Director)</p>
                        </div>
                    </div>

                    <div class="seal-section">
                        <div class="seal-outer">
                            <div class="seal-inner">
                                <span class="seal-text">TECHNICAL<br>PROFICIENCY<br>VERIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        // Wait for images/fonts to load
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
});
