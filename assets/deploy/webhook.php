<?php

date_default_timezone_set('America/Sao_Paulo');
session_start();
$token = "d41d8cd98f00b204e9800998ecf8427e";
$senhaAcesso = 'qisat.123';

if( (isset($_REQUEST['senhaAcesso']) && $_REQUEST['senhaAcesso'] == $senhaAcesso) && !checkAccess()){
    $_SESSION['usuarioValido'] = true;
}

if(isset($_REQUEST['sair']) && $_REQUEST['sair']){
    unset($_SESSION['usuarioValido']);
}

function executaPull() {
    $exec = shell_exec("git pull origin master 2>&1");
    $textoLog = PHP_EOL."Data: ".date('d-m-Y H:i:s');
    $textoLog .= PHP_EOL.$exec;

    $arquivoLog = fopen('log.txt', 'a+');
    fwrite($arquivoLog, $textoLog);
    fclose($arquivoLog);

    return $exec;
}

/**
 * Verificar estar logado
 */
function checkAccess(){
    if(isset($_SESSION['usuarioValido']) && $_SESSION['usuarioValido'] === true){
        return true;
    }
    return false;
}


/**
 * Validar Token 
 */
function checkToken($token) {
    if(isset($_REQUEST['token']) && $_REQUEST['token'] == $token){
        return true;
    }
    return false;
}

function exibeLog() {
    $texto = file('deploy.txt');
    foreach ($texto as $linha) {
        echo $linha;
    }
}
?>

