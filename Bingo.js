(function() {
    'use strict';

    // //ビンゴの数字の数 75
    var Bingo = (function(from, to) {
    for(var tmp = []; from <= to; from++) {
        tmp.push(('0' + from).slice(-2));
        }
        return tmp;
    })(1, 75);

    var timers = [];
    var results = [];
    var stopCount = 0;
    var isPlaying = false;

    //乱数によってセレクトされた数字
    var bingoNum = 0;

    //bingoNumでセレクトされた数字をBingo配列から削除する変数
    var delArrayNum = 0;

    var panel1 = document.getElementById('panel1');
    var panel10 = document.getElementById('panel10');
    var btn0 = document.getElementById('btn0');
    var spinButton = document.getElementById('spinButton');

    var soundManager = SoundManager();


    // ビンゴの結果エリアのレンダリング
    var renderBingo = function(){
        var fragment= document.createDocumentFragment();
        var divWrapper;
        Bingo.forEach(function(elem, index){
            if( index % 15 === 0 ){
                divWrapper = fragment.appendChild(document.createElement("div"));
            }
            var numDiv = divWrapper.appendChild(document.createElement("div"));
            numDiv.className = "bingo";
            numDiv.innerHTML = elem;
        });
        var result = document.getElementById("result");
        result.appendChild(fragment);
    };
    renderBingo();

    //『SPIN』ボタン押下後の処理
    spinButton.addEventListener('click', function() {
        if (isPlaying) return;

        soundManager.playDrum();

        isPlaying = true;
        this.className = 'inactive';
        btn0.className = 'btn';

        panel1.className = 'panel';
        panel10.className = 'panel';

        runSlot(0, panel1);
        runSlot(1, panel10);

    });

    //『SPIN』ボタン押下後の処理
    function runSlot(n, panel) {

        var num = Bingo[Math.floor(Math.random() * Bingo.length)];
        bingoNum = num;

        //ランダムで表示されている数字を1のくらいと、10のくらいで分割して表示させる
        var num1 = num.substr(0,1); 
        var num10 = num.substr(1,2); 

        //表示
        panel1.innerHTML = num1;
        panel10.innerHTML = num10;

        timers[n] = setTimeout(function() {
            runSlot(n, panel)
        }, 25);

    }

    btn0.addEventListener('click', function() {
        stopSlot(0, panel1 ,panel10, this);
    });

    //『STOP』ボタン押下後の処理
    function stopSlot(n, panel1, panel10, btn) {
        if (!isPlaying || results[n] !== undefined) return;
        btn.className = 'btn inactive';

        soundManager.stopDrum();
        soundManager.playCymbal();

        clearTimeout(timers[n]);
        clearTimeout(timers[n+1]);

        //ランダムで選択された数字bingoNumをBingo配列から選定
        delArrayNum = Bingo.indexOf(bingoNum);
        if(delArrayNum >= 0){
            //Bingo配列から削除
            Bingo.splice(delArrayNum,1);
        }

        stopCount++;

        if (stopCount === 1) {

            stopCount = 0;
            spinButton.className = '';

            var bingoDiv = document.querySelectorAll(".bingo");

            // change color
            bingoDiv[bingoNum-1].innerHTML;
            bingoDiv[bingoNum-1].className = 'bingo unmatched';

            // init
            isPlaying = false;
            spinButton.className = '';
            timers = [];
        }
    }

    //wavファイルを実行するメソッド
    function SoundManager(){
        var drum = document.getElementById('audio_drum');
        var cymbal = document.getElementById('audio_cymbal');
        return {
          playDrum    : playDrum,
          stopDrum    : stopDrum,
          playCymbal  : playCymbal
        }

        function playDrum(){
          if(drum == null){
            return;
          }
          drum.currentTime = 0;
          drum.play();
        }

        function stopDrum(){
          if(drum == null){
            return;
          }
          drum.pause();
        }

        function playCymbal(){
          if(cymbal == null){
            return;
          }
          cymbal.currentTime = 0;
          cymbal.play();
        }
    }

})();