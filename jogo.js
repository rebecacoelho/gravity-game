const sprites = new Image();
sprites.src = './sprites.png';

const apple = new Image();
apple.src = './apple.png'

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 1000,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#ffffff';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      chao.x, chao.y,
      chao.largura, chao.altura,
    );

    contexto.drawImage(
      sprites,
      chao.spriteX, chao.spriteY,
      chao.largura, chao.altura,
      (chao.x + chao.largura), chao.y,
      chao.largura, chao.altura,
    );
  },
};

function fazColisao(appleObj, chao) {
  const appleObjY = appleObj.y + appleObj.altura;
  const chaoY = chao.y;

  if(appleObjY >= chaoY) {
    return true;
  }

  return false;
}

function criaappleObj() {
  const appleObj = {
    spriteX: 0,
    spriteY: 0,
    largura: 160,
    altura: 160,
    x: 80,
    y: 30,
    pulo: 4.6,
    pula() {
      console.log('devo pular');
      console.log('[antes]', appleObj.velocidade);
      appleObj.velocidade =  - appleObj.pulo;
      console.log('[depois]', appleObj.velocidade);
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazColisao(appleObj, chao)) {
        console.log('Fez colisao');
        alert("Sem forças exteriores a maçã cai até o chão pela força da gravidade, que atrai os corpos para o centro da terra")

        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
      }
  
      appleObj.velocidade = appleObj.velocidade + appleObj.gravidade;
      appleObj.y = appleObj.y + appleObj.velocidade;
    },
    desenha() {
      contexto.fillStyle = '#000';
      contexto.drawImage(
        apple,
        appleObj.spriteX, appleObj.spriteY, // Sprite X, Sprite Y
        appleObj.largura, appleObj.altura, // Tamanho do recorte na sprite
        appleObj.x, appleObj.y,
        appleObj.largura, appleObj.altura,
      );
    }
  }
  return appleObj;  
}


// 
// [Telas]
// 
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.appleObj = criaappleObj();
    },
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      globais.appleObj.desenha();

    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {

    }
  }
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    chao.desenha();
    globais.appleObj.desenha();
  },
  click() {
    globais.appleObj.pula();
  },
  atualiza() {
    globais.appleObj.atualiza();
  }
};

function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}


window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

window.addEventListener('keydown', function(e) {
  if (telaAtiva.click && !e.repeat && e.code === 'Space') {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();