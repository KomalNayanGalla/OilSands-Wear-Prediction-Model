	let impellerData = {};
	let dutyConditions = {};

	async function loadData() {
	  try {
		const impellerRes = await fetch('./json/ImpellerDimensions.json');
		if (!impellerRes.ok) throw new Error('Impeller data failed to load');
		impellerData = await impellerRes.json();
		
		const dutyRes = await fetch('./json/dutyConditions.json');
		if (!dutyRes.ok) throw new Error('duty conditions failed to load');
		dutyConditions = await dutyRes.json();

		loadMetric(); // Only called once, after both are loaded
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
	var vaneLengths;
	var Impacts;
	var Hours;
	var bestCaseExponent = 2;
	var worstCaseExponent = 3;
	var noOfInputs;
		
	let lineGraph;

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

	//Loading Metric by default 
	function loadMetric()
	{
		buttonMetric.classList.add('selected');
		for (var i = 0; i < measures.length; i++) {
		           measures[i].innerHTML = 'mm';
		}
		
		// Populate Impeller IPN dropdown
		const dropdown = document.getElementById('impIPNDropdown');
        for (const key in impellerData) {
            if (impellerData.hasOwnProperty(key)) {
                const option = document.createElement('option');
                option.value = key;
                option.text = key;
                dropdown.appendChild(option);
            }
        }

	}
		
		
	//Toggle Hamburger menu
	function toggleMenu() {
		const menu = document.getElementById("hamburgerMenu");
		menu.classList.toggle("show");
	}
		
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
			document.getElementById('wearCoefficient').value = data.wearCoefficient;
			document.getElementById('avgRPM').value = data.avgRPM;
			document.getElementById('avgFlow').value = data.avgFlow;
			document.getElementById('SG').value = data.SG;
			document.getElementById('avgHead').value = data.avgHead;
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
			document.getElementById('wearCoefficient').value = data.wearCoefficient || '';
			document.getElementById('avgRPM').value = data.avgRPM || '';
			document.getElementById('avgFlow').value = data.avgFlow ? (data.avgFlow * 4.4029).toFixed(2) : '';
			document.getElementById('SG').value = data.SG || '';
			document.getElementById('avgHead').value = data.avgHead ? (data.avgHead * 3.281).toFixed(2) : '';
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
		
		 
	//Impeller Dropdown - Impeller Dimensions
	document.getElementById('impIPNDropdown').addEventListener('change', function() {
	        const selectedIPN = this.value;
	        const impellerDetails = impellerData[selectedIPN];
	        //alert('You selected: ' + impellerDetails["Eye Diameter"]);
			
			if (buttonImperial.classList.contains('selected')){
			document.getElementById("eyeDiameter").value = (impellerDetails["Eye Diameter"]*0.0394).toFixed(2);
			document.getElementById("nominalVaneLength").value = (impellerDetails["Nominal Vane Length"]*0.0394).toFixed(2);
			document.getElementById("failureVaneLength").value = (impellerDetails["Nominal Vane Length"]*0.4*0.0394).toFixed(2);
			document.getElementById("impellerID").value = (impellerDetails["Impeller ID"]*0.0394).toFixed(2);
			document.getElementById("impellerOD").value = (impellerDetails["Impeller OD"]*0.0394).toFixed(2);
			}
			else
			{
			document.getElementById("eyeDiameter").value = (impellerDetails["Eye Diameter"]).toFixed(2);
			document.getElementById("nominalVaneLength").value = (impellerDetails["Nominal Vane Length"]).toFixed(2);
			document.getElementById("failureVaneLength").value = (impellerDetails["Nominal Vane Length"]*0.4).toFixed(2);
			document.getElementById("impellerID").value = (impellerDetails["Impeller ID"]).toFixed(2);
			document.getElementById("impellerOD").value = (impellerDetails["Impeller OD"]).toFixed(2);
			}
			
			if(analysisFlag == 1)
			{
				analyse();
			}
	    });

		
		//Imperial Button Click
        buttonImperial.addEventListener('click', () => {
            buttonImperial.classList.add('selected');
            buttonMetric.classList.remove('selected');
            // Add functionality for Inches
			
			for (var i = 0; i < measures.length; i++) {
                measures[i].innerHTML = 'in';
            }
			document.getElementById("suctionVelocityUnits").innerHTML="ft/s";
			document.getElementById("headUnits").innerHTML="ft";
			//document.getElementById("sgUnits").innerHTML="lb/ft<sup>3</sup>";
			document.getElementById("flowUnits").innerHTML="gpm";
			
			if(metricFlag == 1)
			{
				if(document.getElementById("eyeDiameter").value)
				{
					
					document.getElementById("eyeDiameter").value= (document.getElementById("eyeDiameter").value/25.4).toFixed(2);
					document.getElementById("nominalVaneLength").value= (document.getElementById("nominalVaneLength").value/25.4).toFixed(2);
					document.getElementById("failureVaneLength").value = (document.getElementById("failureVaneLength").value/25.4).toFixed(2);
					document.getElementById("impellerID").value= (document.getElementById("impellerID").value/25.4).toFixed(2);
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
				if(document.getElementById("suctionVelocity").value)
				{
					document.getElementById("suctionVelocity").value = (document.getElementById("suctionVelocity").value*3.281).toFixed(2);
				}
				if(document.getElementById("startVaneLength").value)
				{
					document.getElementById("startVaneLength").value = (document.getElementById("startVaneLength").value/25.4).toFixed(2);
				}
				metricFlag = 0;
			}
			if(analysisFlag == 1)
			{
				analyse();
			}

        });

		//Metric Button Click 
        buttonMetric.addEventListener('click', () => {
            buttonMetric.classList.add('selected');
            buttonImperial.classList.remove('selected');
			
            for (var i = 0; i < measures.length; i++) {
                measures[i].innerHTML = 'mm';
            }
			document.getElementById("suctionVelocityUnits").innerHTML="m/s";
			document.getElementById("headUnits").innerHTML="m";
			//document.getElementById("sgUnits").innerHTML="kg/m<sup>3</sup>";
			document.getElementById("flowUnits").innerHTML="m<sup>3</sup>/hr";
			
			if(metricFlag == 0)
			{
				if(document.getElementById("eyeDiameter").value)
				{
					
					document.getElementById("eyeDiameter").value= (document.getElementById("eyeDiameter").value*25.4).toFixed(2);
					document.getElementById("nominalVaneLength").value= (document.getElementById("nominalVaneLength").value*25.4).toFixed(2);
					document.getElementById("failureVaneLength").value = (document.getElementById("failureVaneLength").value*25.4).toFixed(2);
					document.getElementById("impellerID").value= (document.getElementById("impellerID").value*25.4).toFixed(2);
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
				if(document.getElementById("suctionVelocity").value)
				{
					document.getElementById("suctionVelocity").value = (document.getElementById("suctionVelocity").value/3.281).toFixed(2);
				}
				if(document.getElementById("startVaneLength").value)
				{
					document.getElementById("startVaneLength").value = (document.getElementById("startVaneLength").value*25.4).toFixed(2);
				}
				metricFlag = 1;
			}
			if(analysisFlag == 1)
			{
				analyse();
			}
			
        });
		
		
		//Toggle Customize Duty Conditions
		document.getElementById('cbx-3').addEventListener('change', function() {
            if (this.checked) {
				//enable fields inputs
                document.getElementById("avgRPM").disabled = false;
				document.getElementById("avgFlow").disabled = false;
				document.getElementById("SG").disabled = false;
				document.getElementById("avgHead").disabled = false;
				
				//placeholders
				document.getElementById("avgRPM").placeholder = 'Input Average RPM';
				document.getElementById("avgFlow").placeholder = 'Input Average Flow';
				document.getElementById("SG").placeholder = 'Input Specific Gravity';
				document.getElementById("avgHead").placeholder = 'Input Average Head';
				
				//border styles
				document.getElementById("avgRPM").style.border = '1px solid yellow';
				document.getElementById("avgFlow").style.border = '1px solid yellow';
				document.getElementById("SG").style.border = '1px solid yellow';
				document.getElementById("avgHead").style.border = '1px solid yellow';
				
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
				
				//placeholders
				document.getElementById("avgRPM").placeholder = 'extracted or custom';
				document.getElementById("avgFlow").placeholder = 'extracted or custom';
				document.getElementById("SG").placeholder = 'extracted or custom';
				document.getElementById("avgHead").placeholder = 'extracted or custom';
				
				//border styles
				document.getElementById("avgRPM").style.border = '1px solid red';
				document.getElementById("avgFlow").style.border = '1px solid red';
				document.getElementById("SG").style.border = '1px solid red';
				document.getElementById("avgHead").style.border = '1px solid red';				
				
				//enabling mine site and Application Dropdowns
				document.getElementById('applicationDropdown').disabled = false;
				document.getElementById('siteDropdown').disabled = false;
            }
        });

		
		//Update Exponent 
        function updateValue(value) {
			//exponent = parseFloat(value).toFixed(2);
            document.getElementById('exponentValue').textContent = parseFloat(value).toFixed(2);
        }

		//Float/Numeric Check
		function isFloat(value) {
		    return !isNaN(value) && parseFloat(value) == value;
		}
		

	//Validate Fields for Analyse Function
	function validateAnalyse()
	{	
		var invalidCounter = 0;
		var invalidFields = "";
		if(document.getElementById("startHours").value.trim() == "" || !isFloat(document.getElementById("startHours").value.trim()))
			{invalidFields += "Start Hours"+"\n"; invalidCounter++;}
		if(document.getElementById("avgRPM").value.trim() == "" || !isFloat(document.getElementById("avgRPM").value.trim()))
			{invalidFields += "Average RPM"+"\n"; invalidCounter++;}
		if(document.getElementById("avgHead").value.trim() == "" || !isFloat(document.getElementById("avgHead").value.trim()))
			{invalidFields += "Average Head"+"\n"; invalidCounter++;}
		if(document.getElementById("SG").value.trim() == "" || !isFloat(document.getElementById("SG").value.trim()))
			{invalidFields += "S.G."+"\n"; invalidCounter++;}
		if(document.getElementById("avgFlow").value.trim() == "" || !isFloat(document.getElementById("avgFlow").value.trim()))
			{invalidFields += "Average Flow"+"\n"; invalidCounter++;}
		if(document.getElementById("startVaneLength").value.trim() == "" || !isFloat(document.getElementById("startVaneLength").value.trim()))
			{invalidFields += "Start Vane Length"+"\n"; invalidCounter++;}
		if(document.getElementById("failureVaneLength").value.trim() == "" || !isFloat(document.getElementById("failureVaneLength").value.trim()))
			{invalidFields += "Vane Length at Failure"+"\n"; invalidCounter++;}
		if(document.getElementById("wearCoefficient").value.trim() == "" || !isFloat(document.getElementById("wearCoefficient").value.trim()))
			{invalidFields += "Wear Coefficient"+"\n"; invalidCounter++;}
		if(invalidCounter>0)
			{
			alert("The following fields are blank or invalid :"+"\n"+invalidFields);
			return false;
			}
	}
		
		
	//Goalseek Validate 
	function validateGoalSeek()
	{	
		var invalidCounter = 0;
		var goalSeekInvalidCounter = 0;
		var invalidFields = "";
		
		const goalseekHoursFields = document.querySelectorAll('.goalseekHourInputs');
		const goalseekVaneLengthFields = document.querySelectorAll('.goalseekVaneLengthInputs');
		
		if(document.getElementById("startHours").value.trim() == "" || !isFloat(document.getElementById("startHours").value.trim()))
			{invalidFields += "Start Hours"+"\n"; invalidCounter++;}
		if(document.getElementById("avgRPM").value.trim() == "" || !isFloat(document.getElementById("avgRPM").value.trim()))
			{invalidFields += "Average RPM"+"\n"; invalidCounter++;}
		if(document.getElementById("avgHead").value.trim() == "" || !isFloat(document.getElementById("avgHead").value.trim()))
			{invalidFields += "Average Head"+"\n"; invalidCounter++;}
		if(document.getElementById("SG").value.trim() == "" || !isFloat(document.getElementById("SG").value.trim()))
			{invalidFields += "S.G."+"\n"; invalidCounter++;}
		if(document.getElementById("avgFlow").value.trim() == "" || !isFloat(document.getElementById("avgFlow").value.trim()))
			{invalidFields += "Average Flow"+"\n"; invalidCounter++;}
		if(document.getElementById("startVaneLength").value.trim() == "" || !isFloat(document.getElementById("startVaneLength").value.trim()))
			{invalidFields += "Start Vane Length"+"\n"; invalidCounter++;}
		if(document.getElementById("failureVaneLength").value.trim() == "" || !isFloat(document.getElementById("failureVaneLength").value.trim()))
			{invalidFields += "Vane Length at Failure"+"\n"; invalidCounter++;}
			
		goalseekHoursFields.forEach(hour => {
			if(hour.value.trim()=="" || !isFloat(hour.value))
			{
				goalSeekInvalidCounter++;
			}
		});
		
		goalseekVaneLengthFields.forEach(vl => {
			if(vl.value.trim()=="" || !isFloat(vl.value))
			{
				goalSeekInvalidCounter++;
			}
		});
		
		//All fields valid
		if(invalidCounter==0 && goalSeekInvalidCounter==0)
		{
			return true;
		}
		
		if(goalSeekInvalidCounter>0)
		{
			invalidFields += "One or more VL or Hours for Coeffient Calculation\n";
		}
		
		if(invalidCounter>0 || goalSeekInvalidCounter>0)
		{
			alert("The following fields are blank or invalid :"+"\n"+invalidFields);
			return false;
		}

		
	}
	
	
	//Display Goal Seek Input Fields
	function goalseekDisplay()
	{
		noOfInputs = window.prompt('Enter the number of Hour-Vane Length sets for Coefficient Calculation');
		if(!isFloat(noOfInputs) || noOfInputs == 0)
		{
			window.alert('Not a valid number, Press Seek Coefficient again');
		}
		else
		{
		var goalseekInputs = "";
		for (var i = 0; i < noOfInputs; i++){
			var tr = "<tr>";
			tr += "<td>Hours-"+(i+1)+": <input type='text' class='goalseekHourInputs' placeholder='Enter Hours-"+(i+1)+"' required> </td>";
			tr += "<td>VL-"+(i+1)+": <input type='text' class='goalseekVaneLengthInputs' placeholder='Enter Vane Length-"+(i+1)+"' required> </td>";
			tr += "</tr>";
			goalseekInputs += tr;
			}
			goalseekInputs += "<tr><td colspan='2'><center><br><button class='analyse' onclick='calculateCoefficient()'>Calculate Coefficient</button></center></td></tr>"; 
			document.getElementById('goalseekTable').innerHTML = goalseekInputs;
			document.getElementById('goalseekTitle').innerHTML = "Goalseek Inputs";
		}
	}
	
	//Average Wear Coefficient
	function average(wcArray)
	{
		var avg = 0;
		for(var i=0;i<wcArray.length;i++)
		{
			avg += wcArray[i];
		}
		return avg/wcArray.length;
	}
	
	
	//invoke validation and goalSeek 
	function calculateCoefficient()
	{
		
		var suctionVelocity;
		var solidsWeightPercent;
		var averageTonnage;
		
		//Reference Variables
		var refTonnage = 5000;
		var refImpact = 15.4; 
		
		const goalSeekImpacts=[];
		const goalSeekWCs=[];
		const goalSeekHours = [];
		const goalSeekVLs = [];
		
		if(validateGoalSeek())
		{
			var startHours = parseFloat(document.getElementById("startHours").value);
			var averageFlow = parseFloat(document.getElementById("avgFlow").value);
			var eyeDiameter = parseFloat(document.getElementById("eyeDiameter").value);
			var specificGravity = parseFloat(document.getElementById("SG").value);
			var averageRPM = parseFloat(document.getElementById("avgRPM").value);
			var startVL = parseFloat(document.getElementById("startVaneLength").value);
			var failVL = parseFloat(document.getElementById("failureVaneLength").value);
			var nominalVaneLength = parseFloat(document.getElementById("nominalVaneLength").value);
			var impellerID = parseFloat(document.getElementById("impellerID").value);
			var impellerOD = parseFloat(document.getElementById("impellerOD").value);
			var exponent = parseFloat(document.getElementById('exponentValue').textContent);
			const goalseekHoursFields = document.querySelectorAll('.goalseekHourInputs');
			const goalseekVaneLengthFields = document.querySelectorAll('.goalseekVaneLengthInputs');
			
			//To Arrays
			goalseekHoursFields.forEach(hour => {
				if(!hour.value.trim()=="" && isFloat(hour.value))
				{
					goalSeekHours.push(hour.value);
				}
			});
			
			goalseekVaneLengthFields.forEach(vl => {
				if(!vl.value.trim()=="" && isFloat(vl.value))
				{
					goalSeekVLs.push(vl.value);
				}
			});
			
			//adding start hours and nominal vanelength to the beginning of the array
			goalSeekHours.unshift(startHours);
			goalSeekVLs.unshift(nominalVaneLength);
			
			//window.alert('Hours : '+goalSeekHours+'\nVLs : '+goalSeekVLs);
				
			if (buttonImperial.classList.contains('selected')) { // If Imperial
				suctionVelocity = (averageFlow / (4.4029 * 3600))*3.281/(Math.PI*Math.pow(( eyeDiameter*0.0254/2),2)); //ft/s - FLOW in GPM, Eye in inches
				solidsWeightPercent = -(((1/specificGravity)-1)/((2.65-1)/2.65)); 
				averageTonnage = ((specificGravity-0.99)/(2.65-0.99))*(averageFlow/4.4029)*2.65; //if flow in gpm		
				for(var i=0;i<goalSeekVLs.length;i++)
				{	
					goalSeekImpacts.push((Math.sqrt(Math.pow(suctionVelocity/3.281, 2) + Math.pow(Math.PI * (averageRPM / 60)*0.0254* (impellerID + ((nominalVaneLength - goalSeekVLs[i]) / nominalVaneLength) * (impellerOD - impellerID)), 2))).toFixed(6)); //suctionVelocity in ft/s and dim in inches
				}
				for(var i=1;i<goalSeekVLs.length;i++)
				{
					goalSeekWCs.push((goalSeekHours[i] - goalSeekHours[i-1])/( (goalSeekVLs[i-1] - goalSeekVLs[i]) * (5000 / averageTonnage) * Math.pow(15.4 / goalSeekImpacts[i-1], exponent)));
				}				
			}
			else // IF METRIC
			{
				suctionVelocity = (averageFlow/3600)/(Math.PI*Math.pow(( eyeDiameter*0.0254*0.0394/2),2)); //m/s
				solidsWeightPercent = -(((1/specificGravity)-1)/((2.65-1)/2.65)); 
				averageTonnage = ((specificGravity-0.99)/(2.65-0.99))*averageFlow*2.65; //tph, flow in m3/hr
				for(var i=0;i<goalSeekVLs.length;i++)
				{	
					goalSeekImpacts.push((Math.sqrt(Math.pow(suctionVelocity, 2) + Math.pow(Math.PI * (averageRPM / 60) *0.0254*0.0394 *(impellerID + ((nominalVaneLength - goalSeekVLs[i]) / nominalVaneLength) * (impellerOD - impellerID)), 2))).toFixed(6)); //suctionVelocity in m/s and dim in mm
				}
				//window.alert('GoalSeek Impacts : '+goalSeekImpacts);
				for(var i=1;i<goalSeekVLs.length;i++)
				{
					goalSeekWCs.push((goalSeekHours[i] - goalSeekHours[i-1])/(0.0394 * (goalSeekVLs[i-1] - goalSeekVLs[i]) * (5000 / averageTonnage) * Math.pow(15.4 / goalSeekImpacts[i-1], exponent)));
				}
				window.alert('GoalSeek WCs : '+goalSeekWCs);
			}
			
			//WC Average Calculation
			var averageWearCoefficient = average(goalSeekWCs);
			
			window.alert('Best Wear Coefficient : '+Math.round(averageWearCoefficient)+'\nNow in Wear Coefficient');
			document.getElementById('wearCoefficient').value = Math.round(averageWearCoefficient);
		}
	}

	
	//Calculate VLs,Impacts, Hours and display graph
	function analyse() 
	{
		validateAnalyse();
		vaneLengths = [];
		var bestCaseHours = [];
		var worstCaseHours = [];
		Hours = [];
		Impacts = [];
		
		const isMobile = window.innerWidth < 768;
		const fontSize = isMobile ? 12 : 20;
		
		analysisFlag = 1;

		// Reference values
		var refTonnage = 5000;
		var refImpact = 15.4;

		var startHours = parseFloat(document.getElementById("startHours").value);
		var averageFlow = parseFloat(document.getElementById("avgFlow").value);
		var eyeDiameter = parseFloat(document.getElementById("eyeDiameter").value);
		var specificGravity = parseFloat(document.getElementById("SG").value);
		var averageRPM = parseFloat(document.getElementById("avgRPM").value);
		var startVL = parseFloat(document.getElementById("startVaneLength").value);
		var failVL = parseFloat(document.getElementById("failureVaneLength").value);
		var nominalVaneLength = parseFloat(document.getElementById("nominalVaneLength").value);
		var impellerID = parseFloat(document.getElementById("impellerID").value);
		var impellerOD = parseFloat(document.getElementById("impellerOD").value);
		var exponent = parseFloat(document.getElementById('exponentValue').textContent);
		var wearCoefficient = parseFloat(document.getElementById("wearCoefficient").value);

		if (buttonImperial.classList.contains('selected')) {
			var suctionVelocity = (averageFlow / (4.4029 * 3600)) * 3.281 / (Math.PI * Math.pow((eyeDiameter * 0.0254 / 2), 2));
			var solidsWeightPercent = -(((1 / specificGravity) - 1) / ((2.65 - 1) / 2.65));
			var averageTonnage = ((specificGravity - 0.99) / (2.65 - 0.99)) * (averageFlow / 4.4029) * 2.65;

			document.getElementById("suctionVelocity").value = suctionVelocity.toFixed(9);
			document.getElementById("solidsWeightPercent").value = solidsWeightPercent.toFixed(9);
			document.getElementById("avgTonnage").value = averageTonnage.toFixed(9);

			for (var vl = startVL; vl >= failVL; vl -= ((startVL - failVL) / 25)) {
				vaneLengths.push(vl.toFixed(2));
			}

			for (var i = 0; i < vaneLengths.length; i++) {
				Impacts.push((Math.sqrt(Math.pow(suctionVelocity / 3.281, 2) + Math.pow(Math.PI * (averageRPM / 60) * 0.0254 * (impellerID + ((nominalVaneLength - vaneLengths[i]) / nominalVaneLength) * (impellerOD - impellerID)), 2))).toFixed(6));
			}

			refImpact = parseFloat(((parseFloat(Impacts[0]) + parseFloat(Impacts[1]) + parseFloat(Impacts[2]) + parseFloat(Impacts[3]) + parseFloat(Impacts[4]) + parseFloat(Impacts[5])) / 6).toFixed(2));

			for (var i = 0; i < vaneLengths.length; i++) {
				if (i == 0) {
					Hours.push(startHours);
					bestCaseHours.push(startHours);
					worstCaseHours.push(startHours);
				} else {
					Hours.push(parseFloat((Hours[i - 1] + (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (refTonnage / averageTonnage) * Math.pow(refImpact / Impacts[i - 1], exponent)).toFixed(4)));
					bestCaseHours.push(parseFloat((bestCaseHours[i - 1] + (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (refTonnage / averageTonnage) * Math.pow(refImpact / Impacts[i - 1], 2)).toFixed(4)));
					worstCaseHours.push(parseFloat((worstCaseHours[i - 1] + (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (refTonnage / averageTonnage) * Math.pow(refImpact / Impacts[i - 1], 3)).toFixed(4)));
				}
			}
		} else {
			var suctionVelocity = (averageFlow / 3600) / (Math.PI * Math.pow((eyeDiameter * 0.0254 * 0.0394 / 2), 2));
			var solidsWeightPercent = -(((1 / specificGravity) - 1) / ((2.65 - 1) / 2.65));
			var averageTonnage = ((specificGravity - 0.99) / (2.65 - 0.99)) * averageFlow * 2.65;

			document.getElementById("suctionVelocity").value = suctionVelocity.toFixed(9);
			document.getElementById("solidsWeightPercent").value = solidsWeightPercent.toFixed(9);
			document.getElementById("avgTonnage").value = averageTonnage.toFixed(9);

			for (var vl = startVL; vl >= failVL; vl -= ((startVL - failVL) / 25)) {
				vaneLengths.push(vl.toFixed(2));
			}

			for (var i = 0; i < vaneLengths.length; i++) {
				Impacts.push((Math.sqrt(Math.pow(suctionVelocity, 2) + Math.pow(Math.PI * (averageRPM / 60) * 0.0254 * 0.0394 * (impellerID + ((nominalVaneLength - vaneLengths[i]) / nominalVaneLength) * (impellerOD - impellerID)), 2))).toFixed(6));
			}

			refImpact = parseFloat(((parseFloat(Impacts[0]) + parseFloat(Impacts[1]) + parseFloat(Impacts[2]) + parseFloat(Impacts[3]) + parseFloat(Impacts[4]) + parseFloat(Impacts[5])) / 6).toFixed(2));

			for (var i = 0; i < vaneLengths.length; i++) {
				if (i == 0) {
					Hours.push(startHours);
					bestCaseHours.push(startHours);
					worstCaseHours.push(startHours);
				} else {
					Hours.push(parseFloat((Hours[i - 1] + 0.0394 * (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (refTonnage / averageTonnage) * Math.pow(refImpact / Impacts[i - 1], exponent)).toFixed(4)));
					bestCaseHours.push(parseFloat((bestCaseHours[i - 1] + 0.0394 * (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (refTonnage / averageTonnage) * Math.pow(refImpact / Impacts[i - 1], 2)).toFixed(4)));
					worstCaseHours.push(parseFloat((worstCaseHours[i - 1] + 0.0394 * (vaneLengths[i - 1] - vaneLengths[i]) * wearCoefficient * (refTonnage / averageTonnage) * Math.pow(refImpact / Impacts[i - 1], 3)).toFixed(4)));
				}
			}
		}

		document.getElementById("totalLifeSpan").value = Hours[20];

		var t = "";
		for (var i = 0; i < vaneLengths.length; i++) {
			t += `<tr>
				<td style='text-align:center;'>${Impacts[i]}</td>
				<td style='text-align:center;'>${vaneLengths[i]}</td>
				<td style='text-align:center;'>${Hours[i]}</td>
			</tr>`;
		}
		document.getElementById("tableBody").innerHTML = t;

		//Graph Section
		const numericHours = bestCaseHours.map(Number);
		const numericVaneLengths = vaneLengths.map(Number);

		const xMin = 0;
		const xMax = Math.ceil(Math.max(...numericHours) / 1000) * 1000;
		const xStepSize = Math.ceil((xMax - xMin) / 10);

		const yMin = 0;
		const yMax = Math.ceil(Math.max(...numericVaneLengths) / 50) * 50;
		const yStepSize = Math.ceil((yMax - yMin) / 10);

		const ctx = document.getElementById('lineGraph').getContext('2d');
		if (lineGraph) {
			lineGraph.data.datasets[0].data = Hours.map((hour, index) => ({ x: hour, y: vaneLengths[index] }));
			lineGraph.data.datasets[1].data = bestCaseHours.map((hour, index) => ({ x: hour, y: vaneLengths[index] }));
			lineGraph.data.datasets[2].data = worstCaseHours.map((hour, index) => ({ x: hour, y: vaneLengths[index] }));

			lineGraph.options.scales.x.min = xMin;
			lineGraph.options.scales.x.max = xMax;
			lineGraph.options.scales.x.ticks.stepSize = xStepSize;

			lineGraph.options.scales.y.min = yMin;
			lineGraph.options.scales.y.max = yMax;
			lineGraph.options.scales.y.ticks.stepSize = yStepSize;

			lineGraph.update();
		} else {
			lineGraph = new Chart(ctx, {
				type: 'line',
				data: {
					datasets: [
						{
							label: 'Hours',
							data: Hours.map((hour, index) => ({ x: hour, y: vaneLengths[index] })),
							borderColor: 'white',
							borderWidth: 2,
							lineTension: 0.4,
							pointStyle: 'triangle'
						},
						{
							label: 'Best Case Hours',
							data: bestCaseHours.map((hour, index) => ({ x: hour, y: vaneLengths[index] })),
							borderColor: 'lime',
							borderWidth: 1,
							lineTension: 0.4
						},
						{
							label: 'Worst Case Hours',
							data: worstCaseHours.map((hour, index) => ({ x: hour, y: vaneLengths[index] })),
							borderColor: '#f7f749',
							borderWidth: 1,
							lineTension: 0.4
						}
					]
				},
				options: {
				    responsive:true,
					maintainAspectRatio:false,
					layout:{
							padding:{
								left:0,
								right:0
							}
					},
					scales: {
						x: {
							type: 'linear',
							title: {
								display: true,
								text: 'Hours',
								color: '#F2D2BD',
								font: { size: fontSize }
							},
							min: xMin,
							max: xMax,
							ticks: {
								stepSize: xStepSize,
								color: 'white',
								align: 'center',
								padding: 0,
								font: { size: fontSize - 2 }
							},
							grid: {
								display: true,
								color: '#A9A9A9'
							}
						},
						y: {
							title: {
								display: true,
								text: 'Vane Length',
								color: 'white',
								font: { size: fontSize }
							},
							min: yMin,
							max: yMax,
							ticks: {
								stepSize: yStepSize,
								color: 'white',
								font: { size: fontSize - 2 }
							},
							grid: {
								display: true,
								color: '#A9A9A9'
							}
						}
					},
					plugins: {
						legend: {
							labels: {
								color: 'white',
								font: { size: fontSize - 2}
							}
						},
						tooltip: {
						  callbacks: {
							label: function(context) {
							  const label = context.dataset.label || '';
							  const x = context.parsed.x;
							  const y = context.parsed.y;
							  return `At ${x.toFixed(0)} ${label}: ${y.toFixed(2)}`;
							}
						  }
						}

					}
				}
			});
		}
	}
