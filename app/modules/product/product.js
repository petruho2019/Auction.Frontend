export async function createProduct(event) {
    document.querySelectorAll(".error-message").forEach(el => {
      el.textContent = "";
      el.setAttribute('hidden', 'true');
    });

    event.preventDefault();

    try {
      const form = event.target;
      const fileInput = document.getElementById('imageInput');
      const files = Array.from(fileInput.files);

      if (files.length === 0 || files.length > 10) {
          throw new Error("Пожалуйста, загрузите от 1 до 10 изображений.");
      }

      const images = await Promise.all(
          files.map(file => readFileAsBase64(file))
      );

      const data = {
          name: form.name.value.trim(),
          description: form.description.value.trim(),
          location: form.location.value.trim(),
          quantity: parseInt(form.quantity.value),
          images: images
      };
    
      const response = await fetch('https://localhost:7076/api/product/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const firstError = Object.values(errorData.errors)[0][0];
        const errorMessage = document.querySelector('.error-message');
        errorMessage.textContent = firstError || 'Ошибка при создании продукта';
        errorMessage.removeAttribute('hidden');
        return;
      }

      const result = await response.json();
      console.log('Продукт создан:', result);
      alert('Продукт успешно создан!');
      return result;
      
    } catch (error) {
      console.error('Ошибка:', error);
      const errorMessage = document.querySelector('.error-message');
      errorMessage.textContent = error.message;
      errorMessage.removeAttribute('hidden');
    }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}