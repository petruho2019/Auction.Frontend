document.getElementById('productForm').addEventListener('submit', async function (event) {
      document.querySelectorAll(".error-message").forEach(el => el.innerText = "");
      event.preventDefault();

      const form = event.target;
      const fileInput = document.getElementById('imageInput');
      const file = fileInput.files[0];

      if (!file) {
        alert("Выберите изображение.");
        return;
      }

    
      // Читаем файл как base64 строку (более надежный способ)
      const base64Image = await readFileAsBase64(file);

      // Формируем JSON-объект
      const data = {
        name: form.name.value,
        description: form.description.value,
        location: form.location.value,
        quantity: parseInt(form.quantity.value),
        images: [base64Image], // отправляем base64 строку
        price: parseInt(form.price.value)
      };

      try {
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

          const firstError = Object.values(errorData.errors)[0][0]; // Берем первый элемент из массива ошибок

          const errorMessage = document.querySelector('.error-message');
          errorMessage.textContent = firstError || 'Ошибка при создании продукта';
          errorMessage.removeAttribute('hidden');
        }

        const result = await response.json();
        console.log('Продукт создан:', result);
        alert('Продукт успешно создан!');
        return result;
        
      } catch (error) {
        console.error('Ошибка:', error);
      }
  });

    function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // берем только данные после запятой
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}