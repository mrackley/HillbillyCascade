<script src="//code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="../../SiteAssets/HillbillyCascade.js"></script>

<script type="text/javascript">
	$(document).ready(function() {
	
		var cascadeArray = new Array();
		
		cascadeArray.push({
			parentFormField: "State", //Display name on form of field from parent list
			childList: "Counties", //List name of child list
			childLookupField: "Title", //Internal field name in Child List used in lookup
			childFormField: "County", //Display name on form of the child field
			parentFieldInChildList: "State", //Internal field name in Child List of the parent field
			firstOptionText: "< Select a County >"
		});

		cascadeArray.push({
			parentFormField: "County", //Display name on form of field from parent list
			childList: "Cities", //List name of child list
			childLookupField: "Title", //Internal field name in Child List used in lookup
			childFormField: "City", //Display name on form of the child field
			parentFieldInChildList: "County", //Internal field name in Child List of the parent field
			firstOptionText: "< Select a City >"
		});
		
		
		$().HillbillyCascade(cascadeArray);
			
	});
	
	
</script>
