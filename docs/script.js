/**
 * BlockCell PDF Extractor - Main JavaScript File
 * Comprehensive functionality for PDF extraction website
 * Author: BlockCell Team
 * Version: 1.0.0
 */

class BlockCellPDFExtractor {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupIntersectionObserver();
    }

    init() {
        // Configuration
        this.config = {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['application/pdf'],
            animationDuration: 300,
            processingTime: 3000 // Simulated processing time
        };

        // State management
        this.state = {
            isProcessing: false,
            currentFile: null,
            extractedText: '',
            dragCounter: 0
        };

        // DOM elements cache
        this.elements = {
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),
            uploadBtn: document.getElementById('upload-btn'),
            progressContainer: document.getElementById('progress-container'),
            progressBar: document.getElementById('progress-bar'),
            progressText: document.getElementById('progress-text'),
            resultsContainer: document.getElementById('results-container'),
            extractedContent: document.getElementById('extracted-content'),
            downloadBtn: document.getElementById('download-btn'),
            copyBtn: document.getElementById('copy-btn'),
            errorContainer: document.getElementById('error-container'),
            errorMessage: document.getElementById('error-message'),
            filePreview: document.getElementById('file-preview'),
            fileName: document.getElementById('file-name'),
            fileSize: document.getElementById('file-size'),
            clearBtn: document.getElementById('clear-btn')
        };

        this.setupInitialState();
    }

    setupInitialState() {
        // Hide elements initially
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'none';
        }
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.style.display = 'none';
        }
        if (this.elements.errorContainer) {
            this.elements.errorContainer.style.display = 'none';
        }
        if (this.elements.filePreview) {
            this.elements.filePreview.style.display = 'none';
        }
    }

    bindEvents() {
        // File upload events
        this.setupFileUpload();
        
        // Navigation events
        this.setupSmoothScrolling();
        
        // Button interactions
        this.setupButtonInteractions();
        
        // Form validation
        this.setupFormValidation();
        
        // Keyboard accessibility
        this.setupKeyboardNavigation();
    }

    setupFileUpload() {
        if (!this.elements.dropZone) return;

        // Drag and drop events
        this.elements.dropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            this.state.dragCounter++;
            this.elements.dropZone.classList.add('drag-over');
        });

        this.elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.elements.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.state.dragCounter--;
            if (this.state.dragCounter === 0) {
                this.elements.dropZone.classList.remove('drag-over');
            }
        });

        this.elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.state.dragCounter = 0;
            this.elements.dropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelection(files[0]);
            }
        });

        // File input change
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelection(e.target.files[0]);
                }
            });
        }

        // Upload button click
        if (this.elements.uploadBtn) {
            this.elements.uploadBtn.addEventListener('click', () => {
                if (this.elements.fileInput) {
                    this.elements.fileInput.click();
                }
            });
        }

        // Clear button
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => {
                this.clearFile();
            });
        }
    }

    handleFileSelection(file) {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }

        this.hideError();
        this.state.currentFile = file;
        this.showFilePreview(file);
        this.processFile(file);
    }

    validateFile(file) {
        // Check file type
        if (!this.config.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                message: 'Please select a PDF file only.'
            };
        }

        // Check file size
        if (file.size > this.config.maxFileSize) {
            return {
                valid: false,
                message: `File size must be less than ${this.formatFileSize(this.config.maxFileSize)}.`
            };
        }

        return { valid: true };
    }

    showFilePreview(file) {
        if (!this.elements.filePreview) return;

        if (this.elements.fileName) {
            this.elements.fileName.textContent = file.name;
        }
        if (this.elements.fileSize) {
            this.elements.fileSize.textContent = this.formatFileSize(file.size);
        }

        this.elements.filePreview.style.display = 'block';
        this.animateElement(this.elements.filePreview, 'fadeInUp');
    }

    clearFile() {
        this.state.currentFile = null;
        this.state.extractedText = '';
        
        if (this.elements.fileInput) {
            this.elements.fileInput.value = '';
        }
        
        this.hideFilePreview();
        this.hideResults();
        this.hideProgress();
        this.hideError();
    }

    hideFilePreview() {
        if (this.elements.filePreview) {
            this.elements.filePreview.style.display = 'none';
        }
    }

    async processFile(file) {
        if (this.state.isProcessing) return;

        this.state.isProcessing = true;
        this.showProgress();
        
        try {
            // Simulate PDF processing
            await this.simulateProcessing();
            
            // Generate mock extracted text
            const extractedText = this.generateMockExtractedText(file.name);
            this.state.extractedText = extractedText;
            
            this.hideProgress();
            this.showResults(extractedText);
            
        } catch (error) {
            this.hideProgress();
            this.showError('An error occurred while processing the PDF. Please try again.');
        } finally {
            this.state.isProcessing = false;
        }
    }

    showProgress() {
        if (!this.elements.progressContainer) return;

        this.elements.progressContainer.style.display = 'block';
        this.animateElement(this.elements.progressContainer, 'fadeInUp');
        
        // Reset progress
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = '0%';
        }
    }

    hideProgress() {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.style.display = 'none';
        }
    }

    async simulateProcessing() {
        const steps = [
            { progress: 20, message: 'Reading PDF file...' },
            { progress: 40, message: 'Analyzing document structure...' },
            { progress: 60, message: 'Extracting text content...' },
            { progress: 80, message: 'Processing formatting...' },
            { progress: 100, message: 'Complete!' }
        ];

        for (const step of steps) {
            await this.updateProgress(step.progress, step.message);
            await this.delay(this.config.processingTime / steps.length);
        }
    }

    async updateProgress(percentage, message) {
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${percentage}%`;
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = message;
        }
    }

    generateMockExtractedText(fileName) {
        return `# Extracted Text from ${fileName}

This is a sample of extracted text content from your PDF file. In a real implementation, this would contain the actual text extracted from the PDF document.

## Document Summary
- File processed successfully
- Text extraction completed
- Ready for download or copying

## Sample Content
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Key Features Extracted:
1. Headers and subheaders
2. Paragraph text
3. Lists and bullet points
4. Special formatting

This extracted content maintains the structure and formatting of the original document while providing clean, searchable text output.

---
*Extraction completed at ${new Date().toLocaleString()}*`;
    }

    showResults(text) {
        if (!this.elements.resultsContainer) return;

        if (this.elements.extractedContent) {
            this.elements.extractedContent.textContent = text;
        }

        this.elements.resultsContainer.style.display = 'block';
        this.animateElement(this.elements.resultsContainer, 'fadeInUp');
        
        // Scroll to results
        this.elements.resultsContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    hideResults() {
        if (this.elements.resultsContainer) {
            this.elements.resultsContainer.style.display = 'none';
        }
    }

    setupButtonInteractions() {
        // Copy to clipboard
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', async () => {
                await this.copyToClipboard();
            });
        }

        // Download functionality
        if (this.elements.downloadBtn) {
            this.elements.downloadBtn.addEventListener('click', () => {
                this.downloadText();
            });
        }

        // Add hover effects to all buttons
        const buttons = document.querySelectorAll('.btn, .button, button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    async copyToClipboard() {
        if (!this.state.extractedText) return;

        try {
            await navigator.clipboard.writeText(this.state.extractedText);
            this.showNotification('Text copied to clipboard!', 'success');
            
            // Visual feedback
            if (this.elements.copyBtn) {
                const originalText = this.elements.copyBtn.textContent;
                this.elements.copyBtn.textContent = 'Copied!';
                this.elements.copyBtn.classList.add('success');
                
                setTimeout(() => {
                    this.elements.copyBtn.textContent = originalText;
                    this.elements.copyBtn.classList.remove('success');
                }, 2000);
            }
        } catch (error) {
            this.showNotification('Failed to copy text. Please try again.', 'error');
        }
    }

    downloadText() {
        if (!this.state.extractedText || !this.state.currentFile) return;

        const blob = new Blob([this.state.extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.state.currentFile.name.replace('.pdf', '')}_extracted.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.showNotification('Download started!', 'success');
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            input.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals or clear current operation
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
            
            // Enter key on file drop zone
            if (e.key === 'Enter' && e.target === this.elements.dropZone) {
                if (this.elements.fileInput) {
                    this.elements.fileInput.click();
                }
            }
        });
    }

    handleEscapeKey() {
        // Close any open modals or reset state
        this.hideError();
        
        // Clear file if processing hasn't started
        if (!this.state.isProcessing && this.state.currentFile) {
            this.clearFile();
        }
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Utility methods
    animateElement(element, animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, this.config.animationDuration);
    }

    showError(message) {
        if (!this.elements.errorContainer) return;

        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
        }
        
        this.elements.errorContainer.style.display = 'block';
        this.animateElement(this.elements.errorContainer, 'shake');
    }

    hideError() {
        if (this.elements.errorContainer) {
            this.elements.errorContainer.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.className = `notification ${type} show`;

        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API methods
    reset() {
        this.clearFile();
        this.hideError();
    }

    getExtractedText() {
        return this.state.extractedText;
    }

    isProcessing() {
        return this.state.isProcessing;
    }
}

// CSS Animations and Styles (injected via JavaScript)
const injectStyles = () => {
    const styles = `
        /* Animation Classes */
        .fadeInUp {
            animation: fadeInUp 0.3s ease-out;
        }

        .shake {
            animation: shake 0.5s ease-in-out;
        }

        .animate-in {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.6s ease-out;
        }

        .fade-in, .slide-up, .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }

        /* Drag and Drop States */
        .drag-over {
            border-color: #007bff;
            background-color: rgba(0, 123, 255, 0.1);
            transform: scale(1.02);
        }

        /* Button States */
        .btn.success {
            background-color: #28a745;
            border-color: #28a745;
        }

        .field-error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        input.error, textarea.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }

        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            background-color: #28a745;
        }

        .notification.error {
            background-color: #dc3545;
        }

        .notification.info {
            background-color: #17a2b8;
        }

        /* Progress Bar Styles */
        .progress-bar {
            transition: width 0.3s ease;
        }

        /* Keyframes */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .notification {
                top: 10px;
                right: 10px;
                left: 10px;
                transform: translateY(-100%);
            }
            
            .notification.show {
                transform: translateY(0);
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject styles
    injectStyles();
    
    // Initialize the main application
    window.blockCellExtractor = new BlockCellPDFExtractor();
    
    // Add global error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        if (window.blockCellExtractor) {
            window.blockCellExtractor.showNotification('An unexpected error occurred.', 'error');
        }
    });
    
    // Add unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        if (window.blockCellExtractor) {
            window.blockCellExtractor.showNotification('An error occurred while processing.', 'error');
        }
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlockCellPDFExtractor;
}
