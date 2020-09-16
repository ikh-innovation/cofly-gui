jQuery(document).ready(function(){


	// DATE TIME FUNCTIONS AND LOGIC 

	var project_path = localStorage.getItem("LoadProject");
	    
    function load_field_actions(){
        var fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/field_actions.json', 'utf8');
        return contents;
    }

    function add_field_action(date,time,actions,comments,action_type){
		var fs = require('fs');
        var read_data = JSON.parse(load_field_actions());
        console.log(read_data);

        read_data.field_actions.push({
            "date": date,
            "time": time,
            "actions" : actions,
            "comments" : comments,
            "type" : action_type
        });



        var myDate= date;
        myDate=myDate.split("/");
        var newDate=myDate[1]+"-"+myDate[0]+"-"+myDate[2];
        console.log(new Date(newDate).getTime());



          
         function sortResults(prop, asc) {
            read_data.field_actions.sort(function(a, b) {
                if (asc) {
                    return (a[prop].split('/').reverse().join('') > b[prop].split('/').reverse().join('')) ? 1 : ((a[prop].split('/').reverse().join('') < b[prop].split('/').reverse().join('')) ? -1 : 0);
                } else {
                    return (b[prop].split('/').reverse().join('') > a[prop].split('/').reverse().join('')) ? 1 : ((b[prop].split('/').reverse().join('') < a[prop].split('/').reverse().join('')) ? -1 : 0);
                }
            });
        }

        sortResults('date', true);
          
        const path = require('path');
        var running_on = path.resolve(__dirname);
        fs.writeFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/field_actions.json',JSON.stringify(read_data));

        //read_data.push(myObj);
        console.log(read_data);
        //alert('Insertion Complete');
    }
    

	// Trigger DateTimeCalednar in order to show up
	jQuery('div#add_to_calendar_new_action').click(function(){
        jQuery('#add_field_action').text('NEXT');
        jQuery('#add_field_action').attr('can_save',"0");
        jQuery('textarea#add_extra_field_comments').val('');
		jQuery('.ng-scope[ng-app="dateTimeApp"]').fadeIn();
		jQuery(this).fadeOut();

    });
    
    // Add Field after scanning appear
    jQuery('#save_scan_done_details').click(function(){

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;

        // Calculate the actions
        var actions_arr = [];
        jQuery('ul.action_list_done li').each(function(){
        if(jQuery(this).is('[is_enabled="0"]')){
            actions_arr.push(0);
        }else{
            actions_arr.push(1);
        }

        });

        add_field_action(today,'-',JSON.stringify(actions_arr),jQuery('textarea#scan_complete_comments').val(),1);
        jQuery("div#timeline_div").load("scan_timeline.html");
        jQuery('div#scan_completed').fadeOut();
        jQuery('button.navigate-right.enabled.highlight').click();

    });
	



	jQuery('div#add_field_action').click(function(){

		jQuery('.section_two_actions_button').fadeIn();
		jQuery('.section_two_actions_comments').fadeIn();
		jQuery('.datepicker-calendar').fadeOut();
		jQuery('.timepicker.ng-scope').fadeOut();
		if(jQuery(this).attr('can_save') == "1"){
			//alert('Now Save');
            // DATA INITIALIZE
            
            // Calculate the actions
            var actions_arr = [];
            jQuery('ul.add_new_action_calendar li').each(function(){
            if(jQuery(this).is('[is_enabled="0"]')){
                actions_arr.push(0);
            }else{
                actions_arr.push(1);
            }

            });



			add_field_action(jQuery('.datepicker-subheader.ng-binding').attr('date'),jQuery('input.time-input.ng-pristine.ng-untouched.ng-valid.ng-not-empty').val(),JSON.stringify(actions_arr),jQuery('#add_extra_field_comments').val(),2);


            // Reset buttons and views of calendar

			jQuery('.section_two_actions_button').fadeOut();
			jQuery('.section_two_actions_comments').fadeOut();
			jQuery('.datepicker-calendar').fadeIn();
			jQuery('.timepicker.ng-scope').fadeIn();


			// reset button and hide the calendar
			jQuery('.ng-scope[ng-app="dateTimeApp"]').fadeOut();
			jQuery('div#add_to_calendar_new_action').fadeIn();

			// Reload The TimeLine ( In order to show the item we just add )
			jQuery("div#timeline_div").load("scan_timeline.html");
		}

		jQuery(this).attr('can_save',"1");
		jQuery('div[can_save="1"]').text('ADD NEW ACTION');
		
		
		});
        
        
        
		
		jQuery('div#cancel_field_action').click(function(){
		
		
		jQuery('.section_two_actions_button').fadeOut();
		jQuery('.section_two_actions_comments').fadeOut();
		jQuery('.datepicker-calendar').fadeIn();
		jQuery('.timepicker.ng-scope').fadeIn();
		jQuery('div[can_save="1"]').attr('can_save',"0");
		jQuery('div[can_save="1"]').text('NEXT');
		jQuery('.ng-scope[ng-app="dateTimeApp"]').fadeOut();
		jQuery('div#add_to_calendar_new_action').fadeIn();
		
        });
        



        // Timeline Add Action Trigger Button Clicks Scan Completed Form
        jQuery('ul.action_list_done li').click(function(){

            console.log('Actionclicked',jQuery(this).is('[is_enabled="0"]'));
            if(jQuery(this).is('[is_enabled="0"]')){
                jQuery(this).attr('is_enabled','1');
                jQuery('img',this).attr('src',jQuery('img',this).attr('src').replace('.png','_active.png'));
            }else{
                jQuery(this).attr('is_enabled','0');
                jQuery('img',this).attr('src',jQuery('img',this).attr('src').replace('_active.png','.png'));
            }
            
        });


        // Timeline Add Action Trigger Button Clicks Custom Form
        jQuery('ul.add_new_action_calendar li').click(function(){

            console.log('Actionclicked',jQuery(this).is('[is_enabled="0"]'));
            if(jQuery(this).is('[is_enabled="0"]')){
                jQuery(this).attr('is_enabled','1');
                jQuery('img',this).attr('src',jQuery('img',this).attr('src').replace('.png','_active.png'));
            }else{
                jQuery(this).attr('is_enabled','0');
                jQuery('img',this).attr('src',jQuery('img',this).attr('src').replace('_active.png','.png'));
            }
            
        });




});