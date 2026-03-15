// Function to upload the video blob to Dropbox
async function uploadToCloud(videoBlob) {
    const ACCESS_TOKEN = 'sl.u.AGVevKL_fGZX213i6rJ7LRTT3InqPWZ44eTEA7Tg1b_-9LqDqWcbuIDxOTXUMd0KKS6XNmdDBP61_onM8NG2edqzkqMqBFBbvyWUi5eDTCKe6QDqmRvo7WdED7nj3qEDYzupj7Mx-lZ3K-iNr8wbFoe4MIYQSanGQR7Yd-nUp6dVPkOmd83szGigXboQ0S01ZzYR8infAdDtI_Rm_JfE7PYk89AiT1qCR_BcrRk_ia2D9ImuwbLDx9GbmpvvLDByZ5EgdnK3gGx3E0tGPKw0W696nMU608mMsLGg0HhjfyOb7N3AlgmLe1-bW4mOR4nJwiKUoeex050DN_clrBmMhNM3pMac2vYT3lhYxkPjTa-NQKUqU1tCJXzXFs6KPmpH5R5UQau6FepWGIkxti0C0rSpCCNEDIpwGT4QcIJAYD8aZmwH3nxZAqCRfPoWMpzq5-zJpi8_lsucai-F5uC4ZB3PHeDUL_iFVNBIns3eWA0b-6scWpTkN3WcSWmsYTfbH64Nem_LYtyYrzXonBBmjuwkExARd9agtK0HKZjsZS5KY6u59l9RTkOKYgufAhk-8jBDB_wKnbNTGAirmoehhABfLFp9mpomlBqw0SB48cOuqeMwiLVQ6thAEx4jvrTAg1UKOZirZSI7dAOiQDjE5FvLIN7ASncSNvEJUaDyBhYTJ-tPnnJvYqaAKZetmZMhV_ZTfppnG_h8MwXM7KQJzlSAoIYlQO0j09ytnVW0yV5leCIgPn6qhBCV-1Cn8KqXd0wvDafIf8haAMRi3pbF3xpMWK2_KZXU-4k42F2QP1t941W0AbHw-s0bPFOXBUmAmkSSMM9uHJmyiErnJYJUpDDq0KYZA6cBEghI_dMa-LZTGZ2gcvpSjOfH11H6GhCDOA-VOXFklr-jB8lMz5hp5HZEJb_5VA3ec9onHVJOMgZTIatsnZ0QGE7TPu9yku4nQ6zWgmBJn2KtcKUYyFkPEEMhHndZrCfczCXjzgEtHsfqQiYfyCzKcceG3GlLiJIJOG8o8qAHGiHBGG6bOBirbOXKypx80EmCBk79nYDgGxG_q_oteRyFUF8D75TAvmyNQjsNlBZRCIi8hhGxZJ7XARbV9_cYxz5fy9ZCu2EQD8k5zwkYA2oeZqiTDraRCux3RLneEkdTgM05IzVsLi_sGme5q_Zf1ONWVCqhkzEWM9KklbzDumAQbxsFRSahmL4tARwWy54xwtcKBy7w8W2w7d46Ubsjtimky3L_nCZBufZv3hERJiqtmZAJ9pXBk_sWigvw7zmIeQfmdIv5ibTcRt47ixKOe0WSn8OVfCVXblnvBl5a_TTlkJBmQvkWhQeMBxVI3r5_8jznM0hWojKgQgTtJMPmJClwNGqWUsukjImY4is-iJRVL899A3NGY1RFLCGPAJFkG6gkchH-OR1zkipGecu-fDWR1YYDtEDFRZ5HMQ'; 
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

        const result = await response.json();
        console.log('Phase 2 Success: Video uploaded to Dropbox!', result);
        
        document.getElementById('warning-box').style.display = 'block';
    } catch (error) {
        console.error('Cloud Upload Failed:', error);
    }
}