	const buttonImperial = document.getElementById('buttonImperial');
    const buttonMetric = document.getElementById('buttonMetric');
	const measures = document.getElementsByClassName("measure");
	
	//Toggle Hamburger menu
	function toggleMenu() {
		const menu = document.getElementById("hamburgerMenu");
		menu.classList.toggle("show");
	}	
	
	
	//Loading Metric First
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

	}