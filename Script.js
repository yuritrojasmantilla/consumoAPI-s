const botones = document.querySelectorAll(".btn-explorar");

botones.forEach((boton) => {
    boton.addEventListener("click", () => {

        const card = boton.closest(".card");
        const contenido = card.querySelector(".contenido");

        contenido.classList.toggle("oculto");
        if(contenido.classList.contains("oculto")) {
            boton.textContent = "Explorar";
        } else {
            boton.textContent = "Ocultar";
        }
    });
});

let departamentos = [];
let areasNaturales = [];
let aeropuertos = [];
const API_URL = "https://api-colombia.com/api/v1";

async function consumirAPI(endpoint) {
    try {
        const respuesta = await fetch(`${API_URL}${endpoint}`);
        return await respuesta.json();
    } catch(error){
        alert(error.message);
    }
};

async function consultarDepartamento() {
    departamentos = await consumirAPI("/Department");

    const input = document.getElementById("buscar");
    const lista = document.getElementById("listaDept");
    const infoDepartment = document.getElementById("infoDepartment");

    input.addEventListener("input", () => {
        lista.innerHTML = "";

        const texto = input.value.toUpperCase();
        const resultados = departamentos.filter(dept => 
            dept.name.toUpperCase().includes(texto)).slice(0, 10);

        resultados.forEach(dept => {
            const li = document.createElement("li");
            li.textContent = dept.name;

            li.addEventListener("click", () => {
                input.value = dept.name;
                lista.innerHTML = "";

                infoDepartment.innerHTML = `
                    <h2>${dept.name}</h2>
                    <p><strong>Descripción:</strong> ${dept.description}</p>
                    <p><strong>Número de Municipios:</strong> ${dept.municipalities}</p>
                    <p><strong>Población:</strong> ${dept.population.toLocaleString()}</p>
                `;
            });

            lista.appendChild(li);
        });
    });
};

async function consultarAeropuertos() {
    aeropuertos = await consumirAPI("/Airport");

    const select = document.getElementById("tipoAeropuerto");
    const lista = document.getElementById("listaAirpt");
    const infoAirpt = document.getElementById("infoAirpt");

    const tipos = [
        ...new Set(
            aeropuertos.map(aeropuerto => aeropuerto.type)
        )
    ];

    tipos.forEach(tipo => {
        const option = document.createElement("option");

        option.value = tipo;
        option.textContent = tipo;

        select.appendChild(option);

    });

    select.addEventListener("change", () => {

        lista.innerHTML = "";
        infoAirpt.innerHTML = "";

        const tipoSeleccionado = select.value;

        const resultados = aeropuertos.filter(aeropuerto =>
            aeropuerto.type === tipoSeleccionado
        );

        resultados.forEach(aeropuerto => {

            const li = document.createElement("li");
            li.textContent = aeropuerto.name;

            li.addEventListener("click", () => {

                infoAirpt.innerHTML = `
                    <h2>${aeropuerto.name}</h2>
                    <p><strong>Tipo:</strong> ${aeropuerto.type}</p>
                    <p><strong>Departamento:</strong> ${aeropuerto.department.name}</p>
                `;
            });

            lista.appendChild(li);

        });
    });
};

async function consultarAreasNaturales() {

    areasNaturales = await consumirAPI("/NaturalArea");

    const input = document.getElementById("buscarA");
    const lista = document.getElementById("listaANat");
    const infoANat = document.getElementById("infoANat");

    function mostrarAreas(datos) {

        lista.innerHTML = "";

        datos.forEach(area => {
            const li = document.createElement("li");
            li.textContent = area.name;

            li.addEventListener("click", () => {

                infoANat.innerHTML = `
                    <h2>${area.name}</h2>
                    <p><strong>Descripción:</strong> ${area.description || "Sin descripción disponible"}</p>
                    <p><strong>Área H:</strong> ${area.landArea}</p>
                `;
            });

            lista.appendChild(li);

        });
    }

    const areasUnicasIniciales = areasNaturales.filter(
        (area, indice, arreglo) =>
            indice === arreglo.findIndex(
                a => a.name === area.name
            )
    );

    mostrarAreas(areasUnicasIniciales);

    input.addEventListener("input", () => {
        const texto = input.value.toUpperCase();

        const resultados = areasNaturales.filter(area =>
            area.name.toUpperCase().includes(texto)
        );

        const areasUnicas = resultados.filter(
            (area, indice, arreglo) =>
                indice === arreglo.findIndex(
                    a => a.name === area.name
                )
        );

        mostrarAreas(areasUnicas.slice(0,10));
    });
}


consultarDepartamento();
consultarAeropuertos();
consultarAreasNaturales();