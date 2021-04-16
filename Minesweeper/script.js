var numOfSquares;
var sizeOfSquare;
var minePercent;
var timeInterval;
var timer;

var startButton = document.getElementById('start');
var resetButton = document.getElementById('reset');
var selection = document.getElementById('drop');
var info = document.getElementById('info');
var bombPic = document.getElementById('bomb');
var bombInfo = document.getElementById('bombCounter');
var clockPic = document.getElementById('clock');
var clockInfo = document.getElementById('clockCounter');

var boardDiv = document.getElementById('board');

initEasy();
drawBoard();

function drawBoard(){
    boardDiv.innerHTML = "";
    var gaps = parseInt(sizeOfSquare/10);
    var boardSize = (numOfSquares * (sizeOfSquare + gaps)) - gaps;

    boardDiv.style.width = boardSize + "px";
    boardDiv.style.height = boardSize + "px";
    boardDiv.style.border = '1px solid black';
    boardDiv.style.gridTemplateColumns = buildTemplate();
    boardDiv.style.gridTemplateRows = buildTemplate();
    boardDiv.style.gridGap = gaps + 'px';
    boardDiv.style.padding = gaps + 'px';

    for(var i = 0; i < numOfSquares; i++){
        for(var j = 0; j < numOfSquares; j++){
            var boardSquareDiv = document.createElement('div');
            boardSquareDiv.style.width = sizeOfSquare + 'px';
            boardSquareDiv.style.height = sizeOfSquare + 'px';
            boardSquareDiv.style.backgroundColor = 'rgb(83, 140, 70)';
            boardSquareDiv.style.fontSize = sizeOfSquare * 0.8 + 'px';
            boardSquareDiv.id = i + " " + j;
            boardSquareDiv.className = 'unit';
            boardDiv.appendChild(boardSquareDiv);
        }
    }
}

function prePlay(){
    switch(selection.value){
        case 'Easy':
            initEasy();
            break;
        case 'Medium':
            initMedium();
            break;
        case 'Hard':
            initHard();
            break;
    }

    drawBoard();
    play();
}

function initEasy(){
    numOfSquares = 10;
    sizeOfSquare = 48;
    minePercent = 10;
}

function initMedium(){
    numOfSquares = 16;
    sizeOfSquare = 30;
    minePercent = 15;
}

function initHard(){
    numOfSquares = 24;
    sizeOfSquare = 20;
    minePercent = 20;
}

function startCounter(){
    timer = 1;
    timeInterval = setInterval(function(){
        clockInfo.innerHTML = timer++;
    }, 1000);
}

function stopCounter(){
    clearInterval(timeInterval);
}

function play(){
    startButton.style.display = 'none';
    selection.style.display = 'none';
    resetButton.style.display = 'inline';
    clockPic.style.display = 'inline';
    clockInfo.style.display = 'inline';
    clockInfo.innerHTML = '0';
    bombPic.style.display = 'inline';
    bombInfo.style.display = 'inline';

    var backTable = [];
    var bombs;
    bombs = createBackTable(backTable, numOfSquares);
    var opened  = 0;
    var max = numOfSquares*numOfSquares - bombs;

    startCounter();

    var unitDivs = document.getElementsByClassName('unit');
    //go through them and add hover shit
    for(var i = 0; i < unitDivs.length; i++){
        unitDivs[i].onmouseover = function(){
            //change the color
            this.style.backgroundColor = 'rgb(44, 94, 52)';
        };
        unitDivs[i].onmouseout = function(){
            //reset color
            this.style.backgroundColor = 'rgb(83, 140, 70)';
        };
        unitDivs[i].onclick = function(){
            this.onclick = function(){};
            this.onmouseover = function(){};
            this.onmouseout = function(){};

            //if this is a mine then display all mines and end the game as lost
            //if this is not a mine then open it or open all the corresponding squares while taking care of takens
            //check how many are taken - if all are taken, then end the game as won, otherwise nothing
            var idXXX = this.id.match(/\d+/g);
            if(backTable[idXXX[0]][idXXX[1]] == -1)
                lostGame(backTable, unitDivs);
            else{
                opened += reveal(backTable, unitDivs, idXXX[0], idXXX[1]);

                if(opened == max)
                    wonGame(backTable, unitDivs);
            }
        };
    }


}

