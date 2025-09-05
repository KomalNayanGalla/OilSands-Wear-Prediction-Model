const buttonImperial = document.getElementById('buttonImperial');
    const buttonMetric = document.getElementById('buttonMetric');
	const measures = document.getElementsByClassName("measure");
	
	var metricFlag = 1;	
	
	//TB-IMP Compatibility
	const compatibilityMap = {
		"UHTP60083*": ["UHTP60145*"],
		"UHTP60083-3*": ["UHTP60145E2*","UHTP60145E4*","UHTP60145HY*","UHTP60145E5*"],
		"UHTP60083R3*": ["UHTP60145RE1*"],
		"UHTP65083RS*": ["UHTP65145RE*","UHTP65145R3E94*","UHTP65145REE92*"],
		"UHTP50083*": ["UHTP50145*", "UHTP50145-0001*","UHTP50145BF1WC*"],
		"HTPU55083RE*": ["HTPU55145*"]
	};

	//Impeller Dimensions in mm - assuming ID = Eye 
	const impellerData = {
        "UHTP60145*": {
            "Eye Diameter": 720,
            "Nominal Vane Length": 1140,
            "Impeller ID": 720,
            "Impeller OD": 1575
        },
		"UHTP60145E2*": { // A701343
            "Eye Diameter": 720,
            "Nominal Vane Length": 1310,
            "Impeller ID": 720,
            "Impeller OD": 1575
        },
		"UHTP60145RE1*": { // A391321
            "Eye Diameter": 625,
            "Nominal Vane Length": 1380,
            "Impeller ID": 625,
            "Impeller OD": 1575
        },
		"UHTP60145E4*": { // A781101
            "Eye Diameter": 720,
            "Nominal Vane Length": 1300,
            "Impeller ID": 720,
            "Impeller OD": 1575
        },
		"UHTP60145R4*": { // A781100
            "Eye Diameter": 625,
            "Nominal Vane Length": 1300,
            "Impeller ID": 625,
            "Impeller OD": 1575
        },
		"UHTP60145HY*": { // A782388
            "Eye Diameter": 720,
            "Nominal Vane Length": 1184,
            "Impeller ID": 720,
            "Impeller OD": 1575
        },
		"UHTP60136E4*": { // A781103
            "Eye Diameter": 720,
            "Nominal Vane Length": 1501,
            "Impeller ID": 720,
            "Impeller OD": 1575
        },
		"UHTP60136R4*": { // A781102
            "Eye Diameter": 625,
            "Nominal Vane Length": 1501,
            "Impeller ID": 625,
            "Impeller OD": 1575
        },
		"UHTP60145E5*": { 
            "Eye Diameter": 720,
            "Nominal Vane Length": 1260,
            "Impeller ID": 720,
            "Impeller OD": 1575
        },
        "UHTP65145RE*": { // A780089
            "Eye Diameter": 710,
            "Nominal Vane Length": 1950,
            "Impeller ID": 710,
            "Impeller OD": 1880
        },
        "UHTP65145E94R*": { // A781629
            "Eye Diameter": 710,
            "Nominal Vane Length": 1790,
            "Impeller ID": 710,
            "Impeller OD": 1880
        },
        "UHTP65145R3E94*": { // A782445
            "Eye Diameter": 710,
            "Nominal Vane Length": 1785,
            "Impeller ID": 710,
            "Impeller OD": 1880
        },
        "UHTP65145REE92*": { // A782532
            "Eye Diameter": 710,
            "Nominal Vane Length": 1795,
            "Impeller ID": 710,
            "Impeller OD": 1880
        },
		"HTPU55145*": { // A781711
            "Eye Diameter": 625,
            "Nominal Vane Length": 1109,
            "Impeller ID": 625,
            "Impeller OD": 1525
        },
        "UHTP50145*": { // A392515
            "Eye Diameter": 610,
            "Nominal Vane Length": 1020,
            "Impeller ID": 610,
            "Impeller OD": 1425
        },
        "UHTP50145BF1WC*": { // A782144
            "Eye Diameter": 610,
            "Nominal Vane Length": 1030,
            "Impeller ID": 610,
            "Impeller OD": 1425
        },
        "UHTP50145-0001*": { // A784461
            "Eye Diameter": 610,
            "Nominal Vane Length": 995,
            "Impeller ID": 610,
            "Impeller OD": 1354
        }
    };
	
	//Throatbush Dimensions - mm 
	const throatbushData = {
        "UHTP60083*": { //A380519
            "Eye Diameter": 695,
            "ID Thickness": 100,
            "OD Thickness": 116
        },
		"UHTP65083RS*": { // A780095
            "Eye Diameter": 695,
            "ID Thickness": 1140,
            "OD Thickness": 160
        },
		"UHTP60083-3*": { // A700784
            "Eye Diameter": 695,
            "ID Thickness": 1140,
            "OD Thickness": 114.5
        },
		"UHTP60083R3*": { // A701333
            "Eye Diameter": 625,
            "ID Thickness": 1140,
            "OD Thickness": 115
        },
		"HTPU55083RE*": { // A781724
            "Eye Diameter": 695,
            "ID Thickness": 1140,
            "OD Thickness": 129
        },
		"UHTP50083*": { // A380753
            "Eye Diameter": 590,
            "ID Thickness": 1140,
            "OD Thickness": 115
        }
    };

	/*
	AVERAGE DUTY Conditions - Metric
	+------------+--------+
	|  Measure   |  Unit  |
	+------------+--------+
	|  avgRPM    |  rpm   |
	|  avgHead   |   m    |
	|    SG      |  none  |
	|  avgFlow   |  m3/hr |
	| wearCoeff. |  none  |
	+------------+--------+
	*/
	
	const dutyConditions = {
		"Horizon": {
			"Hydrotransport": {
				"wearCoefficient": 350,
				"avgRPM": 350,
				"avgFlow": 5924,
				"SG": 1.60,
				"avgHead": 26.2,
				"avgD50": 259
			},
			"Tailings": {
				"wearCoefficient": 137,
				"avgRPM": 350,
				"avgFlow": 4908,
				"SG": 1.63,
				"avgHead": 32.2,
				"avgD50": 257
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"JPM": {
			"Hydrotransport": {
				"wearCoefficient": 250,
				"avgRPM": 340,
				"avgFlow": 6000,
				"SG": 1.49,
				"avgHead": 40,
				"avgD50": 110
			},
			"Tailings": {
				"wearCoefficient": 108,
				"avgRPM": 350,
				"avgFlow": 7000,
				"SG": 1.49,
				"avgHead": 48,
				"avgD50": 150
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"MRM": {
			"Hydrotransport": {
				"wearCoefficient": 100,
				"avgRPM": 300,
				"avgFlow": 6500,
				"SG": 1.79,
				"avgHead": 45,
				"avgD50": 110
			},
			"Tailings": {
				"wearCoefficient": 174,
				"avgRPM": 310,
				"avgFlow": 5440,
				"SG": 1.61,
				"avgHead": 27.4,
				"avgD50": 300
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"K1": {
			"Hydrotransport": {
				"wearCoefficient": 150,
				"avgRPM": 325,
				"avgFlow": 6700,
				"SG": 1.58,
				"avgHead": 50,
				"avgD50": 140
			},
			"Tailings": {
				"wearCoefficient": 205,
				"avgRPM": 345,
				"avgFlow": 6820,
				"SG": 1.48,
				"avgHead": 45,
				"avgD50": 135
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"K2": {
			"Hydrotransport": {
				"wearCoefficient": 200,
				"avgRPM": 350,
				"avgFlow": 5600,
				"SG": 1.57,
				"avgHead": 31,
				"avgD50": 130
			},
			"Tailings": {
				"wearCoefficient": 351,
				"avgRPM": 340,
				"avgFlow": 6950,
				"SG": 1.39,
				"avgHead": 53,
				"avgD50": 125
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"Mildred Lake": {
			"Hydrotransport": {
				"wearCoefficient": 400,
				"avgRPM": 320,
				"avgFlow": 6200,
				"SG": 1.68,
				"avgHead": 50,
				"avgD50": 90
			},
			"Tailings": {
				"wearCoefficient": 379,
				"avgRPM": 330,
				"avgFlow": 6800,
				"SG": 1.42,
				"avgHead": 48,
				"avgD50": 115
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"Aurora": {
			"Hydrotransport": {
				"wearCoefficient": 50,
				"avgRPM": 400,
				"avgFlow": 8000,
				"SG": 1.66,
				"avgHead": 70,
				"avgD50": 145
			},
			"Tailings": {
				"wearCoefficient": 223,
				"avgRPM": 340,
				"avgFlow": 7000,
				"SG": 1.48,
				"avgHead": 46,
				"avgD50": 140
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"Base Plant": {
			"Hydrotransport": {
				"wearCoefficient": 30,
				"avgRPM": 320,
				"avgFlow": 7000,
				"SG": 1.55,
				"avgHead": 46,
				"avgD50": 120
			},
			"Tailings": {
				"wearCoefficient": 242,
				"avgRPM": 325,
				"avgFlow": 6300,
				"SG": 1.47,
				"avgHead": 40,
				"avgD50": 120
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"Fort Hills": {
			"Hydrotransport": {
				"wearCoefficient": 40,
				"avgRPM": 350,
				"avgFlow": 6900,
				"SG": 1.54,
				"avgHead": 44,
				"avgD50": 85
			},
			"Tailings": {
				"wearCoefficient": 326,
				"avgRPM": 340,
				"avgFlow": 6800,
				"SG": 1.48,
				"avgHead": 43,
				"avgD50": 85
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		},
		"": {
			"Hydrotransport": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			},
			"Tailings": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			},
			"": {
				"wearCoefficient": "",
				"avgRPM": "",
				"avgFlow": "",
				"SG": "",
				"avgHead": "",
				"avgD50": ""
			}
		}
	};
	
	//Loading Metric by default 
	function loadMetric()
	{
		buttonMetric.classList.add('selected');
		for (var i = 0; i < measures.length; i++) {
		           measures[i].innerHTML = 'mm';
		}
		
	
		// Populate Throatbush IPN dropdown
        
		const dropdown1 = document.getElementById('tbIPNDropdown');
        for (const key in throatbushData) {
            if (throatbushData.hasOwnProperty(key)) {
                const option = document.createElement('option');
                option.value = key;
                option.text = key;
                dropdown1.appendChild(option);
            }
        }

		// Populate Impeller IPN dropdown
        
		const dropdown2 = document.getElementById('impIPNDropdown');
        for (const key in impellerData) {
            if (impellerData.hasOwnProperty(key)) {
                const option = document.createElement('option');
                option.value = key;
                option.text = key;
                dropdown2.appendChild(option);
            }
        }

		//Disabling Impeller Dropdown until a Throatbush is selected
		document.getElementById('impIPNDropdown').selectedIndex = 0;
		document.getElementById('impIPNDropdown').disabled = true;
		
		// Define links and animation before using them
	    const links = document.querySelectorAll('nav a');
	    const animation = document.querySelector('.animation');

	    links.forEach(link => link.classList.remove('active'));

	    const throatbushTab = Array.from(links).find(link => link.textContent.trim() === 'THROATBUSH');
	    if (throatbushTab) {
	        throatbushTab.classList.add('active');
	        animation.style.width = '120px';
	        animation.style.left = '120px';
	        animation.style.backgroundColor = '#e74c3c';
	    }

	}
	
	//Toggle Hamburger menu
	function toggleMenu() {
		const menu = document.getElementById("hamburgerMenu");
		menu.classList.toggle("show");
	}	
	
	
	//Impeller Dropdown - Impeller Dimensions
	document.getElementById('impIPNDropdown').addEventListener('change', function() {
	        const selectedIPN = this.value;
	        const impellerDetails = impellerData[selectedIPN];
	        //alert('You selected: ' + impellerDetails["Eye Diameter"]);
			
			if (buttonImperial.classList.contains('selected')){
			document.getElementById("impellerOD").value = (impellerDetails["Impeller OD"]*0.0394).toFixed(2);
			}
			else
			{
			document.getElementById("impellerOD").value = (impellerDetails["Impeller OD"]).toFixed(2);
			}
	 });
	
	//Throatbush Dropdown - TB Dimensions
	document.getElementById('tbIPNDropdown').addEventListener('change', function() {
	        const selectedIPN = this.value;
	        const tbDetails = throatbushData[selectedIPN];
	        //alert('You selected: ' + tbDetails["Eye Diameter"]);
			
			// enable Impeller Dropdown
			document.getElementById('impIPNDropdown').disabled = false;
		    
			// Filter Impeller dropdown
		    const impDropdown = document.getElementById('impIPNDropdown');
		    impDropdown.innerHTML = '<option value="" disabled selected hidden>-- Impeller IPN --</option>';

		    const compatibleImpellers = compatibilityMap[selectedIPN] || [];

		    for (const key of compatibleImpellers) {
		      const option = document.createElement('option');
		      option.value = key;
		      option.text = key;
		      impDropdown.appendChild(option);
		    }

			
			if (buttonImperial.classList.contains('selected')){
			document.getElementById("eyeDiameter").value = (tbDetails["Eye Diameter"]*0.0394).toFixed(2);
			document.getElementById("throatbushID").value = (tbDetails["ID Thickness"]*0.0394).toFixed(2);
			document.getElementById("throatbushOD").value = (tbDetails["OD Thickness"]*0.0394).toFixed(2);
			}
			else
			{
			document.getElementById("eyeDiameter").value = (tbDetails["Eye Diameter"]).toFixed(2);
			document.getElementById("throatbushID").value = (tbDetails["ID Thickness"]).toFixed(2);
			document.getElementById("throatbushOD").value = (tbDetails["OD Thickness"]).toFixed(2);
			}
	    });
	
	//Mine Site - Applications - Duty Conditions Reactions
	function updateFormFields() 
	{
		const selectedMineSite = document.getElementById("siteDropdown").value;
		const selectedApplication = document.getElementById("applicationDropdown").value;

		const data = dutyConditions[selectedMineSite]?.[selectedApplication];
		
		//Metric Duty load
		if (buttonMetric.classList.contains('selected'))
		{
		  if (data) 
		  {
			//document.getElementById('wearCoefficient').value = data.wearCoefficient;
			document.getElementById('avgRPM').value = data.avgRPM;
			document.getElementById('avgFlow').value = data.avgFlow;
			document.getElementById('SG').value = data.SG;
			document.getElementById('avgHead').value = data.avgHead;
			document.getElementById('avgD50').value = data.avgD50 ;
		  } 
		  else 
		  {
			window.alert("No data found for selected combination.");
		  }
		}
		//Imperial Duty Load
		else
		{
			if (data) 
		  {
			//document.getElementById('wearCoefficient').value = data.wearCoefficient;
			document.getElementById('avgRPM').value = data.avgRPM || '';
			document.getElementById('avgFlow').value = data.avgFlow ? (data.avgFlow * 4.4029).toFixed(2) : '';
			document.getElementById('SG').value = data.SG || '';
			document.getElementById('avgHead').value = data.avgHead ? (data.avgHead * 3.281).toFixed(2) : '';
			document.getElementById('avgD50').value = data.avgD50 ? (data.avgD50*2).toFixed(2) : '';
		  } 
		  else 
		  {
			window.alert("No data found for selected combination.");
		  }
		}
	}
	
		//Toggle Customize Duty Conditions
		document.getElementById('cbx-3').addEventListener('change', function() {
            if (this.checked) {
				//enable fields inputs
                document.getElementById("avgRPM").disabled = false;
				document.getElementById("avgFlow").disabled = false;
				document.getElementById("SG").disabled = false;
				document.getElementById("avgHead").disabled = false;
				document.getElementById("avgD50").disabled = false;
				
				//placeholders
				document.getElementById("avgRPM").placeholder = 'Input Average RPM';
				document.getElementById("avgFlow").placeholder = 'Input Average Flow';
				document.getElementById("SG").placeholder = 'Input Specific Gravity';
				document.getElementById("avgHead").placeholder = 'Input Average Head';
				document.getElementById("avgD50").placeholder = 'Input Average D50';
				
				//border styles
				document.getElementById("avgRPM").style.border = '1px solid yellow';
				document.getElementById("avgFlow").style.border = '1px solid yellow';
				document.getElementById("SG").style.border = '1px solid yellow';
				document.getElementById("avgHead").style.border = '1px solid yellow';
				document.getElementById("avgD50").style.border = '1px solid yellow';
				
				//Resetting and Disabling Application and Mine Site Dropdowns
				document.getElementById('siteDropdown').selectedIndex = 0;
				document.getElementById('siteDropdown').disabled = true;
				document.getElementById('applicationDropdown').selectedIndex = 0;
				document.getElementById('applicationDropdown').disabled = true;
            } else {
                //disable fields inputs
                document.getElementById("avgRPM").disabled = true;
				document.getElementById("avgFlow").disabled = true;
				document.getElementById("SG").disabled = true;
				document.getElementById("avgHead").disabled = true;
				document.getElementById("avgD50").disabled = true;
				
				//placeholders
				document.getElementById("avgRPM").placeholder = 'extracted or custom';
				document.getElementById("avgFlow").placeholder = 'extracted or custom';
				document.getElementById("SG").placeholder = 'extracted or custom';
				document.getElementById("avgHead").placeholder = 'extracted or custom';
				document.getElementById("avgD50").placeholder = 'extracted or custom';
				
				//border styles
				document.getElementById("avgRPM").style.border = '1px solid red';
				document.getElementById("avgFlow").style.border = '1px solid red';
				document.getElementById("SG").style.border = '1px solid red';
				document.getElementById("avgHead").style.border = '1px solid red';
				document.getElementById("avgD50").style.border = '1px solid red';				
				
				//enabling mine site and Application Dropdowns
				document.getElementById('applicationDropdown').disabled = false;
				document.getElementById('siteDropdown').disabled = false;
            }
        });

		
		//Update Exponent 1
        function updateValue1(value) {
			//exponent = parseFloat(value).toFixed(2);
            document.getElementById('exponent1Value').textContent = parseFloat(value).toFixed(2);
        }

		//Update Exponent 2
        function updateValue2(value) {
			//exponent = parseFloat(value).toFixed(2);
            document.getElementById('exponent2Value').textContent = parseFloat(value).toFixed(2);
        }

		//Float/Numeric Check
		function isFloat(value) {
		    return !isNaN(value) && parseFloat(value) == value;
		}
		
	//Imperial Button Click
    buttonImperial.addEventListener('click', () => {
            buttonImperial.classList.add('selected');
            buttonMetric.classList.remove('selected');
            // Add functionality for Inches
			
			for (var i = 0; i < measures.length; i++) {
                measures[i].innerHTML = 'in';
            }
			document.getElementById("impTipSpeedUnits").innerHTML="ft/s";
			document.getElementById("eyeTipSpeedUnits").innerHTML="ft/s";
			document.getElementById("headUnits").innerHTML="ft";
			//document.getElementById("sgUnits").innerHTML="lb/ft<sup>3</sup>";
			document.getElementById("flowUnits").innerHTML="gpm";
			
			if(metricFlag == 1)
			{
				if(document.getElementById("eyeDiameter").value)
				{
					document.getElementById("eyeDiameter").value= (document.getElementById("eyeDiameter").value/25.4).toFixed(2);
					document.getElementById("throatbushID").value= (document.getElementById("throatbushID").value/25.4).toFixed(2);
					document.getElementById("throatbushOD").value= (document.getElementById("throatbushOD").value/25.4).toFixed(2);
				}
				if(document.getElementById("impellerOD").value)
				{
					document.getElementById("impellerOD").value= (document.getElementById("impellerOD").value/25.4).toFixed(2);
				}
				if(document.getElementById("avgHead").value)
				{
					document.getElementById("avgHead").value = (document.getElementById("avgHead").value*3.281).toFixed(2);
				}
				if(document.getElementById("avgFlow").value)
				{
					document.getElementById("avgFlow").value = (document.getElementById("avgFlow").value*4.4029).toFixed(2);
				}
				if(document.getElementById("eyeTipSpeed").value)
				{
					document.getElementById("eyeTipSpeed").value = (document.getElementById("eyeTipSpeed").value*3.281).toFixed(2);
				}
				if(document.getElementById("impTipSpeed").value)
				{
					document.getElementById("impTipSpeed").value = (document.getElementById("impTipSpeed").value*3.281).toFixed(2);
				}				
				metricFlag = 0;				
			}

        });

	//Metric Button Click 
    buttonMetric.addEventListener('click', () => {
            buttonMetric.classList.add('selected');
            buttonImperial.classList.remove('selected');
            for (var i = 0; i < measures.length; i++) {
                measures[i].innerHTML = 'mm';
            }
			document.getElementById("impTipSpeedUnits").innerHTML="m/s";
			document.getElementById("eyeTipSpeedUnits").innerHTML="m/s";
			document.getElementById("headUnits").innerHTML="m";
			//document.getElementById("sgUnits").innerHTML="lb/ft<sup>3</sup>";
			document.getElementById("flowUnits").innerHTML="m<sup>3</sup>/hr";
			
			if(metricFlag == 0)
			{	
				if(document.getElementById("eyeDiameter").value)
				{
					document.getElementById("eyeDiameter").value= (document.getElementById("eyeDiameter").value*25.4).toFixed(2);
					document.getElementById("throatbushID").value= (document.getElementById("throatbushID").value*25.4).toFixed(2);
					document.getElementById("throatbushOD").value= (document.getElementById("throatbushOD").value*25.4).toFixed(2);
				}
				if(document.getElementById("impellerOD").value)
				{
					document.getElementById("impellerOD").value= (document.getElementById("impellerOD").value*25.4).toFixed(2);
				}
				if(document.getElementById("avgHead").value)
				{
					document.getElementById("avgHead").value = (document.getElementById("avgHead").value/3.281).toFixed(2);
				}
				if(document.getElementById("avgFlow").value)
				{
					document.getElementById("avgFlow").value = (document.getElementById("avgFlow").value/4.4029).toFixed(2);
				}
				if(document.getElementById("eyeTipSpeed").value)
				{
					document.getElementById("eyeTipSpeed").value = (document.getElementById("eyeTipSpeed").value/3.281).toFixed(2);
				}
				if(document.getElementById("impTipSpeed").value)
				{
					document.getElementById("impTipSpeed").value = (document.getElementById("impTipSpeed").value/3.281).toFixed(2);
				}				
				metricFlag = 1;				
			}
			
        });
	//Validate Fields for Analyse Function
	function validateAnalyse()
	{	
		var invalidCounter = 0;
		var invalidFields = "";

		if(document.getElementById("avgRPM").value.trim() == "" || !isFloat(document.getElementById("avgRPM").value.trim()))
			{invalidFields += "Average RPM"+"\n"; invalidCounter++;}
		if(document.getElementById("avgHead").value.trim() == "" || !isFloat(document.getElementById("avgHead").value.trim()))
			{invalidFields += "Average Head"+"\n"; invalidCounter++;}
		if(document.getElementById("SG").value.trim() == "" || !isFloat(document.getElementById("SG").value.trim()))
			{invalidFields += "S.G."+"\n"; invalidCounter++;}
		if(document.getElementById("avgFlow").value.trim() == "" || !isFloat(document.getElementById("avgFlow").value.trim()))
			{invalidFields += "Average Flow"+"\n"; invalidCounter++;}
		if(document.getElementById("avgD50").value.trim() == "" || !isFloat(document.getElementById("avgD50").value.trim()))
			{invalidFields += "Average D50"+"\n"; invalidCounter++;}
		
		if(invalidCounter>0)
			{
			alert("The following fields are blank or invalid :"+"\n"+invalidFields);
			return false;
			}
	}
	
	function analyse()
		{
			
			validateAnalyse();
			
			//Reference Values
			var refWearLife = 5000;
			var refTB_ID = 105;
			var refTB_OD = 120;
			var refHead = 45;
			var refD50 = 120;
			var refSolidsWeightPercent = 0.5;
			var refEyeTipSpeed = 13;
			var refImpTipSpeed = 30;
			
			
			
			var averageFlow = parseFloat(document.getElementById("avgFlow").value);
			var eyeDiameter = parseFloat(document.getElementById("eyeDiameter").value);
			var specificGravity = parseFloat(document.getElementById("SG").value);
			var averageRPM = parseFloat(document.getElementById("avgRPM").value);
			var averageHead = parseFloat(document.getElementById("avgHead").value);
			var averageD50 = parseFloat(document.getElementById("avgD50").value);
			var eyeDiameter = parseFloat(document.getElementById("eyeDiameter").value);
			var throatbushID = parseFloat(document.getElementById("throatbushID").value);
			var throatbushOD = parseFloat(document.getElementById("throatbushOD").value);
			var impellerOD = parseFloat(document.getElementById("impellerOD").value);
			var exponent1 = parseFloat(document.getElementById('exponent1Value').textContent);
			var exponent2 = parseFloat(document.getElementById('exponent2Value').textContent);
			
			//TO BE CHANGED
			if (buttonImperial.classList.contains('selected')) { // If Imperial
			
			var suctionVelocity = (averageFlow / (4.4029 * 3600))*3.281/(Math.PI*Math.pow(( eyeDiameter*0.0254/2),2)); //ft/s - FLOW in GPM, Eye in inches
			var solidsWeightPercent = -(((1/specificGravity)-1)/((2.65-1)/2.65)); 
			var averageTonnage = ((specificGravity-0.99)/(2.65-0.99))*(averageFlow/4.4029)*2.65; //if flow in gpm		
			var impTipSpeed = (Math.PI * impellerOD * averageRPM) / (60 * 12); // ft/s
			var eyeTipSpeed = (Math.PI * eyeDiameter * averageRPM) / (60 * 12); // ft/s
			//Change ID and OD Wear 
			var idWear = refWearLife * Math.pow((refD50/averageD50),exponent1) * (refSolidsWeightPercent/solidsWeightPercent) * Math.pow((refEyeTipSpeed/eyeTipSpeed),exponent2) * (refHead/averageHead) * (throatbushID/refTB_ID);
			var odWear = refWearLife * Math.pow((refD50/averageD50),exponent1) * (refSolidsWeightPercent/solidsWeightPercent) * Math.pow((refImpTipSpeed/impTipSpeed),exponent2) * (refHead/averageHead) * (throatbushOD/refTB_OD);
			document.getElementById("impTipSpeed").value = impTipSpeed.toFixed(2);
			document.getElementById("eyeTipSpeed").value = eyeTipSpeed.toFixed(2);
			document.getElementById("solidsWeightPercent").value = (solidsWeightPercent*100).toFixed(2);
			document.getElementById("avgTonnage").value = averageTonnage.toFixed(2);
			document.getElementById("idWear").value = idWear.toFixed(2);
			document.getElementById("odWear").value = odWear.toFixed(2);
			}//end of Imperial logic
			
			//METRIC LOGIC
			else{
			var impTipSpeed = (Math.PI*impellerOD*averageRPM/60)/1000; //m/s
			var eyeTipSpeed = (Math.PI*eyeDiameter*averageRPM/60)/1000; //m/s
			var solidsWeightPercent = -(((1/specificGravity)-1)/((2.65-1)/2.65)); 
			var averageTonnage = ((specificGravity-0.99)/(2.65-0.99))*averageFlow*2.65; //tph, flow in m3/hr	-- what is 2.65?
			var idWear = refWearLife * Math.pow((refD50/averageD50),exponent1) * (refSolidsWeightPercent/solidsWeightPercent) * Math.pow((refEyeTipSpeed/eyeTipSpeed),exponent2) * (refHead/averageHead) * (throatbushID/refTB_ID);
			var odWear = refWearLife * Math.pow((refD50/averageD50),exponent1) * (refSolidsWeightPercent/solidsWeightPercent) * Math.pow((refImpTipSpeed/impTipSpeed),exponent2) * (refHead/averageHead) * (throatbushOD/refTB_OD);
			document.getElementById("impTipSpeed").value = impTipSpeed.toFixed(2);
			document.getElementById("eyeTipSpeed").value = eyeTipSpeed.toFixed(2);
			document.getElementById("solidsWeightPercent").value = (solidsWeightPercent*100).toFixed(2);
			document.getElementById("avgTonnage").value = averageTonnage.toFixed(2);
			document.getElementById("idWear").value = idWear.toFixed(2);
			document.getElementById("odWear").value = odWear.toFixed(2);
			
			} // end of metric logic
		}
