var canvas = document.getElementById('gradient');
var ctx = canvas.getContext('2d');
canvas.width = 256;
canvas.height = 256;
var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(1, 'green');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

AFRAME.registerComponent('details-listener', {
    init: function () {
        var el = this.el;
        console.log("init");

        navigator.mediaDevices.getUserMedia({
                audio: true
            })
            .then(function (stream) {
                const audioContext = new(window.AudioContext || window.webkitAudioContext)();
                const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.lang = "es-ES";
                const inputNode = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                inputNode.connect(analyser);
                recognition.onstart = function () {
                    console.log("El reconocimiento de voz ha comenzado");
                };
                recognition.onend = function () {
                    console.log("El reconocimiento de voz ha terminado. Reiniciando...");
                    recognition.start();
                };
                recognition.onresult = function (event) {
                    const transcript = event.results[0][0].transcript;
                    console.log("Texto reconocido:", transcript);
                    const textoNormalizado = transcript
                        .toLowerCase()
                        .replace(/[^\w\s]/gi, "");
                    if (textoNormalizado.includes("ver detalles")) {
                        console.log("Te he escuchado");

                        const token =
                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6WyJhZG1pbiIsIkN1c3RvbU9iamVjdENhbkJlQWRkZWRIZXJlIl0sIm5iZiI6MTcxMjEzMDQ5MSwiZXhwIjoxNzEyNzM1MjkxLCJpYXQiOjE3MTIxMzA0OTF9.WAgYOp99u5-c-mNTPTpUsvIh7K5RCzyslZeqBuCiUks";
                        const headers = {
                            Authorization: `Bearer ${token}`,
                        };
                        fetch("(https://207.180.229.60:9443/v1/api/INCIDENCIAS/13", {
                                method: "GET",
                                headers: headers,
                            })
                            .then((res) => res.json())
                            .then((res) => {
                                console.log(res);
                                visualizacion(res);
                            })
                            .catch((error) => console.error(error));

                    } else if (textoNormalizado.includes("ocultar detalles")) {
                        console.log("Ocultar detalles");

                        var circleToRemove = document.getElementById('new-circle');
                        if (circleToRemove) {
                            circleToRemove.parentNode.removeChild(circleToRemove);
                        }
                    }

                };

                recognition.onerror = function (event) {
                    console.error("Error de reconocimiento de voz:", event.error);
                };

                function visualize() {
                    analyser.getByteTimeDomainData(dataArray);
                    requestAnimationFrame(visualize);
                }
                visualize();
                recognition.start();


            })

            .catch(function (err) {
                console.error("Error al obtener el flujo de audio:", err);
            });

        function visualizacion(objeto) {
            var newTestTube = document.createElement('a-entity');
            newTestTube.setAttribute('id', 'new-test-tube');
        
            // Configuración de la probeta de laboratorio
            newTestTube.setAttribute('gltf-model', '#test-tube-model');
            newTestTube.setAttribute('position', '0 -1.2 0');
            newTestTube.setAttribute('rotation', '0 45 0');
            newTestTube.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 1000; easing: linear');
        
            // Creación de texto para mostrar los detalles de la incidencia
            var newText = document.createElement('a-text');
            newText.setAttribute('value', `Code: ${objeto.code}\nMessage: ${objeto.message}\nCaja ID: ${objeto.document.CAJA_ID}`);
            newText.setAttribute('align', 'center');
            newText.setAttribute('position', '0 1.2 0');
            newText.setAttribute('color', 'black');
            newText.setAttribute('scale', '0.3 0.3 0.3');
            newTestTube.appendChild(newText);
        
            // Creación de esferas alrededor de la probeta de laboratorio para efecto visual
            var radius = 0.35;
            var numSpheres = 8;
            var angleIncrement = (2 * Math.PI) / numSpheres;
            for (var i = 0; i < numSpheres; i++) {
                var angle = i * angleIncrement;
                var x = radius * Math.cos(angle);
                var y = radius * Math.sin(angle);
        
                var sphere = document.createElement('a-sphere');
                sphere.setAttribute('radius', '0.05');
                sphere.setAttribute('color', 'green');
                sphere.setAttribute('position', `${x} ${y} 0`);
                sphere.setAttribute('animation', 'property: rotation; to: 0 360 0; dur: 2000; easing: linear; loop: true');
                newTestTube.appendChild(sphere);
            }
        
            el.parentNode.appendChild(newTestTube);
            
        }
    }

})

document.addEventListener('DOMContentLoaded', function () {
    var detailsBox = document.querySelector('#details-box');
    if (detailsBox) {
        console.log("existe")
        detailsBox.setAttribute('details-listener', '');
    }
});