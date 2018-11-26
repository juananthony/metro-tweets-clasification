document.addEventListener('DOMContentLoaded', function() {
   var tweet = {};

    function showTweet() {
        document.getElementById("tweetMessage").value = tweet.text;
        document.getElementById("tweetId").innerHTML = "id: " + tweet.id;
    }

    function removeTweet() {
        tweet = {};
        document.getElementById("tweetMessage").value = "";
        document.getElementById("tweetId").value = "id: - ";
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
                        id: data.id,
                        text: data.text
                    }
                } else {
                    tweet = {
                        id: data.id,
                        text: data.extended_tweet.full_text
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

    // INIT
    function init() {
        getTweet();
        document.getElementById("nada").addEventListener("click", onNadaClick);
        document.getElementById("queja").addEventListener("click", onQuejalick);
        document.getElementById("incidencia").addEventListener("click", onIncidenciaClick);
    }

    init();
});
