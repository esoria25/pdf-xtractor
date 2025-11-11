// Simple PDF Upload Functionality for existing HTML structure
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const uploadCard = document.getElementById('uploadCard');
    const optionsCard = document.getElementById('optionsCard');
    const resultsCard = document.getElementById('resultsCard');
    const extractBtn = document.getElementById('extractBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    let currentFile = null;
    
    // Make upload area clickable
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.backgroundColor = '#f8f9ff';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                handleFileSelect(files[0]);
            } else {
                alert('Please select a PDF file');
            }
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
    
    function handleFileSelect(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            alert('File size must be less than 50MB');
            return;
        }
        
        currentFile = file;
        showFilePreview(file);
        showOptionsCard();
    }
    
    function showFilePreview(file) {
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileDate = document.getElementById('fileDate');
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
        if (fileDate) fileDate.textContent = new Date(file.lastModified).toLocaleDateString();
        
        if (filePreview) filePreview.style.display = 'block';
    }
    
    function showOptionsCard() {
        if (optionsCard) optionsCard.style.display = 'block';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Extract button functionality
    if (extractBtn) {
        extractBtn.addEventListener('click', function() {
            if (!currentFile) {
                alert('Please select a PDF file first');
                return;
            }
            
            extractPDF();
        });
    }
    
    function extractPDF() {
        // Show loading overlay
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        
        // Simulate PDF processing
        setTimeout(function() {
            // Hide loading overlay
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            
            // Show results
            showResults();
        }, 3000);
    }
    
    function showResults() {
        // Hide other cards
        if (uploadCard) uploadCard.style.display = 'none';
        if (optionsCard) optionsCard.style.display = 'none';
        
        // Show results card
        if (resultsCard) resultsCard.style.display = 'block';
        
        // Add sample extracted text
        const extractedText = document.getElementById('extractedText');
        if (extractedText) {
            extractedText.value = `Sample extracted text from ${currentFile.name}:\n\nThis is a demonstration of the PDF extraction functionality.\n\nThe actual extraction would process the PDF content and display it here.\n\nFile: ${currentFile.name}\nSize: ${formatFileSize(currentFile.size)}\nProcessed: ${new Date().toLocaleString()}`;
        }
        
        // Update stats
        const extractionStats = document.getElementById('extractionStats');
        if (extractionStats) {
            extractionStats.innerHTML = `
                <span>📄 ${Math.floor(Math.random() * 10) + 1} pages processed</span>
                <span>📝 ${Math.floor(Math.random() * 1000) + 500} words extracted</span>
                <span>⏱️ ${Math.floor(Math.random() * 3) + 1}s processing time</span>
            `;
        }
    }
    
    // Global functions for button clicks
    window.removeFile = function() {
        currentFile = null;
        if (filePreview) filePreview.style.display = 'none';
        if (optionsCard) optionsCard.style.display = 'none';
        if (fileInput) fileInput.value = '';
    };
    
    window.reset = function() {
        currentFile = null;
        if (uploadCard) uploadCard.style.display = 'block';
        if (optionsCard) optionsCard.style.display = 'none';
        if (resultsCard) resultsCard.style.display = 'none';
        if (filePreview) filePreview.style.display = 'none';
        if (fileInput) fileInput.value = '';
    };
    
    window.extractText = function() {
        if (extractBtn) extractBtn.click();
    };
    
    window.downloadExcel = function() {
        if (currentFile) {
            // Create a simple Excel-like content
            const content = document.getElementById('extractedText').value;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentFile.name.replace('.pdf', '_extracted.txt');
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    
    window.downloadText = function() {
        if (currentFile) {
            const content = document.getElementById('extractedText').value;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentFile.name.replace('.pdf', '_extracted.txt');
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    
    window.copyText = function() {
        const extractedText = document.getElementById('extractedText');
        if (extractedText) {
            extractedText.select();
            document.execCommand('copy');
            alert('Text copied to clipboard!');
        }
    };
    
    window.togglePreview = function() {
        const extractedText = document.getElementById('extractedText');
        if (extractedText) {
            if (extractedText.style.height === '400px') {
                extractedText.style.height = '150px';
            } else {
                extractedText.style.height = '400px';
            }
        }
    };
});
