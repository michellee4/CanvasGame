// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


/* ------------------------------------------------------------------ */

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Moon image
var moonReady = false;
var moonImage = new Image();
moonImage.onload = function() {
    moonReady = true;
};
moonImage.src = "images/moon.jpg";

// Monster image
var shipReady = false;
var shipImage = new Image();
shipImage.onload = function() {
    shipReady = true;
};
shipImage.src = "images/ship.png";


/* ------------------------------------------------------------------ */

// Let's play this game!
var then = Date.now();
//reset();
main(); // call the main game loop.



// The main game loop
var main = function() {
    render();
    // Request to do this again ASAP using the Canvas method,
    // it’s much like the JS timer function “setInterval, it will
    // call the main method over and over again so our players 
    // can move and be re-drawn
    requestAnimationFrame(main);
};




/* ------------------------------------------------------------------ */


// Draw everything in the main render function
var render = function() {
    if (bgReady) {
        console.log('here2');
        ctx.drawImage(bgImage, 0, 0);
    }
    /* ------------------------------------------------------------------ */

    // Game objects
    var moon = {
        speed: 256, // movement in pixels per second
        x: 0, // where on the canvas are they?
        y: 0 // where on the canvas are they?
    };
    var ship = {
        // for this version, the monster does not move, so just and x and y
        x: 0,
        y: 0
    };
    var shipCaught = 0;



    /* ------------------------------------------------------------------ */


    // Reset the game when the player catches a monster
    var reset = function() {
        moon.x = canvas.width / 2;
        moon.y = canvas.height / 2;

        //Place the monster somewhere on the screen randomly
        // but not in the hedges, Article in wrong, the 64 needs to be 
        // hedge 32 + hedge 32 + char 32 = 96
        ship.x = 32 + (Math.random() * (canvas.width - 96));
        ship.y = 32 + (Math.random() * (canvas.height - 96));
    };



    /* ------------------------------------------------------------------ */

    if (moonReady) {
        ctx.drawImage(moonImage, moon.x, moon.y);
    }

    if (shipReady) {
        ctx.drawImage(shipImage, ship.x, ship.y);
    }



    /* ------------------------------------------------------------------ */




    // Handle keyboard controls
    var keysDown = {}; //object were we properties when keys go down
    // and then delete them when the key goes up
    // so the object tells us if any key is down when that keycode
    // is down.  In our game loop, we will move the hero image if when
    // we go thru render, a key is down

    addEventListener("keydown", function(e) {
        console.log(e.keyCode + " down")
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function(e) {
        console.log(e.keyCode + " up")
        delete keysDown[e.keyCode];
    }, false);



    /* ------------------------------------------------------------------ */

    // Update game objects
    var update = function(modifier) {
        if (38 in keysDown) { // Player holding up
            moon.y -= moon.speed * modifier;
        }
        if (40 in keysDown) { // Player holding down
            moon.y += moon.speed * modifier;
        }
        if (37 in keysDown) { // Player holding left
            moon.x -= moon.speed * modifier;
        }
        if (39 in keysDown) { // Player holding right
            moon.x += moon.speed * modifier;
        }
    };


    /* ------------------------------------------------------------------ */



    // The main game loop
    var main = function() {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        //  Request to do this again ASAP
        requestAnimationFrame(main);
    };


    /* ------------------------------------------------------------------ */



    // Are they touching?
    if (
        moon.x <= (ship.x + 32) &&
        ship.x <= (moon.x + 32) &&
        moon.y <= (ship.y + 32) &&
        ship.y <= (moon.y + 32)
    ) {
        ++shipCaught; // keep track of our “score”
        reset(); // start a new cycle
    }


    /* ------------------------------------------------------------------ */

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Moon hit: " + shipCaught, 32, 32);


    /* ------------------------------------------------------------------ */


    if (38 in keysDown && moon.y > 32 + 4) { //  holding up key
        moon.y -= moon.speed * modifier;
    }
    if (40 in keysDown && moon.y < canvas.height - (64 + 6)) { //  holding down key
        moon.y += moon.speed * modifier;
    }
    if (37 in keysDown && moon.x > (32 + 4)) { // holding left key
        moon.x -= moon.speed * modifier;
    }
    if (39 in keysDown && moon.x < canvas.width - (64 + 6)) { // holding right key
        moon.x += moon.speed * modifier;
    }
}