function reveal(table, unitDivs, row, col){
    if(table[row][col] != 0){
        unitDivs[row*numOfSquares + parseInt(col)].innerHTML = table[row][col];
        table[row][col] = '.';
        return 1;
    }
    else{
        return revealX(table, unitDivs, row, col);
    }
}

function revealX(table, unitDivs, row, col){
    row = parseInt(row);
    col = parseInt(col);
    var x = 0;
    table[row][col] = '.';
    x++;
    fixStyle(unitDivs[row*numOfSquares + parseInt(col)]);

    if(row-1 >= 0 && table[row-1][col] != '.')//up
	{
		if(table[row-1][col] == 0)
		{
			x += revealX(table, unitDivs, row-1, col);
		}
		else
		{
			unitDivs[(row-1)*numOfSquares + col].innerHTML = table[row-1][col];
            table[row-1][col] = '.';
			x++;
            fixStyle(unitDivs[(row-1)*numOfSquares + col]);
		}
	}
	if(col+1 < numOfSquares && table[row][col+1] != '.')//right
	{
		if(table[row][col+1] == 0)
		{
			x += revealX(table, unitDivs, row, col+1);
		}
		else
		{
			unitDivs[(row)*numOfSquares + col + 1].innerHTML = table[row][col+1];
            table[row][col+1] = '.';
			x++;
            fixStyle(unitDivs[(row)*numOfSquares + col + 1]);
		}
	}
	
	if(row+1 < numOfSquares && table[row+1][col] != '.')//down
	{
		if(table[row+1][col] == 0)
		{
			x += revealX(table, unitDivs, row+1, col);
		}
		else
		{
			unitDivs[(row+1)*numOfSquares + col].innerHTML = table[row+1][col];
            table[row+1][col] = '.';
			x++;
            fixStyle(unitDivs[(row+1)*numOfSquares + col]);
		}
	}
	
	if(col-1 >= 0 && table[row][col-1] != '.')//left
	{
		if(table[row][col-1] == 0)
		{
			x += revealX(table, unitDivs, row, col-1);
		}
		else
		{
			unitDivs[(row)*numOfSquares + col - 1].innerHTML = table[row][col-1];
            table[row][col-1] = '.';
			x++;
            fixStyle(unitDivs[(row)*numOfSquares + col - 1]);
		}
	}
    
    //the four diagonals
    if(row-1 >= 0 && col-1 >= 0 && table[row-1][col-1] != '.'){
        if(table[row-1][col-1] == 0)
		{
			x += revealX(table, unitDivs, row-1, col-1);
		}
		else
		{
			unitDivs[(row-1)*numOfSquares + col - 1].innerHTML = table[row-1][col-1];
            table[row-1][col-1] = '.';
			x++;
            fixStyle(unitDivs[(row-1)*numOfSquares + col - 1]);
		}
    }

    if(row-1 >= 0 && col+1 < numOfSquares && table[row-1][col+1] != '.'){
        if(table[row-1][col+1] == 0)
		{
			x += revealX(table, unitDivs, row-1, col+1);
		}
		else
		{
			unitDivs[(row-1)*numOfSquares + col + 1].innerHTML = table[row-1][col+1];
            table[row-1][col+1] = '.';
			x++;
            fixStyle(unitDivs[(row-1)*numOfSquares + col + 1]);
		}
    }

    if(row+1 < numOfSquares && col+1 < numOfSquares && table[row+1][col+1] != '.'){
        if(table[row+1][col+1] == 0)
		{
			x += revealX(table, unitDivs, row+1, col+1);
		}
		else
		{
			unitDivs[(row+1)*numOfSquares + col + 1].innerHTML = table[row+1][col+1];
            table[row+1][col+1] = '.';
			x++;
            fixStyle(unitDivs[(row+1)*numOfSquares + col + 1]);
		}
    }

    if(row+1 < numOfSquares && col-1 >= 0 && table[row+1][col-1] != '.'){
        if(table[row+1][col-1] == 0)
		{
			x += revealX(table, unitDivs, row+1, col-1);
		}
		else
		{
			unitDivs[(row+1)*numOfSquares + col - 1].innerHTML = table[row+1][col-1];
            table[row+1][col-1] = '.';
			x++;
            fixStyle(unitDivs[(row+1)*numOfSquares + col - 1]);
		}
    }

	return x;
}

function fixStyle(element){
    element.onclick = function(){};
    element.onmouseover = function(){};
    element.onmouseout = function(){};
    element.style.backgroundColor = 'rgb(44, 94, 52)';
}

