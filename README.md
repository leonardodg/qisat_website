# Site QiSat - Frontend Template
Site Desenvolvido pela Equipe QiSat.
 
## Requirements

  * Ruby 1.9+
  * [Node.js](http://nodejs.org)
  * [compass](http://compass-style.org/): `gem install compass`

## Quickstart
 
  * Open folder Project the terminal
  * Enter in the root
  * Insert the command "npm build"

## Precisa de ajuda com Git?
  * Git: http://rogerdudler.github.io/git-guide/index.pt_BR.html

 be happy :)


## ATENÇÃO: CORREÇÃO Lib Modernizr - Run Build

      - UPGRADE File /node_modules/npm-modernizr/modernizr.js
      - Ultima linha do arquivos
      - Error: document is undefined
  >> })(typeof window !== "undefined" ? window : this, typeof window !== "undefined" ? window.document : this.document);