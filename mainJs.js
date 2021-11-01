window.onload = function () {
    var mainObj = document.getElementById("main");
    //enemy airplane array
    var smallPlaneArray = [];
    //bullet array
    var bulletArray = [];

    //player key btn control
    var upBtn = false;
    var downBtn = false;
    var leftBtn = false;
    var rightBtn = false;



    //killnumber
    var killNumb = document.getElementById("killNum");
    //player score
    var killScore = document.getElementById("killScore");

    //start Music
    var startMusic = document.getElementById("startMusic");
    //bullet shot music
    var zdMusic = document.getElementById("zdMusic");


    // create player plane  src, x location, y location, speed
    var player = new playerPlaneProto("images/myplane.gif", 50, 500, 10);
    //repeat genrate enemy airplane
    var smallPlaneTimer = setInterval(createSmallPlane, 1000);
    //enemy smallPlane move
    var planeMoveTimer = setInterval(smallPlaneMove, 50);
    //bullet move
    var bulletMoveTimer = setInterval(bulletMove, 10);
    //every 0.3 seconds check the key does press or not.
    var ctrlPlayTimer = setInterval(ctrlPlay, 50);
    //every 0.5s call the crashCheck function
    var crashCheckTimer = setInterval(crashCheck, 50);


    /* 
        Interface Design
    */

    // Stop interface
    var stopgame = document.getElementById("stopgame");
    var stop = document.getElementById("stop");
    console.log(stop);
    stopgame.onclick = function () {
        stop.style.display = "block";

        //stop genrate enemy plane
        clearInterval(smallPlaneTimer);
        clearInterval(planeMoveTimer);
        clearInterval(bulletMoveTimer);
        clearInterval(bulletMoveTimer);
        clearInterval(ctrlPlayTimer);
        clearInterval(crashCheckTimer);
    };

    //continue game
    var continue_game = document.getElementById("continue_game");
    continue_game.onclick = function () {
        stop.style.display = "none";

        //repeat genrate enemy airplane
        smallPlaneTimer = setInterval(createSmallPlane, 1000);
        //enemy smallPlane move
        planeMoveTimer = setInterval(smallPlaneMove, 50);
        //bullet move
        bulletMoveTimer = setInterval(bulletMove, 10);
        //every 0.3 seconds check the key does press or not.
        ctrlPlayTimer = setInterval(ctrlPlay, 50);
        //every 0.5s call the crashCheck function
        crashCheckTimer = setInterval(crashCheck, 50);
    }


    //new game
    var new_game = document.getElementById("new_game");
    new_game.onclick = function(){
        stop.style.display = "none";
        mainObj.removeChild(player.imgNode);
        player = null;
        for(var i=0; i<smallPlaneArray.length; i++){
            mainObj.removeChild(smallPlaneArray[i].imgNode);
        }
        //remove all smallPlane 
        smallPlaneArray.splice(0,smallPlaneArray.length);

        for(var i=0; i<bulletArray.length; i++){
            mainObj.removeChild(bulletArray[i].imgNode);
        }
        //remove all bullet
        bulletArray.splice(0,bulletArray.length);

        killNumb.innerHTML = 0;
        killScore.innerHTML = 0;

        //repeat genrate enemy airplane
        smallPlaneTimer = setInterval(createSmallPlane, 1000);
        //enemy smallPlane move
        planeMoveTimer = setInterval(smallPlaneMove, 50);
        //bullet move
        bulletMoveTimer = setInterval(bulletMove, 10);
        //every 0.3 seconds check the key does press or not.
        ctrlPlayTimer = setInterval(ctrlPlay, 50);
        //every 0.5s call the crashCheck function
        crashCheckTimer = setInterval(crashCheck, 50);
        //create player plane
        player = new playerPlaneProto("images/myplane.gif", 50, 500, 10);
    };


    //create enemy airplane
    /* 
        property:
            imgnode
            img
            x location
            y location
            moving speed

        action:
            move
            inital  set imgnode add into main element
     */
    function SmallPlaneProto(imgSrc, x, y, speed) {
        this.imgNode = document.createElement("img");
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isDead = false; //life status
        this.exTime = 30; //death countdown
        this.init = function () {
            this.imgNode.src = this.imgSrc;
            this.imgNode.style.position = "absolute";
            this.imgNode.style.left = this.x + "px";
            this.imgNode.style.top = this.y + "px";
            mainObj.appendChild(this.imgNode);
        }
        this.init();
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + "px";
        }
    }

    function createSmallPlane() {
        // src, x location, y location, speed
        var smallPlane = new SmallPlaneProto("images/enemy1_fly_1.png", parseInt(Math.random() * 356), -parseInt(Math.random() * 276 + 40), parseInt(Math.random() * 10 + 1));
        smallPlaneArray.push(smallPlane);
    }



    //enemy smallPlane move method
    function smallPlaneMove() {
        for (var i = 0; i < smallPlaneArray.length; i++) {
            if (smallPlaneArray[i].isDead == false) {
                //only when life the plane can move
                smallPlaneArray[i].move()
                if (parseInt(smallPlaneArray[i].imgNode.style.top) >= 600) {
                    mainObj.removeChild(smallPlaneArray[i].imgNode);
                    smallPlaneArray.splice(i, 1);
                }
            }
            else {
                //when the enemy plane desotry.
                /* 
                    when plane been destory start death countdown, every 50ms countdown-1, 
                    the countdown from 30 to 0 the enemy plane is totally been destoryed.
                */
                smallPlaneArray[i].exTime--;
                if (smallPlaneArray[i].exTime == 0) {
                    mainObj.removeChild(smallPlaneArray[i].imgNode);
                    smallPlaneArray.splice(i, 1);
                }

            }
        }
    }





    //player airplane
    /* 
        property:
            imgnode
            img
            x location
            y location
            moving speed

        action:
            move --->  up down left right
            fire bullets
            inital  set imgnode add into main element
    */
    function playerPlaneProto(imgSrc, x, y, speed) {
        this.imgNode = document.createElement("img");
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.init = function () {
            this.imgNode.src = this.imgSrc;
            this.imgNode.style.position = "absolute";
            this.imgNode.style.left = this.x + "px";
            this.imgNode.style.top = this.y + "px";
            mainObj.appendChild(this.imgNode);
        }
        this.init();

        //player plane opreate
        this.moveLeft = function () {
            //depend on the which key player is press, to determine which direction is airplane fly.
            if (this.imgNode.style.left == "-80px") {
                this.imgNode.style.left = "440px";
            }
            else {
                this.imgNode.style.left = parseInt(this.imgNode.style.left) - this.speed + "px";
            }
        }
        this.moveRight = function () {
            //depend on the which key player is press, to determine which direction is airplane fly.
            if (this.imgNode.style.left == "440px") {
                this.imgNode.style.left = "80px";
            }
            else {
                this.imgNode.style.left = parseInt(this.imgNode.style.left) + this.speed + "px";
            }
        }
        this.moveUp = function () {
            //depend on the which key player is press, to determine which direction is airplane fly.
            if (this.imgNode.style.top == "0px") {
                this.imgNode.style.top = "0px";
            }
            else {
                this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + "px";
            }
        }
        this.moveDown = function () {
            //depend on the which key player is press, to determine which direction is airplane fly.
            if (this.imgNode.style.top == "520px") {
                this.imgNode.style.top = "520px";
            }
            else {
                this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + "px";
            }

        }

        //shoot bullets
        this.shoot = function () {
            //depend on the key to fire the bulltes
            var newBullet = new bulletProto("images/bullet1.png", parseInt(this.imgNode.style.left) + 30, parseInt(this.imgNode.style.top) - 10, 10);
            //Every bullet push into the bulletArray to keep track
            bulletArray.push(newBullet);
        }
    }



    //when player onkeydown move mypalne 
    document.body.onkeydown = function () {
        //compatiable to FireFox
        var e = window.event || arguments[0];
        //console.log(e);

        /* 
            37 left
            38 up
            39 right
            40 down

            32 space
        */

        //move left
        if (e.keyCode == 37) {
            leftBtn = true;
        }
        //move up
        else if (e.keyCode == 38) {
            upBtn = true;
        }
        //move right
        else if (e.keyCode == 39) {
            rightBtn = true;
        }
        //move down
        else if (e.keyCode == 40) {
            downBtn = true;
        }
        if (e.keyCode == 32) {
            player.shoot();
        }

    }

    //close key btn
    document.body.onkeyup = function () {
        //compatiable to FireFox
        var e = window.event || arguments[0];

        //move left
        if (e.keyCode == 37) {
            leftBtn = false;
        }
        //move up
        else if (e.keyCode == 38) {
            upBtn = false;
        }
        //move right
        else if (e.keyCode == 39) {
            rightBtn = false;
        }
        //move down
        else if (e.keyCode == 40) {
            downBtn = false;
        }

    }

    function ctrlPlay() {
        /* if(leftBtn == true){
            player.moveLeft();
        }
        if(rightBtn == true){
            player.moveRight();
        }
        if(upBtn == true){
            player.moveUp();
        }
        if(downBtn == true){
            player.moveDown();
        } */
        switch (true) {
            case leftBtn:
                player.moveLeft();
                break;
            case rightBtn:
                player.moveRight();
                break;
            case upBtn:
                player.moveUp();
                break;
            case downBtn:
                player.moveDown();
                break;
        }

    }




    //bulltes init
    function bulletProto(imgSrc, x, y, speed) {
        this.imgNode = document.createElement("img");
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.init = function () {
            this.imgNode.src = this.imgSrc;
            this.imgNode.style.position = "absolute";
            this.imgNode.style.left = this.x + "px";
            this.imgNode.style.top = this.y + "px";
            mainObj.appendChild(this.imgNode);
        }
        this.init();
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + "px";
            for (var i = 0; i < bulletArray.length; i++) {
                if (parseInt(bulletArray[i].imgNode.style.top <= -20)) {
                    mainObj.removeChild(bulletArray[i].imgNode);
                    bulletArray.splice(i, 1);
                }
            }

        }
    }

    //bullet move
    function bulletMove() {
        for (var i = 0; i < bulletArray.length; i++) {
            bulletArray[i].move();
        }
    }



    //collision funciton
    function crashCheck() {
        for (var i = 0; i < smallPlaneArray.length; i++) {
            for (var j = 0; j < bulletArray.length; j++) {
                //bullet left
                var btLeft = parseInt(bulletArray[j].imgNode.style.left);
                //bullet top
                var btTop = parseInt(bulletArray[j].imgNode.style.top);
                //enemy plane left
                var plLeft = parseInt(smallPlaneArray[i].imgNode.style.left);
                //enemy plane Top
                var plTop = parseInt(smallPlaneArray[i].imgNode.style.top);
                /* console.log(btLeft) */

                // if the enemy plane is life
                if (smallPlaneArray[i].isDead == false) {
                    //only those requiement been satisfy, that means the bullet is collision with enemy plane
                    if (btLeft >= plLeft && btLeft < plLeft + 32 && btTop >= plTop && btTop < plTop + 24) {
                        /* console.log("collision"); */

                        //after collision remove the bullet
                        mainObj.removeChild(bulletArray[j].imgNode);
                        bulletArray.splice(j, 1);

                        //enemy plane make change, replace the imgSrc after bullet collision with enemy plane
                        smallPlaneArray[i].imgNode.src = "images/smallplaneboom.gif";
                        // set the enemy plane life status to True
                        smallPlaneArray[i].isDead = true;

                        //killNum & Score
                        killNumb.innerHTML = parseInt(killNumb.innerHTML) + 1;
                        killScore.innerHTML = parseInt(killScore.innerHTML) + 2;
                    }
                }



            }
        }
    }

};