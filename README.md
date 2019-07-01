# Site QiSat - Frontend Template
Site Desenvolvido pela Equipe QiSat.
 
## Requirements

  * Ruby 1.9+
  * [Node.js](http://nodejs.org)
  * [compass](http://compass-style.org/): `gem install compass`

## ATENÇÃO: CORREÇÃO Lib Modernizr - Run Build

      - UPGRADE File /node_modules/npm-modernizr/modernizr.js
      - Ultima linha do arquivos
      - Error: document is undefined
  >> })(typeof window !== "undefined" ? window : this, typeof window !== "undefined" ? window.document : this.document);

  ## Setup and Quickstart

  >> ga-cron.php = arquivos cron ( script de tarefa automatica ) para atualizar analytics
      - variaveis:
      - $seach : endereço para buscar arquivo
      - save : local onde será salvo

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