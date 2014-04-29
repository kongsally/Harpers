

		 	var canvas = document.getElementById( 'canvas' );
     		var c =  canvas.getContext( '2d' );
			var width = canvas.width;
			var height = canvas.height;
			var frame;

		var chosen = Math.floor((Math.random() * 100) + 1);
		var harray;
		var chosenID;

			function leapToScene( leapPos ){

			    var iBox = frame.interactionBox;

			    var left = iBox.center[0] - iBox.size[0]/2;
			    var top = iBox.center[1] + iBox.size[1]/2;

			    var x = leapPos[0] - left;
		        var y = leapPos[1] - top;

			    x /= iBox.size[0];
		        y /= iBox.size[1];

		        x *= width;
		        y *= height;

		        return [ x , -y ];

			 }

			var leapController = new Leap.Controller({ enableGestures: true });
			var trainer = new LeapTrainer.Controller({controller: leapController});
			trainer.fromJSON('{"name":"FUCK","pose":false,"data":[[{"x":0.12230706441185484,"y":-0.508974353846709,"z":0.3548294552822514,"stroke":1},{"x":-0.012236071241128021,"y":0.2656617665757899,"z":-0.019241596850127662,"stroke":1},{"x":0.023258727557572592,"y":0.005761124322826161,"z":0.07993090460846242,"stroke":1},{"x":0.06443501663240526,"y":-0.2890533300651934,"z":0.19961631680178615,"stroke":1},{"x":-0.07118313709074234,"y":0.49102564615329103,"z":-0.16256683258623772,"stroke":1},{"x":0.04116108589650393,"y":-0.2473138635563064,"z":0.1294375578387117,"stroke":1},{"x":0.01407076496365639,"y":-0.10847488884356427,"z":0.056173190798567196,"stroke":1},{"x":-0.06196950309368311,"y":0.33307659966073044,"z":-0.14686657434280403,"stroke":1},{"x":0.05805669224390868,"y":-0.47336642770084575,"z":0.1586419893844021,"stroke":1},{"x":-0.025494400162936415,"y":0.04938357555917605,"z":-0.06577638946664799,"stroke":1},{"x":-0.04516155536018968,"y":0.13121580517478992,"z":-0.12361398139819596,"stroke":1},{"x":-0.10724468475722214,"y":0.35105834656601675,"z":-0.46056404007016827,"stroke":1}]]}');	
			leapController.connect();

			function onSwipe(gesture){
	    	  var startPos = leapToScene( gesture.startPosition );
		      var pos = leapToScene( gesture.position );

		      // Setting up the style for the stroke
		      c.strokeStyle = "#FF00A2";
		      c.lineWidth = 1;

		      // Drawing the path
		      c.beginPath();

		      // Move to the start position
		      c.moveTo( startPos[0] , startPos[1] );

		      // Draw a line to current position
		      c.lineTo( pos[0] , pos[1] );

		      c.closePath();
		      c.stroke();
		     
		      notGiven();		     
			}

			function onCircle(gesture){
		      var pos = leapToScene( gesture.center );
		      var radius = gesture.radius;
		      var clockwise = false;

		      if( gesture.normal[2]  <= 0 ){
		        clockwise = true;
		      }

		      c.fillStyle   = "#FFFF00";
		      c.strokeStyle = "##FFFF00";
		      c.lineWidth   = 5;

		      c.beginPath();
		      c.arc(pos[0], pos[1], radius, 0, Math.PI*2); 

		      c.closePath();
		      c. stroke();

		      given();
			}

			var readGesture = true;
			leapController.on('frame' , function( data ){
		        frame = data;
		        c.clearRect( 0 , 0 , width , height );
		        for( var i =  0; i < frame.gestures.length; i++){

		        if(readGesture) {
			      var gesture  = frame.gestures[0];
			      var type = gesture.type;

			       switch( type ){         
			          case "circle":
			          	console.log("circle!");
			          	onCircle(gesture);
			            break;
			  
			          case "swipe":
			            onSwipe(gesture);
			            break;
			          
			          case "screenTap":
			            break;

			          case "keyTap":
			            break;
			        }
			        readGesture = false;
			        setTimeout(function() {readGesture = true;}, 2000);
			      }}
			});
			leapController.connect();


			var gave = true;
			trainer.on('FUCK', function(){
				if(gave) {
				given();
				gave = false;
				setTimeout(function() {gave= true;}, 2000);
				}
			});


		function setupHarps() {			
			var query = new Parse.Query("HarpersIndex");
		    query.find({
			    success: function(results) {
			          harray = results;
			          getHarpers();
			    },
			    error: function(error) {
			        alert("Seems like Parse is having a problem");
			    }
		    });	  
		}

		function getHarpers() {
			//var num = Math.floor((Math.random() * 100) + 1);
			chosen = (chosen+1) % 100;
			chosenID = harray[chosen].id;	
			$("#randomNum").html(harray[chosen].attributes.number);
			$("#numFact").html(harray[chosen].attributes.fact);
		}

		function given() {
			getHarpers();
			$("span").html("Yeah");
			$("span").fadeIn(200);	
			console.log(chosenID);
			var query = new Parse.Query("HarpersIndex");
				query.get(chosenID, {
				  success: function(object) {
				    object.increment("Fucks", 1);
				    console.log(object.attributes.Fucks);
				    object.save();
				  },
				  error: function(object, error) {
				  }
				});	
				$("span").fadeOut(200);
		}

		function notGiven() {
			getHarpers();
			$("span").html("No");
			$("span").fadeIn(200);	
			 console.log(chosenID);
			 var query = new Parse.Query("HarpersIndex");
				query.get(chosenID, {
				  success: function(object) {
				    object.increment("Ignored", 1);
				    console.log(object.attributes.Ignored);
				    object.save();
				  },
				  error: function(object, error) {
				    // error is an instance of Parse.Error.
				  }
				});	
				$("span").fadeOut(200);			
		}
