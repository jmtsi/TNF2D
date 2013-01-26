/**
 * Created with JetBrains WebStorm.
 * User: jami
 * Date: 25.1.2013
 * Time: 22:52
 * To change this template use File | Settings | File Templates.
 */

// RequestAnimationFrame polyfill
(function() {
    var lastTime=0;
    var vendors=['ms', 'moz', 'webkit', 'o'];
    for (var x=0; x<vendors.length && !window.requestAnimationFrame; x++) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] ||
                window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime.timeToCall); },
                timeToCall);
            lastTime = currTime+timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


$(document).ready(function() {
    game.init();
});

var game = {

    context: {},
    hero: {},
    entities: [],

    init: function() {
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
        game.canvas.height = window.innerHeight;
        game.canvas.width = window.innerWidth;

        // Näytetään päämenu
        $('.gamelayer').hide();
        $('#startscreen').show();
    },
    start: function() {
        for (var entity in level.entities) {
            entities.create(level.entities[entity]);
        }
        game.ended = false;

        keyhandler.init();

        // Näytetään pelicanvas ja startataan animaatio
        $('.gamelayer').hide();
        $('#gamecanvas').show();
        game.animate();
    },

    step: function() {
        if (keyhandler.down) {
            game.entities[0].y++;
        }
        if (keyhandler.up) {
            game.entities[0].y--;
        }
        if (keyhandler.left) {
            game.entities[0].x--;
        }
        if (keyhandler.right) {
            game.entities[0].x++;
        }
    },
    animate: function() {

        // Siivotaan canvas
        game.context.clearRect(0,0,game.canvas.width,game.canvas.height);

        game.step();
        game.drawAllEntities();

        if (game.ended) {
            //TODO näytä loppuruutu
        }
        else {
            game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
        }
    },
    drawAllEntities: function() {
        for (var entity in game.entities) {
            entities.draw(game.entities[entity]);
        }
    }
}

var level = {
    definition:{},
    entities:[{type: "hero", x: 10, y: 10}]
}

var entities = {
    definitions: {
        "hero": {
            name: "blank",
            type: "hero",
            width:10,
            height:10
        }
    },
    create: function(entity) {

        var definition = entities.definitions[entity.type];
        if (!definition) {
            console.log ("Undefined entity type ", entity.type);
            return;
        }


        switch(entity.type) {
            case "hero":
                console.log(entity);
                entity.width = definition.width;
                entity.height = definition.height;
                //entity.sprite = loader.loadImage("img/hero.png");
                game.entities.push(entity);
        }
    },
    draw: function(entity) {

        switch(entity.type) {
            case "hero":
                game.context.fillStyle = 'rgb(255,0,0)';
                game.context.fillRect(entity.x, entity.y, entity.width, entity.height);
        }

    }
}

var keyhandler = {

    up: false,
    down: false,
    left: false,
    right: false,

    init: function() {
        $(window).keydown(function(e) {
            var code = e.keyCode;
            //    console.log(code);
            if(code == 37) { // Vasen
                e.preventDefault();
                keyhandler.left = true;
            }
            if(code == 39) { // Oikea
                e.preventDefault();
                keyhandler.right = true;
            }
            if(code == 38) { // Ylös
                e.preventDefault();
                keyhandler.up = true;
            }
            if(code == 40) { // Alas
                e.preventDefault();
                keyhandler.down = true;
            }
        });
        $(window).keyup(function(e) {
            var code = e.keyCode;
            //    console.log(code);
            if(code == 37) { // Vasen
                e.preventDefault();
                keyhandler.left = false;
            }
            if(code == 39) { // Oikea
                e.preventDefault();
                keyhandler.right = false;
            }
            if(code == 38) { // Ylös
                e.preventDefault();
                keyhandler.up = false;
            }
            if(code == 40) { // Alas
                e.preventDefault();
                keyhandler.down = false;
            }
        });
    }
}

var loader = {

    loaded: true,
    loadedCount: 0,
    totalCount: 0,

    init: function() {
        var mp3Support, oggSupport;
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
            mp3Support = "" !=audio.canPlayType('audio/meg');
            oggSupport = "" !=audio.canPlayType('audio/ogg; codecs="vorbis"');
        } else {
            mp3Support = false;
            oggSupport = false;
        }

        loader.soundFileExtn = oggSupport?".ogg":mp3Support?".mp3":undefined;
    },

    loadImage: function(url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var image = new Image();
        image.src=url;
        image.onload=loader.itemLoaded;
        return image;
    },

    soundFileExtn:".ogg",

    loadSound: function(url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var audio = new Audio();
        audio.src=url+loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        return audio;
    },

    itemLoaded: function() {
        loader.loadedCount++;
        $('#loadingmessage').html('Loaded ' +loader.loadedCount+' of '+loader.totalCount);
        if (loader.loadedCount === loader.totalCount) {
            // Loader on valmis
            loader.loaded = true;
            // Piilotetaan latausviesti
            $('#loadingscreen').hide();
            // Kutsutaan loader.onloadia, jos sellainen löytyy
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }

        }
    }
}