function wonGame(table, unitDivs){
    stopCounter();
    for(var i = 0; i < numOfSquares*numOfSquares; i++){
        var idXXX = unitDivs[i].id.match(/\d+/g);
        unitDivs[i].style.backgroundColor = 'rgb(44, 94, 52)';
        if(table[idXXX[0]][idXXX[1]] == -1){
            unitDivs[i].onclick = function(){};
            unitDivs[i].onmouseover = function(){};
            unitDivs[i].onmouseout = function(){};
            unitDivs[i].style.backgroundImage = 'url(./star.png)';
        }
        else{
            unitDivs[i].onclick = function(){};
            unitDivs[i].onmouseover = function(){};
            unitDivs[i].onmouseout = function(){};
            unitDivs[i].innerHTML = '';
        }
    }
    info.style.color = 'white';
    info.innerHTML = 'You Won!';
    startConfetti(2000, 500, 500);
}

function lostGame(table, unitDivs){
    stopCounter();
    for(var i = 0; i < numOfSquares*numOfSquares; i++){
        var idXXX = unitDivs[i].id.match(/\d+/g);

        unitDivs[i].style.backgroundColor = 'rgb(44, 94, 52)';
        if(table[idXXX[0]][idXXX[1]] == -1){
            unitDivs[i].onclick = function(){};
            unitDivs[i].onmouseover = function(){};
            unitDivs[i].onmouseout = function(){};
            unitDivs[i].style.backgroundImage = 'url(./bomb.png)';
        }
        else{
            unitDivs[i].onclick = function(){};
            unitDivs[i].onmouseover = function(){};
            unitDivs[i].onmouseout = function(){};
            unitDivs[i].innerHTML = '';
            info.style.color = 'black';
            info.innerHTML = 'You Lost!';
        }
    }
}

function createBackTable(table, boardSize){
    var taken = 0;
    for(var row = 0; row < boardSize; row++)
    {
        table[row] = [];
        for(var col = 0; col < boardSize; col++)
        {
            table[row][col] = 0;
        }
    }

    for(var row = 0; row < boardSize; row++)
    {
        for(var col = 0; col < boardSize; col++)
        {
            if(Math.random()*100 <= minePercent)
            {
                table[row][col] = -1;
                add(table, row, col);
                taken++;
            }
        }
    }

    bombInfo.innerHTML = taken;
    return taken;
}

function add(arr, row, col){
    var left, right;
	left = (col - 1 >= 0);
	if(left && arr[row][col-1] >= 0){arr[row][col-1]++;}
				
	right = (col + 1 < arr[row].length);
	if(right && arr[row][col+1] >= 0){arr[row][col+1]++;}
				
	if(row-1 >= 0)
	{
		if(arr[row-1][col] >= 0){arr[row-1][col]++;}
					
		if(left && arr[row-1][col-1] >= 0)
		{
			arr[row-1][col-1]++;
		}
					
		if(right && arr[row-1][col+1] >= 0)
		{
			arr[row-1][col+1]++;
		}
	}
				
	if(row+1 < arr.length)
	{
		if(arr[row+1][col] >= 0){arr[row+1][col]++;}
					
		if(left && arr[row+1][col-1] >= 0)
		{
			arr[row+1][col-1]++;
		}
					
		if(right && arr[row+1][col+1] >= 0)
		{
			arr[row+1][col+1]++;
		}
	}
}

function buildTemplate(){
    var s = "";
    for(var i = 0; i < numOfSquares - 1; i++){
        s += (sizeOfSquare + "px ");
    }
    s += (sizeOfSquare + "px");
    return s;
}

function reset(){
    //puts the buttons back in place
    //removes the reset button
    resetButton.style.display = 'none';
    bombPic.style.display = 'none';
    bombInfo.style.display = 'none';
    clockPic.style.display = 'none';
    clockInfo.style.display = 'none';
    startButton.style.display = 'inline';
    selection.style.display = 'inline';
    stopCounter();

    //cleans the log
    info.innerHTML = '';

    //cleans the table
    boardDiv.innerHTML = '';
    
    //selection = document.getElementById('drop');
    console.log(selection.value);
    switch(selection.value){
        case 'Easy':
            initEasy();
            break;
        case 'Medium':
            initMedium();
            break;
        case 'Hard':
            initHard();
            break;
    }
    drawBoard();
}







