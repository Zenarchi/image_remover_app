document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const processImageBtn = document.getElementById('processImageBtn');
    const statusMessage = document.getElementById('statusMessage');
    const processedImage = document.getElementById('processedImage');
    const uploadSection = document.getElementById('uploadSection');
    const resultSection = document.getElementById('resultSection');
    const nextImageBtn = document.getElementById('nextImageBtn');

    // Function to show a status message
    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `message ${type}`;
        statusMessage.style.display = 'block';
    }

    // Function to reset the UI for a new upload
    function resetUI() {
        uploadSection.style.display = 'block'; // Show upload elements
        resultSection.style.display = 'none'; // Hide result preview
        processedImage.src = '#'; // Clear image source
        imageUpload.value = ''; // Clear selected file
        statusMessage.style.display = 'none'; // Hide status message
        statusMessage.textContent = ''; // Clear message text
    }

    // Event listener for the main processing button
    processImageBtn.addEventListener('click', async () => {
        const file = imageUpload.files[0];

        if (!file) {
            showMessage('Please select an image file first!', 'error');
            return;
        }

        showMessage('Processing image, please wait...', 'loading');
        
        // Hide upload section during processing
        uploadSection.style.display = 'none'; 

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/remove-background', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob(); 
                const url = URL.createObjectURL(blob); 

                // Display the processed image in the preview
                processedImage.src = url;
                resultSection.style.display = 'block'; // Show result section

                showMessage('Background removed successfully! Downloading...', 'success');

                // Trigger download
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'transparent_image.png'; 
                document.body.appendChild(downloadLink); 
                downloadLink.click(); 
                document.body.removeChild(downloadLink); 

                // Revoke the Object URL after a short delay
                setTimeout(() => URL.revokeObjectURL(url), 1000);

            } else {
                const errorMessage = await response.text(); 
                showMessage(`Error: ${errorMessage}`, 'error');
                uploadSection.style.display = 'block'; // Show upload section again on error
            }
        } catch (error) {
            console.error('Network or processing error:', error);
            showMessage('An unexpected error occurred. Please try again.', 'error');
            uploadSection.style.display = 'block'; // Show upload section again on error
        }
    });

    // Event listener for the "Process Another Image" button
    nextImageBtn.addEventListener('click', () => {
        resetUI();
    });

    // Initial state: ensure the upload section is visible and result hidden
    resetUI(); 
});