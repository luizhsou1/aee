<h1 align="center"> Requisitos do Sistema </h1>

> ⚠️ Obs: Essa é a folha de requisitos passada pelo meu orientador de TCC em conjunto com coordenadora do projeto na Escola Municipal Professor Jacy de Assis. Apenas transcrevi nesse markdown, para ficar mais fácil, para acessar os arquivos originais basta acessar as imagens contidas neste diretório.
Organizar as fichas dos alunos do Atendimento Educacional Especializado (AEE), de modo que a coordenação tenha acesso aos dados básicos e às turmas de cada professor, podendo cruzar e selecionar informações.

## 1. ALUNO

- **Nome**: Nome do aluno.
- **Responsáveis**: Permitir o cadastro dos responsáveis pelo aluno, assim como quais são seus responsáveis ativos (ex: Moram na mesma casa). O aluno pode ter mais de um resposável. O cadastro de responsável envolve o registro do seu **nome** e dos **telefones de contato**. Um responsável pode ter mais de um número de telefone associado a ele.
- **Data de Nascimento**: Data de nascimento no formato **DD/MM/AAAA**.
- **Deficiência**: Pode ser escolhida com base na tabela a seguir, lembrando que um aluno pode ter várias deficiências ([Anexo I]()). // TODO Pedir para o professor a tabela de deficiências e anexar aqui!

#### 1.1 Informações Regular:

- **Turno Regular**: Os valores podem ser **Manhã** ou **Tarde**.
- **Ano**: O usuário pode escolher **Ano** no intervalo [1..9]. Na tela apresentar 1º Ano, 2º Ano, etc., mas no banco gravar apenas o valor númerico correspondente.
- **Turma**: O usuário pode escolher **Turma** no intervalo de [A..M].
- **Sala**: O usuário pode informar apenas valores entre 1 e 19.

#### 1.2 Informações AEE:

- **Turno AEE**: O sistema deve preencher este campo automaticamente da seguinte maneira. Se **Turno Regular = Manhã** então **Turno AEE = Tarde**, e vice-versa.
- **Professores**: O usuário poderá selecionar dentre os professores cadastrados na tela cadastro de professores AEE. O aluno pode ter mais de professor AEE.
- **Turma AEE**: O usuário pode escolher **Turma AEE** no intervalo de [A..Z].
- **Atividades Extra AEE**: Neste campo deve-se poder escolher entre as duas opções **PSICOMOTRICIDADE**, **ARTETERAPIA**. Lembrando que o aluno pode fazer ambas ou nehnuma. Essa atividade extra não está vinculada ao professor, precisa deixar registrado apenas se faz ou não faz ela.
- **Professor de Apoio**: O usuário poderá selecionar o valor **Não** ou **UM** professor dentre os marcados como professor de apoio. Esse professor de apoio é o que acompanha o aluno.

## 2. PROFESSOR

- **Nome**: Nome do professor.
- **Situação**: **Cedido** ou **Dobra**.
- **Lotação de origem**: Escola de onde ele veio. Selecionado a partir da tabela lotação em anexo ([Anexo II]()). // TODO Pedir para o professor a tabela de escolas e anexar aqui!
- **Turno AEE**: Os valores podem ser **Manhã** e/ou **Tarde**.
- **Área de atuação**: Aqui sempre seleciona apenas 1, Os valores possíveis para este campo são:
    - 1º ao 5º ano;
    - Linguagem;
    - Raciocínio Lógico Matemático;
    - Arteterapia;
    - Psicomotricidade;
- **Professor de Apoio**: **Sim** ou **Não**. 

> Obs: No caso de professores de apoio que forem assinalados como **sim**, o campo área de atuação **deve** ficar em branco, não preenche a área de atuação!
## 3. LAUDOS E RELATÓRIOS

O documento será anexado como **imagem** ou **pdf**. O usuário poderá cadastrar mais de um documento.

## 4. NECESSIDADES DO SISTEMA

- Os alunos matriculados do AEE possuem duas matrículas : 01 no ensino regular e 01 no AEE -  Atendimento Educacional Especializado. Isso faz com que ele esteja registrado em dois "lugares" diferentes do sistema Web Acadêmico, que organiza as turmas e lançamentos de notas da Secretaria Municipal de Uberlândia.
- O AEE funciona sempre no contraturno. Sendo assim, turno do AEE tem que ser obrigatoriamente o oposto do regular.
- Ao longo do ano o aluno pode ser mudado de série e turma, de acordo com as necessidades pedagógicas de cada um.
- Cada turma corresponde a uma sala. Porém, ele poderá mudar de sala ao longo do ano também.
- Cada aluno tem vinculado aos seus dados um laudo médico, que pode ser scaneado e anexado como PDF. Os alunos que tiverem laudo terão um Relatório Pedagógico digitalizado, no mesmo formato.
- Somente alguns alunos possuem profissionais extras a sua disposição, chamados de Professores de Apoio e Cuidadores.