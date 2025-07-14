function showDrinkDetails(id, container) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.drinks && data.drinks.length > 0) {
        const drink = data.drinks[0];
        const ingredients = [];

        for (let i = 1; i <= 15; i++) {
          const ing = drink[`strIngredient${i}`];
          const measure = drink[`strMeasure${i}`];
          if (ing) ingredients.push(`${measure || ""} ${ing}`.trim());
        }

        container.innerHTML += `
          <p><strong>Ingredienser:</strong><br>${ingredients.join("<br>")}</p>
          <p><strong>Fremgangsmåte:</strong> ${drink.strInstructions}</p>
        `;
      }
    })
    .catch(error => {
      container.innerHTML += "<p>Noe gikk galt ved lasting av detaljer.</p>";
      console.error(error);
    });
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("result");
  container.innerHTML = "";

  if (!searchTerm) {
    container.innerHTML = "<p>Skriv inn et søkeord.</p>";
    return;
  }

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      if (data.drinks && Array.isArray(data.drinks)) {
        data.drinks.forEach(drink => {
          const card = document.createElement("div");
          card.className = "drink-card";
          card.innerHTML = `
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
            <div class="drink-info">
              <h3>${drink.strDrink}</h3>
              <div class="drink-details"></div>
            </div>
          `;
          container.appendChild(card);
          const detailsContainer = card.querySelector(".drink-details");
          showDrinkDetails(drink.idDrink, detailsContainer);
        });
      } else {
        container.innerHTML = "<p>Ingen drinker funnet.</p>";
      }
    })
    .catch(error => {
      container.innerHTML = "<p>En feil oppstod. Prøv igjen senere.</p>";
      console.error(error);
    });
});

document.getElementById("findBtn").addEventListener("click", () => {
  const checked = document.querySelectorAll('input[name="ingredient"]:checked');
  const ingredients = Array.from(checked).map(i => i.value);
  const container = document.getElementById("matchResult");
  container.innerHTML = "";

  if (ingredients.length === 0) {
    container.innerHTML = "<p>Velg minst én ingrediens først.</p>";
    return;
  }

  const query = ingredients.join(",");
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${query}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      if (data.drinks && Array.isArray(data.drinks)) {
        data.drinks.forEach(drink => {
          const card = document.createElement("div");
          card.className = "drink-card";
          card.innerHTML = `
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
            <div class="drink-info">
              <h3>${drink.strDrink}</h3>
              <div class="drink-details"></div>
            </div>
          `;
          container.appendChild(card);
          const detailsContainer = card.querySelector(".drink-details");
          showDrinkDetails(drink.idDrink, detailsContainer);
        });
      } else {
        container.innerHTML = "<p>Ingen drinker funnet med de valgte ingrediensene.</p>";
      }
    })
    .catch(error => {
      container.innerHTML = "<p>En feil oppstod. Prøv igjen senere.</p>";
      console.error(error);
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('result').innerHTML = '';
  document.getElementById('matchResult').innerHTML = '';
  document.getElementById('drinkDetails').innerHTML = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('input[name="ingredient"]').forEach(cb => cb.checked = false);
});