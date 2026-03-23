const API_URL = "http://localhost:3000";

async function searchCountry() {
    const country = document.getElementById("countryInput").value.trim();
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");
    const loadingDiv = document.getElementById("loading");

    resultDiv.innerHTML = "";
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");

    if (!country) {
        errorDiv.textContent = "Introdueix un país";
        errorDiv.classList.remove("hidden");
        return;
    }

    try {
        loadingDiv.classList.remove("hidden");

        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);

        if (!response.ok) {
            throw new Error("País no trobat");
        }

        const data = await response.json();
        const countryData = data[0];

        resultDiv.innerHTML = `
            <h3>${countryData.name.common}</h3>
            <p>Capital: ${countryData.capital ? countryData.capital[0] : "No disponible"}</p>
            <p>Població: ${countryData.population}</p>
            <p>Regió: ${countryData.region}</p>
            <img src="${countryData.flags.png}" width="100">
            <br><br>
            <button onclick='addFavorite(${JSON.stringify({
                country: countryData.name.common,
                capital: countryData.capital ? countryData.capital[0] : "No disponible",
                region: countryData.region,
                population: countryData.population,
                flag: countryData.flags.png
            })})'>
                Afegir a favorits
            </button>
        `;
    } catch (error) {
        errorDiv.textContent = "Error: el país no existeix o no s'ha pogut carregar";
        errorDiv.classList.remove("hidden");
    } finally {
        loadingDiv.classList.add("hidden");
    }
}

async function addFavorite(countryData) {
    const errorDiv = document.getElementById("error");

    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(countryData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error en afegir favorit");
        }

        loadFavorites();
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
    }
}

async function loadFavorites() {
    const list = document.getElementById("favorites");

    try {
        const response = await fetch(`${API_URL}/favorites`);
        const data = await response.json();

        list.innerHTML = "";

        data.forEach(f => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${f.country}</strong> - ${f.capital} - ${f.region}
                <button onclick="deleteFavorite(${f.id})">Eliminar</button>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        list.innerHTML = "<li>Error carregant favorits</li>";
    }
}

async function deleteFavorite(id) {
    await fetch(`${API_URL}/favorites/${id}`, {
        method: "DELETE"
    });

    loadFavorites();
}

loadFavorites();