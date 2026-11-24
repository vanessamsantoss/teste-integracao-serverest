// Traz do Vitest as ferramentas para criar o teste e fazer as conferências
import { test, expect } from "vitest";

// Endereço da API que vamos testar
const loja = "https://serverest.dev";

// Cria o teste: o texto é o nome dele, e o async permite usar await dentro
test("colocar um produto no carrinho diminui o estoque do produto", async () => {

  // PASSO 1: criar uma conta

  // Gera um email diferente a cada execução, porque a API não aceita email repetido
  const email = `teste${Date.now()}@teste.com`;

  // Senha guardada numa constante para o cadastro e o login usarem a mesma
  const senha = "1234";

  // Envia o pedido de cadastro e espera a resposta
  const cadastro = await fetch(`${loja}/usuarios`, {
    method: "POST", // POST = criar algo novo
    headers: { "Content-Type": "application/json" }, // avisa que estamos mandando JSON
    body: JSON.stringify({ // transforma os dados em texto JSON
      nome: "Teste",
      email: email,
      password: senha,
      administrador: "true", // administrador pode cadastrar produtos
    }),
  });

  // Confere se o usuário foi criado (201 = criado com sucesso)
  expect(cadastro.status).toBe(201);


  // PASSO 2: fazer login e guardar o token

  // Envia email e senha para fazer login
  const login = await fetch(`${loja}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: senha,
    }),
  });

  // Confere se o login deu certo (200 = sucesso)
  expect(login.status).toBe(200);

  // Lê a resposta e diz ao TypeScript que ela tem um campo authorization (texto)
  const dadosLogin = (await login.json()) as { authorization: string };

  // Guarda o token, que é o "crachá" para os próximos pedidos
  const token = dadosLogin.authorization;


  // PASSO 3: cadastrar um produto com 10 unidades

  // Envia o pedido de cadastro do produto, mostrando o token
  const produto = await fetch(`${loja}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      nome: `Produto ${Date.now()}`, // nome diferente a cada execução
      preco: 100,
      descricao: "Produto de teste",
      quantidade: 10, // estoque inicial
    }),
  });

  // Confere se o produto foi criado
  expect(produto.status).toBe(201);

  // Lê a resposta e diz ao TypeScript que ela tem um campo _id (texto)
  const dadosProduto = (await produto.json()) as { _id: string };
  const idProduto = dadosProduto._id;


  // PASSO 4: colocar 3 unidades no carrinho

  // Envia o pedido de criação do carrinho com o produto
  const carrinho = await fetch(`${loja}/carrinhos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      produtos: [{ idProduto: idProduto, quantidade: 3 }], // lista de produtos do carrinho
    }),
  });

  // Confere se o carrinho foi criado
  expect(carrinho.status).toBe(201);


  // PASSO 5: olhar o produto e conferir o estoque

  // Consulta o produto pelo id (sem method = GET, só consultar)
  const consulta = await fetch(`${loja}/produtos/${idProduto}`);

  // Confere se a consulta deu certo
  expect(consulta.status).toBe(200);

  // Lê a resposta e diz ao TypeScript que ela tem um campo quantidade (número)
  const produtoAtualizado = (await consulta.json()) as { quantidade: number };

    // A conferência principal: era 10, colocamos 3 no carrinho, tem que ser 7
  expect(produtoAtualizado.quantidade).toBe(7);

}, 15000); // o teste pode levar até 15 segundos
// TESTE: cancelar a compra devolve o estoque do produto
// Partes da API usadas:
//   POST   /usuarios                    -> cria a conta de administrador
//   POST   /login                       -> faz login e devolve o token
//   POST   /produtos                    -> cadastra o produto com 10 unidades
//   POST   /carrinhos                   -> coloca 3 unidades do produto no carrinho
//   DELETE /carrinhos/cancelar-compra   -> cancela a compra
//   GET    /produtos/{id}               -> consulta o produto para ver o estoque
// O que o teste confere no final: depois de cancelar a compra, o estoque
// do produto volta para 10.
test("cancelar uma compra", async () => {
      // PASSO 1: criar uma conta

  // Gera um email diferente a cada execução, porque a API não aceita email repetido
  const email = `teste${Date.now()}@teste.com`;

  // Senha guardada numa constante para o cadastro e o login usarem a mesma
  const senha = "1234";

  // Envia o pedido de cadastro e espera a resposta
  const cadastro = await fetch(`${loja}/usuarios`, {
    method: "POST", // POST = criar algo novo
    headers: { "Content-Type": "application/json" }, // avisa que estamos mandando JSON
    body: JSON.stringify({ // transforma os dados em texto JSON
      nome: "Teste",
      email: email,
      password: senha,
      administrador: "true", // administrador pode cadastrar produtos
    }),
  });

  // Confere se o usuário foi criado (201 = criado com sucesso)
  expect(cadastro.status).toBe(201);


  // PASSO 2: fazer login e guardar o token

  // Envia email e senha para fazer login
  const login = await fetch(`${loja}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: senha,
    }),
  });

  // Confere se o login deu certo (200 = sucesso)
  expect(login.status).toBe(200);

  // Lê a resposta e diz ao TypeScript que ela tem um campo authorization (texto)
  const dadosLogin = (await login.json()) as { authorization: string };

  // Guarda o token, que é o "crachá" para os próximos pedidos
  const token = dadosLogin.authorization;


  // PASSO 3: cadastrar um produto com 10 unidades

  // Envia o pedido de cadastro do produto, mostrando o token
  const produto = await fetch(`${loja}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      nome: `Produto ${Date.now()}`, // nome diferente a cada execução
      preco: 100,
      descricao: "Produto de teste",
      quantidade: 10, // estoque inicial
    }),
  });

  // Confere se o produto foi criado
  expect(produto.status).toBe(201);

  // Lê a resposta e diz ao TypeScript que ela tem um campo _id (texto)
  const dadosProduto = (await produto.json()) as { _id: string };
  const idProduto = dadosProduto._id;


    // PASSO 4: colocar 3 unidades no carrinho

  // Envia o pedido de criação do carrinho com o produto
  const carrinho = await fetch(`${loja}/carrinhos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      produtos: [{ idProduto: idProduto, quantidade: 3 }], // lista de produtos do carrinho
    }),
  });

  // Confere se o carrinho foi criado
  expect(carrinho.status).toBe(201);
    const cancelamento = await fetch(`${loja}/carrinhos/cancelar-compra`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  expect(cancelamento.status).toBe(200);

  const consulta = await fetch(`${loja}/produtos/${idProduto}`);
  const produtoAtualizado = (await consulta.json()) as { quantidade: number };

  expect(produtoAtualizado.quantidade).toBe(10);
}, 15000)

