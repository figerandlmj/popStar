var table;
var squareWidth = 50;
var boardWidth = 10;
var squareSet = [];//二位数组存放小星星
var choose = [];//选中的小星星
var timer = null;
var baseScore = 5;//基础分
var stepScore = 10;//递增分 
var totalScore = 0;//获得的总分数
var targetScore = 2000;
var flag = true;//对点击事件加锁
var tempSquare = null;//处理鼠标移入动作过程中，动作被屏蔽，导致事件处理完成有不连贯现象

// 给小星星位置和背景
function refresh() {
    for(var i = 0; i< squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            if(squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].row = i;
            squareSet[i][j].col = j;
            squareSet[i][j].style.transition = "left 0.3s, bottom 0.3s";
            squareSet[i][j].style.left = squareSet[i][j].col * squareWidth + "px";
            squareSet[i][j].style.bottom = squareSet[i][j].row * squareWidth + "px";
            squareSet[i][j].style.backgroundImage = "url('./img/" + squareSet[i][j].num + ".png')";
            squareSet[i][j].style.backgroundSize = "cover";
            squareSet[i][j].style.transform = "scale(.95)";
        }
    }
}

// 创建小星星
function createSquare(value, row, col) {
    var temp = document.createElement("div");
    temp.style.position = "absolute";
    temp.style.display = "inline-block";
    temp.style.width = squareWidth + "px";
    temp.style.height = squareWidth + "px";
    temp.style.borderRadius = "12px";
    temp.style.boxSizing = "border-box";
    temp.num = value;//背景值
    temp.row = row;//行
    temp.col = col;//列
    return temp;
}

// 小星星周围相同的的小星星
function checkLinked(square, arr) {
    if(square == null) {
        return;
    }
    arr.push(square);
    // 左边小星星
    if(square.col > 0 && squareSet[square.row][square.col - 1] && squareSet[square.row][square.col - 1].num == square.num && arr.indexOf(squareSet[square.row][square.col - 1]) == -1) {
        checkLinked(squareSet[square.row][square.col - 1], arr);
    }
    // 右边小星星
    if(square.col < boardWidth - 1 && squareSet[square.row][square.col + 1] && squareSet[square.row][square.col + 1].num == square.num && arr.indexOf(squareSet[square.row][square.col + 1]) == -1) {
        checkLinked(squareSet[square.row][square.col + 1], arr);
    }
    // 上边小星星
    if(square.row < boardWidth - 1 && squareSet[square.row + 1][square.col] && squareSet[square.row + 1][square.col].num == square.num && arr.indexOf(squareSet[square.row + 1][square.col]) == -1) {
        checkLinked(squareSet[square.row + 1][square.col], arr);
    }
    // 下边小星星
    if(square.row > 0 && squareSet[square.row - 1][square.col] && squareSet[square.row - 1][square.col].num == square.num && arr.indexOf(squareSet[square.row - 1][square.col]) == -1) {
        checkLinked(squareSet[square.row - 1][square.col], arr);
    }
}

// 星星闪烁
function flicker(arr) {
    var num = 0;
    timer = setInterval(function() {
        for(var i = 0; i < arr.length; i ++) {
            arr[i].style.border = "3px solid #bfefff";
            arr[i].style.transform = "scale(" + (0.90 + 0.05 * Math.pow(-1, num)) + ")";// 0.90 + 0.05 * (-1)^num = 0.95/0.85
        }
        num ++;
    }, 300);
}

// 还原星星闪烁
function goBack() {
    if(timer != null) {
        clearInterval(timer);
    }
    for(var i = 0; i < squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            if(squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].style.border = "0px solid #bfefff";
            squareSet[i][j].style.transform = "scale(.95)";
        }
    }
}

// 计算闪烁星星的分数
function selectScore(arr) {
    var score = 0;
    for(var i = 0; i < arr.length; i ++) {
        score += baseScore + stepScore * i;
    }
    if(score <= 0) {
        return;
    }
    document.getElementById("select_score").innerHTML = arr.length + "块" + score + "分";
    document.getElementById("select_score").style.transition = null;
    document.getElementById("select_score").style.opacity = 1;
    setTimeout(function() {
        document.getElementById("select_score").style.transition = "opacity 1s";
        document.getElementById("select_score").style.opacity = 0;
    }, 1000);
}

// 鼠标移动事件
function mouseOver(obj) {
    if(!flag) {
        tempSquare = obj;
        return;
    }
    goBack();
    choose = [];
    checkLinked(obj, choose);
    if(choose.length <= 1) {
        choose = [];
        return;
    }
    flicker(choose);
    selectScore(choose);
}

// 移动
function move() {
    // 从上往下移动
    // i表示列数，j表示行,将不是null的星星逐个往下移动
    for(var i = 0; i < boardWidth; i ++) {
        var pointer = 0;
        for(var j = 0; j < boardWidth; j ++) {
            if(squareSet[j][i] != null) {
                if(j != pointer) {
                    squareSet[pointer][i] = squareSet[j][i];
                    squareSet[pointer][i].row = pointer;
                    squareSet[j][i] = null;
                }
                pointer ++;
            }
        }
    }
    // 从右往左移动
    // i表示列，j表示行，如果第i列的第0行为null,则此列都为null
    for(var i = 0; i < squareSet[0].length;) {
        if(squareSet[0][i] == null) {
            for(var j = 0; j < boardWidth; j ++) {
                // 删除第j行中的第i个小星星
                squareSet[j].splice(i, 1);
            }
            // 有删除的时候不进行i++
            continue;
        }
        i ++;
    }
    refresh();
}

// 判断任意两个小星星之间是否相同
function isFinish() {
    for(var i = 0; i < squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            var temp = [];
            checkLinked(squareSet[i][j], temp);
            if(temp.length > 1) {
                return false;
            }
        }
    }
    return true;
}

// 初始化
function init() {
    table = document.getElementById("pop_star");
    for(var i = 0; i < boardWidth; i ++) {
        squareSet[i] = [];
        for(var j = 0; j < boardWidth; j ++) {
            var square = createSquare(Math.floor(Math.random() * 5), i , j);
            square.onmouseover = function() {
                mouseOver(this);
            }
            // 点击事件
            square.onclick = function() {
                if(!flag || choose.length == 0) {
                    return;
                }
                flag = false;
                tempSquare = null;
                // 加分数
                var score = 0;
                for(var i = 0; i < choose.length; i ++) {
                    score += baseScore + stepScore * i;
                }
                totalScore += score;
                document.getElementById("now_score").innerHTML = "当前分数：" + totalScore;

                // 消灭星星
                for(var i = 0 ; i < choose.length; i ++) {
                    (function(i) {
                        setTimeout(function() {
                            squareSet[choose[i].row][choose[i].col] = null;
                            table.removeChild(choose[i]);
                        }, i * 100);
                    })(i);
                }

                // 移动
                setTimeout(function() {
                    move();
                }, choose.length * 100);

                // 判断结束
                setTimeout(function() {
                    var is = isFinish();
                    if(is) {
                        if(totalScore > targetScore) {
                            alert("恭喜获胜");
                        }else {
                            alert("游戏失败");
                        }
                    }else {
                        choose = [];
                        flag = true;
                        mouseOver(tempSquare);
                    }
                }, 300 + choose.length * 150);
            }
            squareSet[i][j] = square;
            table.appendChild(square);
        }
    }
    refresh();
}

window.onload = function() {
    init();
}