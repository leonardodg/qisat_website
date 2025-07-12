# Website Company QiSat - Frontend Template

## 💻 Desciption
**(DEPRECATED)**
System website developmented and used to company QiSat as access intregation with plataform Moodle via API

<img width="800" height="600" alt="homepage" src="https://github.com/leonardodg/website/blob/main/src/images/qisat_website.png?raw=true">

## 📋 Specification

- Moodle Version: 2.9.3 (Build: 20151109)
- PHP Version: PHP 5.6.40 (cli) (built: Jan 23 2019 00:10:05)
- Server version: Apache/2.4.25 (Debian)
- Docker: Debian GNU/Linux 9.13 (stretch)
- MySQL: mysql  Ver 14.14 Distrib 5.7.44

## 🚀 Quick Start

### Prerequisites
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Docker](https://www.docker.com/products/docker-desktop/)


## ⚠️ waring: FIX Lib Modernizr - Run Build

      - UPGRADE File /node_modules/npm-modernizr/modernizr.js
      - Ultima linha do arquivos
      - Error: document is undefined
  >> })(typeof window !== "undefined" ? window : this, typeof window !== "undefined" ? window.document : this.document);

  ## Setup and Quickstart

  >> config.rb = saida do arquivo de stylo do compass
      - output_style = #:expanded or :nested or :compact or :compressed

  >> config.json = variaveis de configuração do javascript ( AngularJS )

  >> Página principal = ./assets/index.html

  >> sitemap = Mapa de links do site ( SEO GOOGLE ) 
        - ./assets/sitemap.xml

  >> robots.txt = SEO GOOGLE 
      - Permitir ou liberar acesso ao conteudo do site para robo do Google 
      - ./assets/robots.txt

  >> Cross-storage = Permitir outros host alterar Cross-storage do site
      - file : assets/hub.html
      - Default : CrossStorageHub  { origin: /e-commerce.qisat.com.br$/, allow: ['get', 'set', 'del'] }
      - obs : sem esta permisão integração do login com e-commercer nao funciona

 >> npm start = run building

  >> gulp = File ./gulpfile.js
        - tarefa automática para roda building da aplicação
        - atenção: caso auterar arquiteturas das pastas do projeto arquilo deve ser atualizado.

  >> gitignore = arquivos que devem ser ignorados do repositorório

  >> Estrutura
      - pasta src : arquivos em desenvolvimento
      - pasta assets : todos os arquivos necessários e copilados para o site

  >> assets/.htaccess
      arquivos de configuração do servidor apache
      basicamente redireciona tudo para o arquivo assets/index.html

  >> Pasta asstes/.well-known/acme-challenge
      - apenas para validar certificado ssl (em dev pode s er ignorada)

### Installation and Running

1. Clone all projects repository:
```bash
   git clone https://github.com/leonardodg/qisat_docker.git docker
   git clone https://github.com/leonardodg/qisat_moodle.git moodle
   git clone https://github.com/leonardodg/qisat_ecommerce.git ecommerce
   git clone https://github.com/leonardodg/qisat_website.git website
```

2. Run docker:
```bash
   cd docker
   docker compose up -d --build
```

3. Install dependencies:
```bash
   cd website
   npm install
   npm start OR gulp build
```

4. Access the website in your browser:
```   https://website.qisat.local/ ```


## 🛠 Project Structure

```
QiSat
├── docker
├── ecommerce
├── moodle
├── moodledata
└── website ✔️
```

## 🌐 Links

- [docker](https://github.com/leonardodg/qisat_docker) - branch: master
- [ecommerce](https://github.com/leonardodg/qisat_ecommerce) - branch: master
- [moodle](https://github.com/leonardodg/qisat_moodle) - branch: MOODLE_29_QISAT
- [website](https://github.com/leonardodg/qisat_website) - branch: master

 ## 🤝 Contributing
- Teams Developer QiSat

 ## 📮 Contact
- LeonardoDG - [@le0dg](https://www.linkedin.com/in/le0dg)
- Website Link: [https://leodg.dev](https://leodg.dev)