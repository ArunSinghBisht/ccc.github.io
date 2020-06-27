        const startScreen = document.querySelector('.startScreen');
		const gameArea = document.querySelector('.gameArea');
		const board = document.querySelector('.board');
		const events = document.querySelector('.events');
		const luck = document.querySelector('.luck');
		
		let name = ["player 1","AI name"];
		let guardm = [100,100,100];  //money with guard
		let room = new Array(20);  //value to be given in door divs
		let D = new Array(20);  //door divs
		let M = new Array(2); //money divs
		let t = l = 0;
		let m = 15;  //no. of money card
		let player = {mode : "none", turn : 0};
		let money = [100,100];  //player money
		let gOver=0;

		for(i=0; i<5; i++){
			givev(i)
		}

		for(x=0; x<20; x++){
			D[x] = document.createElement('div');
			D[x].setAttribute('class','door');
			D[x].setAttribute('id',x);
			D[x].setAttribute('value',room[x]);
			D[x].setAttribute('onclick','openRoom('+parseInt(D[x].id)+')');
			
			if((x%5)==0){
					t += 22.5;
					
				}
			if(x==0){t=7.5;}
			if(x%5==0){l=10.59;}

			D[x].style.top = t + "%";
			D[x].style.left = l + "%";
			l+=18;
			board.appendChild(D[x]);
		}

		let pass = document.createElement('div');
		pass.setAttribute('class','pass');
		pass.setAttribute('onclick','passturn()');
		luck.appendChild(pass);
		pass.innerText="Pass Turn";

		let coin = document.createElement('div');
		coin.setAttribute('class','coin');
		coin.setAttribute('onclick','flip()');
		luck.appendChild(coin);
		coin.style.backgroundImage = "url('images/KBTD/FTC.png')";

		let curTurn = document.createElement('div');
		curTurn.setAttribute('class','curTurn');
		luck.appendChild(curTurn);

		let capital = document.createElement('div');
		capital.setAttribute('class','GC');
		gameArea.appendChild(capital);

		let ChatBox = document.createElement('div');
		events.appendChild(ChatBox);

		for(x=0;x<2;x++){
			M[x] = document.createElement('div');
			M[x].setAttribute('class','M');
			if(x==0){M[x].style.left="15%";}
			else if(x==1){M[x].style.right="15%";}
			capital.appendChild(M[x]);
		}

		start();

		function refmoney(){ //refresh money
			for(x=0;x<2;x++){
				M[x].innerText = name[x]+" : "+money[x]+" GC";
			}
		}


		function givev(a){
			r = Math.floor(Math.random()*20);
			if(room[r]==undefined){
				room[r]=a;
			}
			else{
				givev(a);
			}
		}

		function flip(){
			
				let s;
				let r=Math.floor(Math.random()*10);
				if(r<=2){
					player.mode="Dagger";
					s="assassin";
					coin.style.backgroundImage = "url('images/KBTD/dagger.png')";
				}
				else{
					player.mode="Bag";
					s="thief";
					coin.style.backgroundImage = "url('images/KBTD/bag.png')";
				}
				//console.log(name[player.turn]+" will play as "+s);
				addEvent(name[player.turn]+" will play as "+s,"green");
			coin.removeAttribute('onclick');
		}

	    function openRoom(p){

	        if(player.mode=="none"){
	        	//console.log("First flip the coin.")
	        	alert("First flip the coin.");
	        }
	        else if(p==undefined) openRoom(pick());
            else{
            	//console.log(p);
                if(D[p].getAttribute("value")==0){
		    		king(p);
		    	}
		    	else if(D[p].getAttribute("value")==1){
		    		queen(p);
		    	}
		    	else if(D[p].getAttribute("value")>=2 && D[p].getAttribute("value")<=4){
		    		guard(p);
		    	}
		    	else if(D[p].getAttribute("value")==5){
		    		D[p].innerText = "already opened";
		    	}
		    	else if(D[p].getAttribute("value")=="undefined"){
		    		genmoney(p);
		    	}
		    	refmoney();
		    	disClick();
		    	if(gOver==0)  pass.setAttribute('onclick','passturn()');
		    	checkboard();
		    }
		}

		function king(n){
			if(player.mode=="Bag"){
				swapRoom(n);
				openRoom(n);
			}
			else if(player.mode=="Dagger"){
				D[n].style.backgroundColor="red";
				D[n].setAttribute("value","5");
				D[n].style.backgroundImage = "url('images/KBTD/king.png')";
				alert(name[player.turn]+" killed the king.\nAnd became the new king.");
				//console.log(name[player.turn]+" killed the king.And became the new king.");
				addEvent(name[player.turn]+" killed the king and became the new king.","red");
				let rm=0;
				for(x=0;x<m;x++){rm+=(2+Math.floor(Math.random()*9))*10;}
				money[player.turn]+=rm;
			    //console.log(name[player.turn]+" got "+rm+" GC");
			    addEvent(name[player.turn]+" got "+rm+" GC","black");
			    gameOver(0);
			}
		}

		function queen(n){
			if(player.mode=="Bag"){
				//console.log("queen");
				//console.log(name[player.turn]+"'s money became 0");
				addEvent(name[player.turn]+" encountered queen.","red");
				addEvent(name[player.turn]+"'s money became 0","black");
				D[n].style.backgroundImage = "url('images/KBTD/queen.png')";
				money[player.turn]=0;
				swapRoom(n);
			}
			else if(player.mode=="Dagger"){
				D[n].style.backgroundColor="red";
				D[n].style.backgroundImage = "url('images/KBTD/queen.png')";
				D[n].setAttribute("value","5");
				gameOver(1);
			}    
	    }

		function guard(n){
			if(player.mode=="Bag"){
				//console.log("guard");
				addEvent(name[player.turn]+" encountered a guard.","red");
				if(money[player.turn]<20){
					addEvent(name[player.turn]+" is to be executed for stealing form the castle.","red");
					addEvent("(He can't bribe the guard.)","red");
					gameOver(2);
				}
				else{
					let x = Math.floor(money[player.turn]/2);
					//console.log(name[player.turn]+" gave away "+x+" GC as bribe.");
					addEvent(name[player.turn]+" gave away "+x+" GC as bribe.","black");
					guardm[parseInt(D[n].getAttribute("value"))-2]+=x;
					money[player.turn]-=x;
					D[n].style.backgroundImage = "url('images/KBTD/guard.png')";
					swapRoom(n);
				}	
			}
			else if(player.mode=="Dagger"){
				let x = guardm[parseInt(D[n].getAttribute("value"))-2];
				money[player.turn]+=x;
				//console.log(name[player.turn]+" killed the guard and got "+x+" GC.");
				addEvent(name[player.turn]+" killed the guard and got "+x+" GC.","black");
				D[n].setAttribute("value","5");
				D[n].style.backgroundColor="red";
				D[n].style.backgroundImage = "url('images/KBTD/guard.png')";
				D[n].removeAttribute("onclick");
			}  		    
	    }

		function genmoney(n){
			if(player.mode=="Bag"){
				let rm = (2+Math.floor(Math.random()*9))*10;
				//console.log(rm);
				money[player.turn]+=rm;
				addEvent(name[player.turn]+" got "+rm+" GC.","black");
				D[n].innerText = rm+" GC";
				D[n].setAttribute("value","5");
				D[n].style.backgroundColor="gray";
				D[n].style.backgroundImage = "url('images/KBTD/gold.png')";
				D[n].removeAttribute("onclick");
				m--;
			}
			else if(player.mode=="Dagger"){
				let rm = (2+Math.floor(Math.random()*9))*10;
				//console.log(name[player.turn]+" accidentaly lost "+rm+" GC");
				addEvent(name[player.turn]+" accidentaly lost "+rm+" GC","black");
				money[player.turn]-= rm;
				swapRoom(n);
			}	
		}

		function swapRoom(n){
			let temp = D[n].getAttribute("value");
			let r = Math.floor(Math.random()*20);
			if(parseInt(D[r].getAttribute("value"))!=5 && parseInt(D[r].getAttribute("value"))!=n){
				D[n].setAttribute("value",D[r].getAttribute("value"));
				D[r].setAttribute("value",temp);
			}
			else{
				swapRoom(n);
			}
		}

		function checkboard(){
			let n=0;
			for(x=0;x<20;x++){
				if(parseInt(D[x].getAttribute("value"))!=5){n++;}
			}
			if(n==2){
				gameOver(0);
			}
		}

		function passturn(){
			if(gOver==0){
				player.mode="none";
			    coin.style.backgroundImage = "url('images/KBTD/FTC.png')";
			    if(player.turn==0){player.turn=1;}
			    else if(player.turn==1){player.turn=0;}
			    curTurn.innerText= name[player.turn]+"'s Turn";
			    enClick();
			    if(player.turn==1) disClick();
			    pass.removeAttribute("onclick");
			    //console.log(name[player.turn]+"'s turn.");
			    addEvent(name[player.turn]+"'s turn.","red");
			    coin.setAttribute('onclick','flip()');
			    if(player.turn==1) compTurn();
		    }
		}

		function compTurn(){
			coin.removeAttribute('onclick');
			coin.style.backgroundImage = "url('images/KBTD/wait.png')";
			setTimeout(flip,1500);
			setTimeout('openRoom(pick())',2500);
			setTimeout(passturn,4600);
		}

		function disClick(){
			for(x=0;x<20;x++){
				if(parseInt(D[x].getAttribute("value"))!=5){
					D[x].removeAttribute("onclick");
				}
			}
		}

		function enClick(){
			for(x=0;x<20;x++){
				if(parseInt(D[x].getAttribute("value"))!=5){
					D[x].setAttribute('onclick','openRoom('+parseInt(D[x].id)+')');
					D[x].style.backgroundImage='';
				}
			}
		}

		function addEvent(s,c){
			let Para = document.createElement('p');
			Para.setAttribute('class',c);
			let T = document.createTextNode(s);
			Para.appendChild(T);
			ChatBox.appendChild(Para);
		}

		function pick(){
			var num = Math.floor(Math.random()*20);
				if(parseInt(D[num].getAttribute("value"))!=5) {
					//console.log(num);
					return num;
				}
				else {pick();}		
		}

		function gameOver(e){
			let s ="none";
			if(e==1){
				alert(name[player.turn]+" is to be executed for killing the Queen.");
				addEvent(name[player.turn]+" is to be executed for killing the Queen.","red")
				if(player.turn==0){s=name[1];}
			    else if(player.turn==1){s=name[0];}
			}
			else if(e==2){
				alert(name[player.turn]+" is to be executed for stealing form the castle.\n(He can't bribe the guard.)");
				if(player.turn==0){s=name[1];}
			    else if(player.turn==1){s=name[0];}
			}
			else{
				if(money[0]>money[1]){s=name[0];}
				else if(money[1]>money[0]){s=name[1];}
			}
			addEvent("GAME OVER","red");
			if(s=="none"){
				alert("GAME OVER.\nMatch tied.");
				addEvent("Match Tied","green");
		    }
			else{
			    alert("GAME OVER.\n"+s+" won.");
			    addEvent(s+" Won.","red")
			}
			gOver=1;
			pass.removeAttribute("onclick");
		}

	    function start(){
	    	for(x=0;x<2;x++){
			    if(x==0) name[x]=prompt("Enter player's name",name[x]);
			    else name[x]=prompt("Enter AI's name",name[x]);
		    }
		    startScreen.classList.add('hide');
		    gameArea.classList.remove('hide');
	    	//console.log(name[player.turn]+"'s turn.");
	    	addEvent(name[player.turn]+"'s turn.","red");
	    	curTurn.innerText= name[player.turn]+"'s Turn";
	    	refmoney();
	    	pass.removeAttribute("onclick");
	    }
