// ====== Magazine Download Function ======
    function downloadMagazine(filename) {
      // Simulasi download file - dalam implementasi nyata, ini akan mengakses file dari folder assets
      const link = document.createElement('a');
      
      // Path ke file magazine di folder assets (sesuaikan dengan struktur folder Anda)
      link.href = `assets/magazines/${filename}`;
      link.download = filename;
      
      // Fallback jika file tidak ditemukan, bisa redirect ke URL alternatif
      link.onerror = function() {
        alert(`File ${filename} tidak ditemukan. Silakan hubungi administrator.`);
      };
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Optional: Analytics tracking
      console.log(`Downloaded: ${filename}`);
    }