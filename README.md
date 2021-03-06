<h1 align="center"> Sistema AEE </h1>

Plataforma web para o gerenciamento de informações dos alunos da educação especializada da rede municipal de Uberlândia. Para entender um pouco mais do projeto, veja os [requisitos do sistema](./docs/requirements/README.md) ou acesse a [monografia do TCC](./docs/Monografia_TCC_Luiz_Henrique.pdf).

## 👨‍💻 Desenvolvedor

- Luiz <<luizhsou1@gmail.com>>

## 🚀 Algumas das Tecnologias/Libs

- [Nodejs](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Typeorm](https://typeorm.io/#/)
- [TSyringe](https://www.npmjs.com/package/tsyringe)
- [Winston](https://github.com/winstonjs/winston#readme)
- [AWS SDK](https://www.npmjs.com/package/aws-sdk)
- [Class Validator](https://www.npmjs.com/package/class-validator)
- [Class Transformer](https://www.npmjs.com/package/class-transformer)
- [Jest](https://jestjs.io/)
- [ESLint](https://www.npmjs.com/package/eslint)
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/en-US/)
  
## 🐳 Rode o projeto usando o docker compose

```sh
docker-compose up
```

## 😃 Acesse o sistema como admin:

1. Entre em http://localhost:4040
2. Informe o usuário: `admin@projetoaee.com.br`
3. Informe a senha: `projetoaee2022`

## 📄 Documentação da API:

Entre em http://localhost:4000/docs

> **Observação:**  
> 
> Este compose não contém configuração de serviço de e-mail real, logo em cenários que em produção enviaria um e-mail, apenas simulo este envio utilizando a ferramenta do [etheral](https://ethereal.email/). Assim sendo nos fluxos de `esqueceu a senha` deve observar o log, que nele constará a mensagem contendo um link para este e-mail simulado.  
> A imagem abaixo ilustra bem este log:  
> 
> ![Imagem de log da simulação de envio de e-mail](./simulated-send-email-log.png)