<!doctype html>
<html lang="pt_BR">
    <head>

        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Deploy Automático PHP  - QiSat | Cursos aplicados à engenharia e arquitetura</title>
        <link rel="stylesheet" type="text/css" href="/css/app.css">
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
        <script src="/js/app.js" type="text/javascript" charset="utf-8" defer></script>

        <style>
            
            .form-login {max-width: 330px; padding: 15px; margin: 0 auto;}

            pre {   
                    padding: 9.5px;
                    margin: 0 auto;
                    font-size: 13px;
                    line-height: 1.42857143;
                    color: #333;
                    word-break: break-all;
                    word-wrap: break-word;
                    background-color: #f5f5f5;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    width: 500px;
                    text-align: center;
                }

            input[type='submit']{
                    padding: 16px 16px 16px 16px;
                    font-size: 16px;
                    background-color: #1C5485;
                    color: #fefefe;
                    text-decoration: none;
                    font-family: "Lato", "Helvetica", "Arial", "sans-serif";
                    font-weight: bold;
                    border-radius: 26px;
                    -webkit-border-radius: 26px;
                    -moz-border-radius: 26px;
                    text-align: center;
                    width: 200px;
                    display: inline-block;
            }

            input[type='submit']:hover {
                background-color: #1560A0;
            }

        </style>

  </head>
  <body>

        <table align="center" class="header float-center">
            <tr>
            <td>
                <table align="center">
                <tbody>
                    <tr>
                    <td>
                        <table class="row">
                        <tbody>
                            <tr>
                            <th class="small-6 large-6 columns">
                                <a href="https://www.qisat.com.br" target="_blank">
                                <img src="/images/logos-altoqi-qisat-branco.png" class="float-center mobile-logo logo-topo">
                                </a>
                            </th>
                            </tr>
                        </tbody>
                        </table>
                        <table class="row">
                        <tbody>
                            <tr>
                            <th class="small-6 large-6 columns">
                                <h2 class="subtitle text-center">Deploy com GIT</h2>
                                <h4 class="subtitle text-center"> Email-Marketing </h4>
                            </th>
                            </tr>
                        </tbody>
                        </table>

                        <table class="row">
                        <tbody>
                            <tr>
                            <th class="small-6 large-6 columns">
                                <img src="/images/doc/deploy.png" class="float-center" alt="Deploy" title="Deploy" >
                            </th>
                            </tr>
                        </tbody>
                        </table>

                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </table>

        <table class="sidenav">
          <tr>
            <th>
              <table class="spacer">
                <tbody>
                  <tr>
                    <td>
                      <div href="#menu-list" id="toggle"><span></span></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </th>
          </tr>
          <tr>
            <th>
            <div id="menu-list">

                <button class="accordion"> <a href="/index.html#inicio">Início</a> </button>
                <ul class="panel">
                    <li><a href="/index.html#pre-requisitos">Pre-requisitos e Instalções</a></li>
                    <li><a href="/index.html#install-git">Instalação Git</a></li>
                    <li><a href="/index.html#install-node">Instalação NodeJS</a></li>
                    <li><a href="/index.html#install-gulp">Instalação Gulp</a></li>
                    <li><a href="/index.html#install-ruby">Instalação Ruby</a></li>
                    <li><a href="/index.html#install-compass">Instalação Compass</a></li>
                    <li><a href="/index.html#install-server">Instalação Servidor</a></li>
                </ul>

                <button class="accordion"><a href="#config">Configurar</a></button>
                <ul class="panel">
                    <li><a href="/index.html#clone">Clone Github</a></li>
                    <li><a href="/index.html#config-server">Configurar Servidor</a></li>
                    <li><a href="/index.html#Config-host">Configgurar Hosts</a></li>
                    <li><a href="/index.html#start">Start Projeto</a></li>
                </ul>

                <a href="/index.html#gulp">Gulp</a>
                <a href="/index.html#sass">Sass</a>
                <button class="accordion"><a>Componentes</a></button>
                <ul class="panel">
                    <li><a href="/index.html#alinhamentos">Alinhamentos</a></li>
                    <li><a href="/index.html#botões">Botões</a></li>
                    <li><a href="/index.html#listas">Listas</a></li>
                    <li><a href="/index.html#cards">Cards</a></li>
                    <li><a href="/index.html#ícones">Ícones</a></li>
                </ul>
                <a href="/index.html#foundation">Foundation Doc</a>
                <a href="/index.html#cabeçalhos">Cabeçalho</a>
                <a href="/index.html#rodapé">Rodapé</a>
                <a href="/index.html#grid">Grid</a>
                <button class="accordion"><a>Templates</a></button>
                <ul class="panel">
                    <li><a href="/index.html#template-basico">Template Básico</a></li>
                    <li><a href="/index.html#templates-qisat">Templates Qisat</a></li>
                </ul>

                </div>
            </th>
          </tr>
        </table>

        <table class="spacer">
            <tr>
                <td height="50px"></td>
            </tr>
        </table>

        <?php
            // Atualizar?
            if(checkToken($token)):
                $exec = executaPull();
                echo "<pre>".$exec."</pre>";
            ?>

            <table class="row">
                <tbody>
                <tr>
                    <th class="small-6 large-6 columns first last">
                    <table>
                        <tr>
                        <th class="float-center">
                            <a href="webhook.php" class="default-btn">Visualizar log completo</a>
                        </th>
                        </tr>
                    </table>
                    </th>
                </tr>
                </tbody>
            </table>
        <?php 
            // Logado?
            elseif(checkAccess()): ?>
            <form action="webhook.php" method="post" class="text-center">
                <div class="form-group">
                    <input type="hidden" name="token" value="<?=$token?>">

                    <table class="row">
                    <tbody>
                    <tr>
                        <th class="small-6 large-6 columns first last">
                        <table>
                            <tr>
                            <th class="float-center">
                                <input type="submit" value="Atualizar" >
                            </th>
                            </tr>
                        </table>
                        </th>
                    </tr>
                    </tbody>
                </table>
                </div>
            </form>

            <table class="row">
                <tbody>
                <tr>
                    <th class="small-6 large-6 columns first last">
                    <table>
                        <tr>
                            <th class="float-center">
                                <a href="webhook.php?sair=true" class="small">Sair</a>
                            </th>
                        </tr>
                    </table>
                    </th>
                </tr>
                </tbody>
            </table>

            <pre> <?= exibeLog() ?> </pre>
        <?php else: // default ?>
            
            <form action="webhook.php" method="post" class="form-login text-center">

                <table class="row">
                    <tbody>
                    <tr>
                        <th class="small-6 large-6 columns first last">
                        <table>
                            <tr> 
                                <th class="float-center">
                                    <input type="password" class="form-control" placeholder="Senha" name="senhaAcesso">      
                                </th>
                            </tr>
                        </table>
                        </th>
                    </tr>
                    </tbody>
                </table>

                <table class="row">
                    <tbody>
                    <tr>
                        <th class="small-6 large-6 columns first last">
                        <table>
                            <tr> 
                                <th class="float-center">
                                    <input type="submit" value="Verificar" class="btn btn-primary">
                                </th>
                            </tr>
                        </table>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </form>
        <?php endif; ?>

    <table class="spacer">
        <tr>
            <td height="50px"></td>
        </tr>
    </table>

    <table class="row">
        <tr>
            <td valign="top">
                <a href="https://www.qisat.com.br" target="_blank" >
                <img alt="Logo" class="float-center mobile-logo" src="/images/logo_topo.png">
                </a>
            </td>
        </tr>
    </table>

    <table class="row">
        <tr>
        <th class="small-1 large-6 columns rodape"></th>
        <th class="small-1 large-1 columns first float-center rodape">
            <a href="https://www.facebook.com/qisat" target="_blank">
            <p class="small-text-center icons-sprite icons-facebook"></p>
            </a>
        </th>
        <th class="small-1 large-1 columns float-center rodape">
            <a href="https://www.instagram.com/qisat/" target="_blank">
            <p class="small-text-center icons-sprite icons-instagram"></p>
            </a>
        </th>
        <th class="small-1 large-1 columns float-center rodape">
            <a href="https://br.linkedin.com/in/qisat" target="_blank">
            <p class=" icons-sprite icons-linkedin"></p>
            </a>
        </th>
        <th class="small-1 large-1 columns last float-center rodape">
            <a href="https://www.youtube.com/user/qisat" target="_blank">
            <p class="small-text-center icons-sprite icons-youtube"></p>
            </a>
        </th>
        <th class="small-1 large-6 columns rodape"></th>
        </tr>
    </table>

  </body>
</html>