/*
 * HillbillyCascade - Create cascading drop downs for SharePoint 2013/2016/O365 classic forms
 * Version 2.0 
 * @requires jQuery v1.7 or greater 
 * @requires unslider 
 *
 * Copyright (c) 2017 Mark Rackley / PAIT Group
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @description Create cascading drop downs for SharePoint 2013/2016/O365 classic forms
 * @type jQuery
 * @name HillbillyCascade
 * @category Plugins/PAITSlider
 * @author Mark Rackley / http://www.markrackley.net / mrackley@paitgroup.com
 *
 * 
 * 	Usage: 
 * 
 *  var cascadeArray = new Array();
 * 
 * 	cascadeArray.push({
 *	    	parentFormField: "County", //Display name on form of field from parent list
 *			childList: "Cities", //List name of child list
 *			childLookupField: "Title", //Internal field name in Child List used in lookup
 *			childFormField: "City", //Display name on form of the child field
 *			parentFieldInChildList: "County", //Internal field name in Child List of the parent field
 *			firstOptionText: "< Select a City >"
 *		});
 *		
 *		
 *		$().HillbillyCascade(cascadeArray);
 * 
 */
 
$.fn.HillbillyCascade= function (optionsArray)
{
    var Cascades = new Array();
    
    var NewForm = getParameterByName("ID") == null;

    $.fn.HillbillyCascade.Cascade = function(parent,cascadeIndex)
    {
        if (cascadeIndex!= null && cascadeIndex+1 > Cascades.length)
        {
            return;
        } else if(cascadeIndex== null) {
        	cascadeIndex= $(parent).attr("HillbillyCascadeIndex");
        }
        
        var params = Cascades[cascadeIndex];
        var parentID = $(parent).val();
        if (parent == null)
        {	
            parentID = $("select[Title='"+params.parentFormField+"'], select[Title='"+
                params.parentFormField+" Required Field']").val();
        }
        if (parentID == undefined)
        {
        	parentID = 0;
        }
        
        var child = $("select[Title='"+params.childFormField+"'], select[Title='"+
		    params.childFormField+" Required Field']," +
		    "select[Title='"+params.childFormField+" possible values']");
        
        var currentVal = params.currentValue;
        Cascades[cascadeIndex].currentValue = 0;
                
        $(child).empty();
    
        var options = "<option value='0'>"+params.firstOptionText+"</option>";

        var call = $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('"+params.childList+
                "')/items?$select=Id,"+params.childLookupField+","+params.parentFieldInChildList+
                "/Id&$expand="+params.parentFieldInChildList+"/Id&$filter="+params.parentFieldInChildList+
                "/Id eq "+ parentID+"&$orderby=" + params.childLookupField,
            type: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            }
       
        });
        call.done(function (data,textStatus, jqXHR){
            for (index in data.d.results)
            {
                options += "<option value='"+ data.d.results[index].Id +"'>"+
                    data.d.results[index][params.childLookupField]+"</option>";
            }
            $(child).append(options);
            if(!NewForm)$(child).val(currentVal);
            $().HillbillyCascade.Cascade(null,Number(cascadeIndex)+1);
        });
        call.fail(function (jqXHR,textStatus,errorThrown){
            alert("Error retrieving information from list: " + params.childList + jqXHR.responseText);
            $(child).append(options);
        });
    }
    
    for (index in optionsArray)
    {
        var thisCascade = optionsArray[index];
		
        if(thisCascade.parentFormField != null)
        {
            var parent = $("select[Title='"+thisCascade.parentFormField+"'], select[Title='"+
                thisCascade.parentFormField+" Required Field']");
            
            $(parent).attr("HillbillyCascadeIndex",index);
            
            $(parent).change(function(){
                $().HillbillyCascade.Cascade(this,null);        
            });            
        } 
        thisCascade.currentValue = $("select[Title='"+thisCascade.childFormField+"'], select[Title='"+
	        thisCascade.childFormField+" Required Field']," +
	        "select[Title='"+thisCascade.childFormField+" possible values']").val();
	        
        Cascades.push(thisCascade);
    }
    
    $().HillbillyCascade.Cascade(null,0);        


	function getParameterByName(key) {
			key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
			var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
			return match && decodeURIComponent(match[1].replace(/\+/g, " "));
		}
}
