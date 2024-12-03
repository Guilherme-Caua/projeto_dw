$(document).ready(function () {
    const produtos = [
        "Maçã Gala 1kg",
        "Banana Prata 1kg",
        "Laranja Pera 1kg",
        "Abacaxi 1 unidade",
        "Tomate 1kg",
        "Cenoura 1kg",
        "Alface Americana 1 unidade",
        "Morango 250g",
        "Uva Itália 500g",
        "Batata Doce 1kg"
    ];
    
    const precos = [
        7.90,
        5.50,
        6.40,
        8.00,
        4.20,
        3.80,
        3.50,
        6.90,
        12.00,
        6.00
    ];

    const imagens = [
        "img/macagala.jpg",
        "img/bananaprata.jpeg",
        "img/laranjapera.jpg",
        "img/abacaxi.png",
        "img/tomate.jpg",
        "img/cenoura.png",
        "img/alfaceamericana.jpg",
        "img/morango.png",
        "img/uvaitalia.jpg",
        "img/batatadoce.jpg"
    ];

    let soma = 0;

    // Variáveis do toast
    const toastLiveAdicionado = document.getElementById('liveToastAdicionado');
    const toastBootstrapAdicionado = bootstrap.Toast.getOrCreateInstance(toastLiveAdicionado);

    const toastLiveErro = document.getElementById('liveToastErro');
    const toastBootstrapErro = bootstrap.Toast.getOrCreateInstance(toastLiveErro);

    const toastLiveConfirmado = document.getElementById('liveToastConfirmado');
    const toastBootstrapConfirmado = bootstrap.Toast.getOrCreateInstance(toastLiveConfirmado);

    // Variáveis do modal
    const finalizarCompraButton = document.getElementById('botao-finalizar-compra');
    const compraModal = new bootstrap.Modal(document.getElementById('compraModal'));

    // Adicionar produtos dinamicamente
    for (let i = 0; i < produtos.length && i < precos.length; i++) {
        if (precos[i] !== undefined && produtos[i].length >= 1) {
            $('#lista-produtos').append(`
                <div class="col">
                    <div class="card h-100">
                        <img src="${imagens[i] || 'img/default.jpg'}" class="card-img-top" alt="${produtos[i]}" style="max-height: 150px; object-fit: contain;">
                        <div class="card-body">
                            <h5 class="card-title produto-nome" data-index="${i}">${produtos[i]}</h5>
                            <p class="card-text">Preço: <span class="precos">R$${precos[i].toFixed(2)}</span></p>
                            <div class="input-group mb-3">
                                <input type="number" class="form-control quantidade" data-index="${i}" placeholder="Quantidade">
                                <button class="btn btn-primary botao-quantidade" data-index="${i}">Adicionar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    }

    // Adicionar unidade ao clicar no nome do item
    $('#lista-produtos').on('click', '.produto-nome', function () {
        const i = $(this).data('index');
        const itemExistente = $(`.carrinho-item[data-index="${i}"]`);

        if (itemExistente.length) {
            // Incrementar a quantidade de um item que já existe
            let novaQuantidade = parseInt(itemExistente.data('quantidade')) + 1;
            itemExistente.data('quantidade', novaQuantidade);
            itemExistente.find('.quantidade-texto').text(`Quantidade: ${novaQuantidade}`);
            itemExistente.find('.precos').text(`R$${(novaQuantidade * precos[i]).toFixed(2)}`);
        } else {
            // Adicionar novo item ao carrinho
            $('#carrinho').append(`
                <div class="list-group-item carrinho-item" data-index="${i}" data-quantidade="1">
                    <h5>${produtos[i]}</h5>
                    <p class="quantidade-texto">Quantidade: 1</p>
                    <p>Preço: <span class="precos">R$${precos[i].toFixed(2)}</span></p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-danger btn-sm botao-remover-unidade" data-index="${i}">Remover 1 unidade</button>
                        <button class="btn btn-danger btn-sm botao-remover-tudo" data-index="${i}">Remover tudo</button>
                    </div>
                </div>
            `);
        }

        soma += precos[i];
        $('#total').html(`Total: <span class="precos">R$${soma.toFixed(2)}</span>`);

        toastBootstrapAdicionado.show()
    });

    // Adicionar produtos por quantidade, acumulando
    $('#lista-produtos').on('click', '.botao-quantidade', function () {
        const i = $(this).data('index');
        let quantidade = parseInt($('.quantidade[data-index="' + i + '"]').val());

        if (isNaN(quantidade) || quantidade <= 0) {
            alert('Por favor, insira uma quantidade válida.');
            return;
        }

        const precoTotal = precos[i] * quantidade;
        const itemExistente = $(`.carrinho-item[data-index="${i}"]`);

        if (itemExistente.length) {
            let novaQuantidade = parseInt(itemExistente.data('quantidade')) + quantidade;
            itemExistente.data('quantidade', novaQuantidade);
            itemExistente.find('.quantidade-texto').text(`Quantidade: ${novaQuantidade}`);
            itemExistente.find('.precos').text(`R$${(novaQuantidade * precos[i]).toFixed(2)}`);
        } else {
            $('#carrinho').append(`
                <div class="list-group-item carrinho-item" data-index="${i}" data-quantidade="${quantidade}">
                    <h5>${produtos[i]}</h5>
                    <p class="quantidade-texto">Quantidade: ${quantidade}</p>
                    <p>Preço: <span class="precos">R$${precoTotal.toFixed(2)}</span></p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-danger btn-sm botao-remover-unidade" data-index="${i}">Remover 1 unidade</button>
                        <button class="btn btn-danger btn-sm botao-remover-tudo" data-index="${i}">Remover tudo</button>
                    </div>
                </div>
            `);
        }

        soma += precoTotal;
        $('#total').html(`Total: <span class="precos">R$${soma.toFixed(2)}</span>`);
    });

    // Remove uma unidade do item
    $('#carrinho').on('click', '.botao-remover-unidade', function () {
        const item = $(this).closest('.carrinho-item');
        const i = item.data('index');
        let quantidadeAtual = parseInt(item.data('quantidade'));

        if (quantidadeAtual > 1) {
            quantidadeAtual -= 1;
            item.data('quantidade', quantidadeAtual);
            item.find('.quantidade-texto').text(`Quantidade: ${quantidadeAtual}`);
            item.find('.precos').text(`R$${(quantidadeAtual * precos[i]).toFixed(2)}`);
        } else {
            item.remove();
        }

        soma -= precos[i];
        $('#total').html(`Total: <span class="precos">R$${soma.toFixed(2)}</span>`);
    });

    // Remove todos os itens de um produto específico
    $('#carrinho').on('click', '.botao-remover-tudo', function () {
        const item = $(this).closest('.carrinho-item');
        const i = item.data('index');
        const quantidade = parseInt(item.data('quantidade'));
        const precoTotal = precos[i] * quantidade;

        soma -= precoTotal;
        item.remove();
        $('#total').html(`Total: <span class="precos">R$${soma.toFixed(2)}</span>`);
    });

    // Limpar carrinho
    $('#botao-limpar').click(function () {
        $('#carrinho').empty();
        soma = 0;
        $('#total').html(`Total: <span class="precos">R$${soma.toFixed(2)}</span>`);
    });

    // Mostrar o modal de finalizar compra, caso o total não seja 0
    $('#botao-finalizar-compra').click(function () {
        if(soma == 0){
            toastBootstrapErro.show()
        } else {
            compraModal.show();
        }
    });

    // Botão de confirmar compra, checa se todos os campos do formulário estão preenchidos e prossegue com o recebimento do pedido
    $('#botao-confirmar-compra').click(function () {
        const formCompra = document.getElementById('form-compra');

        if (!formCompra.checkValidity()) {
            formCompra.reportValidity();
            return;
        }

        toastBootstrapConfirmado.show();
        setTimeout(function() {
            location.reload();
          }, 5000);
    });



    // Funções do ViaCEP (viacep.com.br)
    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#rua").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#uf").val("");
    };
    
    //Quando o campo cep perde o foco.
    $("#cep").blur(function() {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                $("#rua").val("...");
                $("#bairro").val("...");
                $("#cidade").val("...");
                $("#uf").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#rua").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#uf").val(dados.uf);
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();
                        alert("CEP não encontrado.");
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });
});
