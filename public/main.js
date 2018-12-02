document.addEventListener('DOMContentLoaded', function() {
   var tweet = {},
        prevTweet = {},
        TWITTER_URL = "https://twitter.com/";

   function getUserUrl() {
       return TWITTER_URL + tweet.user.screen_name;
   }

   function getTweetUrl() {
        return TWITTER_URL + tweet.user.screen_name + "/status/" + tweet.id;
    }

    function clone(obj) {
        var copy;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }

    function getDate(fecha) {
        var monthNames = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre",
            "Noviembre", "Diciembre"
        ];

        var weekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        var textoFecha = 
            weekNames[fecha.getDay()] + 
            ", " + pad(fecha.getDate(), 2) + 
            " de " + 
            monthNames[fecha.getMonth()] + 
            " de " + 
            fecha.getFullYear() +
            " a las " +
            pad(fecha.getHours(),2) + ":" + pad(fecha.getMinutes(), 2);

        return textoFecha;
    }

    function showTweet() {
        document.getElementById("tweetMessage").value = tweet.text;
        document.getElementById("tweetId").innerHTML = "id: " + tweet.id;
        document.getElementById("usuario").innerHTML = tweet.user.name + " (@" + tweet.user.screen_name + " - " + tweet.user.id + ")";
        document.getElementById("enlaceUsuario").setAttribute("href", getUserUrl());
        document.getElementById("fecha").innerHTML = getDate(new Date(parseInt(tweet.timestamp_ms)));
        document.getElementById("tweetUrl").setAttribute("href", getTweetUrl());
    }

    function removeTweet() {
        prevTweet = clone(tweet);
        tweet = {};
        document.getElementById("tweetMessage").value = "";
        document.getElementById("tweetId").value = "id: - ";
        document.getElementById("usuario").innerHTML = " - ";
        document.getElementById("enlaceUsuario").setAttribute("href", "#");
        document.getElementById("fecha").innerHTML = " - ";
        document.getElementById("tweetUrl").setAttribute("href", "#");
    }

    function setAlert(alerta) {
        var el = document.createElement("div");
        el.className = "alert alert-danger";
        el.id = "alerta";
        el.innerHTML = alerta;
        var div = document.getElementById("alertDiv");
        if(div.children.length === 0) {
            div.appendChild(el);
        }
    }

    function removeAlert() {
        var el = document.getElementById("alerta");
        if(el !== null) {
            document.getElementById("alertaDiv").removeChild(el);
        }
    }

    function getTweet() {
        var request = new XMLHttpRequest();
        request.open('GET', '/tweets', true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                removeAlert();
                // Success!
                var data = JSON.parse(request.responseText);
                if(data.extended_tweet === undefined) {
                    tweet = {
                        _id: data._id,
                        id: data.id,
                        text: data.text,
                        user: data.user,
                        created_at: data.created_at,
                        timestamp_ms: data.timestamp_ms
                    }
                } else {
                    tweet = {
                        _id: data._id,
                        id: data.id,
                        text: data.extended_tweet.full_text,
                        user: data.user,
                        created_at: data.created_at,
                        timestamp_ms: data.timestamp_ms
                    }
                }
                showTweet();
            } else {
                setAlert("Error recuperando los tweets a clasificar.");
            }
        };
        request.onerror = function() {
            setAlert("Error clasificando el tweet. Prueba de nuevo");
        };
        request.send();
    }

    function getOneTweet(tweetId) {
        var request = new XMLHttpRequest();
        request.open('GET', '/tweets/' + tweetId, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                removeAlert();
                // Success!
                var data = JSON.parse(request.responseText);
                if(data.extended_tweet === undefined) {
                    tweet = {
                        _id: data._id,
                        id: data.id,
                        text: data.text,
                        user: data.user,
                        created_at: data.created_at,
                        timestamp_ms: data.timestamp_ms
                    }
                } else {
                    tweet = {
                        _id: data._id,
                        id: data.id,
                        text: data.extended_tweet.full_text,
                        user: data.user,
                        created_at: data.created_at,
                        timestamp_ms: data.timestamp_ms
                    }
                }
                showTweet();
            } else {
                setAlert("Error recuperando los tweets a clasificar.");
            }
        };

        request.onerror = function() {
            setAlert("Error clasificando el tweet. Prueba de nuevo");
        };

        request.send();
    }

    function setClassification(classification) {
        tweet.classified = classification;

        var request = new XMLHttpRequest();

        request.open('POST', '/tweets/' + tweet.id);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                removeAlert();
                removeTweet();
                getTweet();
            } else {
                setAlert("Error clasificando el tweet. Prueba de nuevo");
            }
        };

        request.onerror = function() {
            setAlert("Error clasificando el tweet. Prueba de nuevo");
        };

        request.send(JSON.stringify(tweet));
    }

    function onNadaClick() {
        setClassification("nothing")
    }

    function onQuejalick() {
        setClassification("complaint");
    }

    function onIncidenciaClick() {
        setClassification("issue");
    }

    function onDeshacerClick() {
        if(prevTweet.id !== undefined) {
            tweet = clone(prevTweet);
            getOneTweet(tweet._id);
            prevTweet = {};

        } 
    }

    // INIT
    function init() {
        getTweet();
        document.getElementById("nada").addEventListener("click", onNadaClick);
        document.getElementById("queja").addEventListener("click", onQuejalick);
        document.getElementById("incidencia").addEventListener("click", onIncidenciaClick);
        document.getElementById("deshacer").addEventListener("click", onDeshacerClick);
    }

    init();
});
