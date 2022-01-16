const Resultado = document.getElementById("Resultado");

const ulLista = document.getElementById("ulLista");

const progressBarra = document.getElementById("progressBarra");

let numMaxTentativas = 10;
let MaxNumEscondido = 101;

let numTentativas = 0;
let numeroEscondido = Math.floor(Math.random() * MaxNumEscondido);

document.getElementById("btnTentar").addEventListener("click", () => {
    console.log(numeroEscondido);

    const numUser = document.getElementById("txtTentativa").value;

    Resultado.classList.remove("alert-primary");
    Resultado.classList.remove("alert-success");
    Resultado.classList.remove("alert-danger");
    Resultado.classList.remove("alert-warning");


    if (numMaxTentativas === numTentativas) {
        Resultado.classList.add("alert-primary");
        swal("Fim da linha", "Já não tens mais tentativas 🛑", "warning");
        fimJogo();
    } else {
        if (numUser) {
            numTentativas++;
            const li = document.createElement("li");
            li.innerHTML = numTentativas + " - " + numUser;
            li.classList.add("list-group-item");

            if (numUser == numeroEscondido) {
                swal("Parabens", "Acertaste no número! ✅", "success");
                Resultado.innerHTML = "Acertaste no número! ✅";
                Resultado.classList.add("alert-success");

                li.classList.add("list-group-item-success");

            } else if (numUser <= numeroEscondido) {
                Resultado.innerHTML = "Número escolhido muito pequeno! 👇";
                Resultado.classList.add("alert-danger");

                li.classList.add("list-group-item-danger");

            } else {
                Resultado.innerHTML = "Número escolhido é grande demais! ☝️";
                Resultado.classList.add("alert-warning");

                li.classList.add("list-group-item-warning");
            }
            ulLista.appendChild(li);

        } else {
            Resultado.classList.add("alert-primary");
            swal("Aviso", "Tens que escrver um número!", "error");
        }
    }
}
);
document.getElementById("btnOptions").addEventListener("click", () => {
    numMaxTentativas = Number(document.getElementById("MaxTentativas").value);
    MaxNumEscondido = Number(document.getElementById("MaxNum").value);
    console.log("Tentativas = " + numMaxTentativas);
    console.log("Escondido = " + MaxNumEscondido);
    swal("Alteração", "Factos alterados 👩‍🔧", "info");
    limparTabuleiro();
});

function limparTabuleiro() {
    document.getElementById("btnTentar").disabled = false;
    numeroEscondido = Math.floor(Math.random() * MaxNumEscondido);
    swal("Novo", "Novo número escondiso 🤔", "info");
    Resultado.innerHTML = "Manda o teu palpite!";
    Resultado.classList.add("alert-primary");

    while (ulLista.hasChildNodes()) {
        ulLista.removeChild(ulLista.firstChild);
    }
}

function fimJogo() {
    document.getElementById("btnTentar").disabled = true;
    const resposta = confirm("Jogar de novo?")

    if (resposta) {
        limparTabuleiro();
    } else {
        swal("Nop", "Escolheste não jogar de novo 😞", "warning");
    }
}
