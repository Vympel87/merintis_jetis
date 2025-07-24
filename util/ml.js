// Form functionality
    document.addEventListener('DOMContentLoaded', function() {
      const cobaBtn = document.getElementById('cobaBtn');
      const backBtn = document.getElementById('backBtn');
      const mainContent = document.getElementById('mainContent');
      const formSection = document.getElementById('formSection');
      const umkmForm = document.getElementById('umkmForm');
      const successCard = document.getElementById('successCard');
      const errorCard = document.getElementById('errorCard');
      const submitText = document.getElementById('submitText');
      const loadingText = document.getElementById('loadingText');
      const resultStatus = document.getElementById('resultStatus');
      const resultConfidence = document.getElementById('resultConfidence');
      const errorMessage = document.getElementById('errorMessage');

      // Show form when "Coba" button is clicked
      cobaBtn.addEventListener('click', function() {
        mainContent.classList.add('hidden');
        formSection.classList.remove('hidden');
        window.scrollTo(0, 0);
      });

      // Show main content when "Back" button is clicked
      backBtn.addEventListener('click', function() {
        formSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        successCard.classList.add('hidden');
        errorCard.classList.add('hidden');
        umkmForm.reset();
        window.scrollTo(0, 0);
      });

      // Enhanced number formatting for currency inputs with no limits
      function formatCurrency(value) {
        // Remove all non-digit characters
        const cleanValue = value.replace(/\D/g, '');
        
        if (!cleanValue) return '';
        
        // Convert to number and format with Indonesian locale
        const number = parseInt(cleanValue);
        return number.toLocaleString('id-ID');
      }

      function parseCurrency(value) {
        // Remove all non-digit characters and return as number
        const cleanValue = value.replace(/\D/g, '');
        return cleanValue ? parseInt(cleanValue) : 0;
      }

      // Apply currency formatting to all currency inputs
      const currencyInputs = document.querySelectorAll('.currency-input');
      
      currencyInputs.forEach(input => {
        // Store original value on input
        input.addEventListener('input', function(e) {
          const cursorPosition = e.target.selectionStart;
          const oldLength = e.target.value.length;
          
          // Format the value
          const formatted = formatCurrency(e.target.value);
          e.target.value = formatted;
          
          // Adjust cursor position after formatting
          const newLength = formatted.length;
          const lengthDiff = newLength - oldLength;
          const newCursorPosition = Math.max(0, cursorPosition + lengthDiff);
          
          // Set cursor position
          setTimeout(() => {
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
          }, 0);
        });

        // Format on paste
        input.addEventListener('paste', function(e) {
          setTimeout(() => {
            const formatted = formatCurrency(e.target.value);
            e.target.value = formatted;
          }, 0);
        });

        // Format on focus out
        input.addEventListener('blur', function(e) {
          const formatted = formatCurrency(e.target.value);
          e.target.value = formatted;
        });
      });

      // Handle form submission
      umkmForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');
        umkmForm.querySelector('button[type="submit"]').disabled = true;
        
        // Hide previous results
        successCard.classList.add('hidden');
        errorCard.classList.add('hidden');

        // Collect form data dengan validasi yang diperbaiki
        const formData = new FormData(umkmForm);
        
        // Function untuk safely parse integer - improved version
        const safeParseInt = (value) => {
          if (!value || value === '') return 0;
          
          // Handle both formatted currency and plain numbers
          let cleanValue;
          if (typeof value === 'string') {
            // Remove all non-digit characters (dots, commas, spaces, etc.)
            cleanValue = value.replace(/\D/g, '');
          } else {
            cleanValue = value.toString().replace(/\D/g, '');
          }
          
          const parsed = parseInt(cleanValue, 10);
          return isNaN(parsed) ? 0 : parsed;
        };
        
        // Mapping untuk business type
        const businessTypeMap = {
          "0": "Kesehatan",
          "1": "Teknologi", 
          "2": "Pendidikan",
          "3": "Perdagangan",
          "4": "Fashion",
          "5": "Jasa",
          "6": "Kuliner"
        };
        
        // Mapping untuk marketplace
        const marketplaceMap = {
          "0": "Bukalapak",
          "1": "Lazada",
          "2": "Website Sendiri", 
          "3": "Tokopedia",
          "4": "Shopee"
        };
        
        // Mapping untuk legal status
        const legalStatusMap = {
          "0": "Belum Terdaftar",
          "1": "Terdaftar"
        };
        
        const data = {
          "business type": businessTypeMap[formData.get('business_type')] || "Kesehatan",
          "total workers": safeParseInt(formData.get('total_workers')),
          "assets": safeParseInt(formData.get('assets')),
          "revenue": safeParseInt(formData.get('revenue')),
          "profit": safeParseInt(formData.get('profit')),
          "employee cost": safeParseInt(formData.get('employee_cost')),
          "marketplace": marketplaceMap[formData.get('marketplace')] || "Bukalapak",
          "legal status": legalStatusMap[formData.get('legal_status')] || "Belum Terdaftar",
          "production capacity": safeParseInt(formData.get('production_capacity')),
          "established year": safeParseInt(formData.get('established_year'))
        };

        // Debug: log data yang akan dikirim
        console.log('Data yang akan dikirim:', data);
        
        // Validasi data sebelum dikirim
        const requiredFields = ['business type', 'total workers', 'assets', 'revenue', 'profit', 'employee cost', 'marketplace', 'legal status', 'production capacity', 'established year'];
        const missingFields = requiredFields.filter(field => {
          const value = data[field];
          return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });
        
        if (missingFields.length > 0) {
          errorMessage.textContent = `Field berikut belum diisi: ${missingFields.join(', ')}`;
          errorCard.classList.remove('hidden');
          errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Reset loading state
          submitText.classList.remove('hidden');
          loadingText.classList.add('hidden');
          umkmForm.querySelector('button[type="submit"]').disabled = false;
          return;
        }

        // Additional validation for numeric values
        const numericFields = ['total workers', 'assets', 'revenue', 'profit', 'employee cost', 'production capacity', 'established year'];
        const invalidNumericFields = numericFields.filter(field => {
          const value = data[field];
          return isNaN(value) || value < 0;
        });
        
        if (invalidNumericFields.length > 0) {
          errorMessage.textContent = `Field berikut harus berisi angka yang valid: ${invalidNumericFields.join(', ')}`;
          errorCard.classList.remove('hidden');
          errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Reset loading state
          submitText.classList.remove('hidden');
          loadingText.classList.add('hidden');
          umkmForm.querySelector('button[type="submit"]').disabled = false;
          return;
        }

        try {
          // Send POST request to API
          const response = await fetch('https://4639c966-8a13-4e16-9b44-6288cfe3b25a-00-3cs5i45fyq3xr.worf.replit.dev/api/ml/classify', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.status === 'success') {
            // Show success result
            resultStatus.textContent = result.data.status;
            resultConfidence.textContent = (result.data.confidence * 100).toFixed(1) + '%';
            successCard.classList.remove('hidden');
            
            // Scroll to result
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // Show error card with API error message
            errorMessage.textContent = result.message || result.detail || 'Terjadi kesalahan dalam klasifikasi. Silakan coba lagi.';
            errorCard.classList.remove('hidden');
            errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch (error) {
          console.error('Error:', error);
          
          // Try to get more detailed error info for 422 errors
          if (error.message.includes('422')) {
            try {
              const errorResponse = await error.response?.json?.();
              const validationErrors = errorResponse?.detail || [];
              
              if (Array.isArray(validationErrors) && validationErrors.length > 0) {
                const errorMessages = validationErrors.map(err => 
                  `Field '${err.loc?.join?.('.')  || 'unknown'}': ${err.msg || 'invalid'}`
                ).join(', ');
                errorMessage.textContent = `Validation Error: ${errorMessages}`;
              } else {
                errorMessage.textContent = 'Format data tidak sesuai dengan yang diharapkan server (422 error)';
              }
            } catch {
              errorMessage.textContent = 'Format data tidak sesuai dengan yang diharapkan server (422 error)';
            }
          } else if (error.message.includes('404') || error.message.includes('Not Found')) {
            errorMessage.textContent = 'Endpoint API tidak ditemukan. Silakan periksa URL server.';
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage.textContent = 'Tidak dapat terhubung ke server. Pastikan server berjalan dan dapat diakses.';
          } else {
            errorMessage.textContent = `Terjadi kesalahan: ${error.message}`;
          }
          
          errorCard.classList.remove('hidden');
          errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
          // Reset loading state
          submitText.classList.remove('hidden');
          loadingText.classList.add('hidden');
          umkmForm.querySelector('button[type="submit"]').disabled = false;
        }
      });
    });

    // Placeholder functions for external scripts
    function downloadMagazine(filename) {
      console.log('Download magazine:', filename);
      // Add your download logic here
    }