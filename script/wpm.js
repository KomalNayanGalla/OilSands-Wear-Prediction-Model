$(document).ready(function() {
    const buttonInches = $('#buttonInches');
    const buttonMM = $('#buttonMM');
    const measures = $(".measure");

    var vaneLengths;
    var Impacts;
    var Hours;
    
    let lineGraph;

    function loadInches() {
        buttonInches.addClass('selected');
        measures.each(function() {
            $(this).html('in');
        });
        $("#eyeDiameter").val(28);
        $("#nominalVaneLength").val(45);
        $("#impellerID").val(28);
        $("#impellerOD").val(62);
        $("#wearCoefficient").val(350); /*TO BE REMOVED*/    
    }

    buttonInches.on('click', function() {
        buttonInches.addClass('selected');
        buttonMM.removeClass('selected');
        measures.each(function() {
            $(this).html('in');
        });
    });

    buttonMM.on('click', function() {
        buttonMM.addClass('selected');
        buttonInches.removeClass('selected');
        measures.each(function() {
            $(this).html('mm');
        });
    });

    function updateValue(value) {
        $('#exponentValue').text(parseFloat(value).toFixed(2));
    }

    $('.analyse').on('click', function() {
        console.log('Analyse button clicked');
        vaneLengths = [];
        Hours = [];
        Impacts = [];

        const startHours = parseFloat($("#startHours").val());
        const averageFlow = parseFloat($("#avgFlow").val());
        const eyeDiameter = parseFloat($("#eyeDiameter").val());
        const density = parseFloat($("#SG").val());
        const averageRPM = parseFloat($("#avgRPM").val());
        const startVL = parseFloat($("#startVaneLength").val());
        const failVL = parseFloat($("#failureVaneLength").val());
        const nominalVaneLength = parseFloat($("#nominalVaneLength").val());
        const impellerID = parseFloat($("#impellerID").val());
        const impellerOD = parseFloat($("#impellerOD").val());
        const exponent = parseFloat($('#exponentValue').text());
        const wearCoefficient = parseFloat($("#wearCoefficient").val());

        const suctionVelocity = (averageFlow / 3600) / (Math.PI * Math.pow((eyeDiameter * 0.0254 / 2), 2));
        const solidsWeightPercent = -(((1 / density) - 1) / ((2.65 - 1) / 2.65));
        const averageTonnage = ((density - 0.99) / (2.65 - 0.99)) * averageFlow * 2.65;

        $("#suctionVelocity").val(suctionVelocity.toFixed(9));
        $("#solidsWeightPercent").val(solidsWeightPercent.toFixed(9));
        $("#avgTonnage").val(averageTonnage.toFixed(9));

        for (let vl = startVL; vl >= failVL; vl -= ((startVL - failVL) / 25)) {
            vaneLengths.push(vl.toFixed(2));
        }

        for (let i = 0; i < vaneLengths.length; i++) {
            Impacts.push((Math.sqrt(Math.pow(suctionVelocity, 2) + Math.pow(Math.PI * (averageRPM / 60) * 0.0254 * (impellerID + ((nominalVaneLength - vaneLengths[i]) / nominalVaneLength) * (impellerOD - impellerID)), 2))).toFixed(6));
        }

        for (let i = 0; i < vaneLengths.length; i++) {
            if (i === 0) {
                Hours.push(startHours);
            } else {
                Hours.push(parseFloat((Hours[i - 1] + (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (5000 / averageTonnage) * Math.pow(15.4 / Impacts[i - 1], exponent)).toFixed(4)));
            }
        }

        $("#totalLifeSpan").val(Hours[20]);

        let t = "";
        for (let i = 0; i < vaneLengths.length; i++) {
            let tr = "<tr>";
            tr += "<td style='text-align:center;'>" + Impacts[i] + "</td>";
            tr += "<td style='text-align:center;'>" + vaneLengths[i] + "</td>";
            tr += "<td style='text-align:center;'>" + Hours[i] + "</td>";
            tr += "</tr>";
            t += tr;
        }
        $("#tableBody").html(t);

        // GRAPH 
        const ctx = $("#lineGraph")[0].getContext('2d');
        if (lineGraph) {
            lineGraph.data.datasets[0].data = Hours.map((hour, index) => ({ x: hour, y: vaneLengths[index] }));
            lineGraph.update();
        } else {
            lineGraph = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Vane Length',
                        data: Hours.map((hour, index) => ({ x: hour, y: vaneLengths[index] })),
                        borderColor: 'magenta',
                        borderWidth: 2,
                        lineTension: 0.4 // Adjust this value to control the curve
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            title: {
                                display: true,
                                text: 'Hours',
                                color: '#00FFFF'
                            },
                            min: 0,
                            max: 8000,
                            ticks: {
                                stepSize: 1000 // Ensure labels are spaced by 1000
                            },
                            grid: {
                                display: true, // Enable grid lines
                                color: '#A9A9A9' // Set grid line color
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Vane Length',
                                color: '#00FFFF'
                            },
                            min: 0,
                            max: 80,
                            grid: {
                                display: true, // Enable grid lines
                                color: '#A9A9A9' // Set grid line color
                            }
                        }
                    }
                }
            });
        }
    });

    $('nav a').on('click', function() {
        $('nav a').removeClass('active');
        $(this).addClass('active');

        const animation = $('.animation');
        if ($(this).text() === 'IMPELLER') {
            animation.css({ width: '120px', left: '0', backgroundColor: '#1abc9c' });
        } else if ($(this).text() === 'THROATBUSH') {
            animation.css({ width: '120px', left: '120px', backgroundColor: '#e74c3c' });
        } else if ($(this).text() === 'VOLUTE') {
            animation.css({ width: '120px', left: '240px', backgroundColor: '#3498db' });
        } else if ($(this).text() === 'FPLI') {
            animation.css({ width: '120px', left: '360px', backgroundColor: '#9b59b6' });
        }
    });
});
