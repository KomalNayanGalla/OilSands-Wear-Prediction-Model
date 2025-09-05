	let throatbushData = {};
	let impellerData = {};
	let compatibilityMap = {};
	let dutyConditions = {};
	
	async function loadData() {
	  try {
		const tbRes = await fetch('./json/ThroatbushDimensions.json');
		if (!tbRes.ok) throw new Error('Throatbush data failed to load');
		throatbushData = await tbRes.json();

		const impRes = await fetch('./json/ImpellerDimensions.json');
		if (!impRes.ok) throw new Error('Impeller data failed to load');
		impellerData = await impRes.json();

		const compatRes = await fetch('./json/TB_IMP_Compatibility.json');
		if (!compatRes.ok) throw new Error('Compatibility map failed to load');
		compatibilityMap = await compatRes.json();
		
		const dutyRes = await fetch('./json/dutyConditions.json');
		if (!dutyRes.ok) throw new Error('duty conditions failed to load');
		dutyConditions = await dutyRes.json();

		loadMetric(); // Call after all data is loaded
	  } catch (error) {
		console.error('Data loading error:', error);
	  }
	}
	
	loadData();


	const buttonImperial = document.getElementById('buttonImperial');
    const buttonMetric = document.getElementById('buttonMetric');
	const measures = document.getElementsByClassName("measure");
	
	var metricFlag = 1;	
	var analysisFlag = 0;	
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
	|   avgD50   |   μm   |	
	+------------+--------+
	*/
	
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
		
		if(analysisFlag == 1)
		{
			analyse();
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
			
			analysisFlag = 1;			
			
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
