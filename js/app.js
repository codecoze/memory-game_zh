/*
 * 创建一个包含所有卡片的数组
 */
const cards = [ "fa fa-diamond","fa fa-paper-plane-o",
				"fa fa-anchor","fa fa-bolt","fa fa-cube",
				"fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
const doubleCards = cards.concat(cards);
let flag = false;
let openCards = [];//建立openCards的空数组
let moveCount = 0;
let matchs = [];
/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const dbCards = shuffle(doubleCards);
const deck = document.querySelector(".deck");
dbCards.forEach(function(card){ 
    var newLi = document.createElement('li');
	newLi.className = "card animated";
	var newI = document.createElement('i');
	newI.className = card;
	newLi.appendChild(newI);
    deck.appendChild(newLi);
});// end forEach

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */

//---------------------------显示卡片符号函数-----------------------------
function openShow(){
    let eclassName = event.target.classList;
    if (eclassName.contains("card") && !eclassName.contains("match")){
        eclassName.add("flipInY","open","show");
    }

 }// end openShow

 //----------------------建立事件监听器------------------------------
deck.addEventListener("click",function(evt){
    if (flag == false){
        startTime();//计时器开启
        flag = true;
    }

    let e = evt || window.event;
    let target = e.target || event.srcElement;
    let x = document.querySelectorAll('.open').length;
    if ($(target).hasClass('match') == false && x<2 ){
       if(target.nodeName.toLowerCase() ==='li'){
        openShow();//显示卡片符号
        openCards.push(target);//加入openCards数组
        checkCard();
         }
    }
    
})// end addEventListener

//-----------------检查是否匹配函数----------------------
function checkCard(){
    if (openCards.length === 2){
        let firstCard = openCards[0];
        let secondCard = openCards[1];

        if (firstCard.firstChild.className == secondCard.firstChild.className){
            
            openCards.forEach(function(value){
                setTimeout(function (){
                    value.classList.remove("flipInY","open","show");
                    value.classList.add("bounceIn","match");
                    matchs.push(value);
                    console.log(matchs.length);
                    setTimeout(function(){
                        value.classList.remove("bounceIn");
                        if(matchs.length == 16){
                            end();
                        };  
                    },400);
                },500);
   
            });
            openCards.splice(0, openCards.length);
        }else {
            
            openCards.forEach(function(value){
                setTimeout(function (){
                    value.classList.remove("flipInY","open","show");
                    value.classList.add("flipOutX");
                    setTimeout(function(){
                        value.classList.remove("flipOutX");
                        value.classList.add("flipInX");
                    },450);
                    setTimeout(function(){
                        value.classList.remove("flipInX");
                    },801);
                },800);   
            });
            openCards.splice(0, openCards.length);
        }
        addMove();//增加move值
        starScore();
        
    }
    
}//end checkCard

//-------------------addMove函数---------------------------------
function addMove(){
    let moves = document.querySelector(".moves");
    moveCount++;
    moves.innerHTML = moveCount;
}// end adddMove

//------------------------计时器--------------------------------
let int;
let n=0 ;
function startTime(){
    int= setInterval("timeMachine()",1000);

} //end startTime


//timeMachine函数参考https://blog.csdn.net/u013778905/article/details/51598996
function timeMachine(){
    n++;
    let h = parseInt(n/3600);
    let m = parseInt(n/60);
    let s = parseInt(n%60);
    // let timer = document.querySelector(".timeset").innerHTML;
    // timer = toDub(h)+":"+toDub(m)+":"+toDub(s);
    let x =  toDub(h)+":"+toDub(m)+":"+toDub(s);
    $(".timeset").text(x);
   // console.log();

}// end timeMachine

function toDub(n){
    return n<10?"0"+n:""+n;
}// end toDub

function endTime(){
    clearInterval(int);
}// end endTime

//-------------------------得分函数-----------------------

function starScore(){
    let move = document.querySelector('.moves');
    let steps = Number(move.innerHTML);
    star(steps);


}// end starScore

function star(steps){
    let getStar = document.querySelectorAll('.stars li i');
   // console.log(getStar);
    if(steps>8 && steps<=16){
        getStar[2].classList.remove("fa-star");
        getStar[2].classList.add("fa-star-o");
    }else if(steps>16){
        getStar[2].classList.remove("fa-star");
        getStar[2].classList.add("fa-star-o");
        getStar[1].classList.remove("fa-star");
        getStar[1].classList.add("fa-star-o");
    }

}// end star

//-------------------------卡片全部匹配-----------------------------------
function end(){
    endTime();
    // alert('Congratulation!You won!');
    let str = 'Time:'+document.querySelector('.timeset').innerHTML+' \n';
    str +='Moves: '+document.querySelector('.moves').innerHTML+'\n ';
    str +='Do you want to play again?';
    swal({
      title: "Congratulation!You won!",
      text: str,
      icon: "success",
      buttons: ["Oh noez!","Aww yiss!"],
    }).then(function(value){
        if (value) {
             restart();
        } else{
            window.close();
        }
    });
    //buttons 的判断 参考了https://blog.csdn.net/T617ing/article/details/80626426
    
}// end end

//-------------------------restart 函数----------------------------------
 function restart(){
    let cards = shuffle(doubleCards);
    moveCount = 0;
    matchs = [];
    endTime();
    flag = false;
    n = 0;
    $(".timeset").text("00:00:00");
    document.querySelector(".moves").innerHTML = moveCount;
    let star = document.querySelectorAll(".stars li i");
    for(let i=0;i<star.length;i++){
        star[i].classList.remove('fa-star-o');
        star[i].classList.add('fa-star');
    }

    let card=document.querySelectorAll('.card');
    card.forEach(function (card,index) {
        card.classList.remove("match","open","show");
        card.querySelector('i').className = cards[index];
    })



 }//end restart

document.querySelector('.restart').addEventListener('click', function() {
    restart();
})