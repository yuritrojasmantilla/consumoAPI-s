let departamentos = [];

const API_URL = "https://api-colombia.com/api/v1/Department";

async function cargarDepartamentos() {
    try {
        const respuesta = await fetch(API_URL);
        departamentos = await respuesta.json();
    } catch(error){
        alert(error.message);
    }
}

const input = document.getElementById("buscar");
const lista = document.getElementById("lista");
const infoDepartment = document.getElementById("infoDepartment");

input.addEventListener("input", () => {

    lista.innerHTML = "";

    const texto = input.value.toUpperCase();

    const resultados = departamentos.filter(dept => 
        dept.name.toUpperCase().includes(texto));

    resultados.forEach(dept => {
        const li = document.createElement("li");
        li.textContent = dept.name;

        li.addEventListener("click", () => {
            input.value = dept.name;
            lista.innerHTML = "";

            infoDepartment.innerHTML = `
                <h2>${departamentos.name}</h2>
                <p><strong>Descripción:</strong> ${departamentos.description}</p>
                <p><strong>Número de Municipios:</strong> ${departamentos.municipalities}
                <p><strong>Población:</strong> ${departamentos.population.toLocaleString()}</p>
            `;
        });

        lista.appendChild(li);
    });
});

cargarDepartamentos();