const os = new Audio();
		const openaud = new Audio();
		os.src = "audio/GTD/os.mp3";
		openaud.src = "audio/GTD/door.mp3";
		function opend(){
			document.getElementById('doormain').removeAttribute('onclick');
			setTimeout("document.getElementById('doormain').className = 'open'",1000);
			os.play();
			setTimeout('openaud.play()',1000);
		}