// TESTE: não permite apagar um produto que está em um carrinho
// Partes da API usadas:
//   POST   /usuarios        -> cria a conta de administrador
//   POST   /login           -> faz login e devolve o token
//   POST   /produtos        -> cadastra o produto com 10 unidades
//   POST   /carrinhos       -> coloca 3 unidades do produto no carrinho
//   DELETE /produtos/{id}   -> tenta apagar o produto que está no carrinho
// O que o teste confere no final: a API recusa a exclusão (status 400).
test("não permite apagar um produto que está em um carrinho", async () => {
      // PASSO 1: criar uma conta

  // Gera um email diferente a cada execução, porque a API não aceita email repetido
  const email = `teste${Date.now()}@teste.com`;

  // Senha guardada numa constante para o cadastro e o login usarem a mesma
  const senha = "1234";

  // Envia o pedido de cadastro e espera a resposta
  const cadastro = await fetch(`${loja}/usuarios`, {
    method: "POST", // POST = criar algo novo
    headers: { "Content-Type": "application/json" }, // avisa que estamos mandando JSON
    body: JSON.stringify({ // transforma os dados em texto JSON
      nome: "Teste",
      email: email,
      password: senha,
      administrador: "true", // administrador pode cadastrar produtos
    }),
  });

  // Confere se o usuário foi criado (201 = criado com sucesso)
  expect(cadastro.status).toBe(201);


  // PASSO 2: fazer login e guardar o token

  // Envia email e senha para fazer login
  const login = await fetch(`${loja}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: senha,
    }),
  });

  // Confere se o login deu certo (200 = sucesso)
  expect(login.status).toBe(200);

  // Lê a resposta e diz ao TypeScript que ela tem um campo authorization (texto)
  const dadosLogin = (await login.json()) as { authorization: string };

  // Guarda o token, que é o "crachá" para os próximos pedidos
  const token = dadosLogin.authorization;


  // PASSO 3: cadastrar um produto com 10 unidades

  // Envia o pedido de cadastro do produto, mostrando o token
  const produto = await fetch(`${loja}/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      nome: `Produto ${Date.now()}`, // nome diferente a cada execução
      preco: 100,
      descricao: "Produto de teste",
      quantidade: 10, // estoque inicial
    }),
  });

  // Confere se o produto foi criado
  expect(produto.status).toBe(201);

  // Lê a resposta e diz ao TypeScript que ela tem um campo _id (texto)
  const dadosProduto = (await produto.json()) as { _id: string };
  const idProduto = dadosProduto._id;


    // PASSO 4: colocar 3 unidades no carrinho

  // Envia o pedido de criação do carrinho com o produto
  const carrinho = await fetch(`${loja}/carrinhos`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({
      produtos: [{ idProduto: idProduto, quantidade: 3 }], // lista de produtos do carrinho
    }),
  });

  // Confere se o carrinho foi criado
  expect(carrinho.status).toBe(201);
      // PASSO 5: tentar apagar o produto que está dentro do carrinho
  const exclusao = await fetch(`${loja}/produtos/${idProduto}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });

  // A API deve recusar. O teste passa justamente porque ela recusou
  expect(exclusao.status).toBe(400);
}, 15000)


