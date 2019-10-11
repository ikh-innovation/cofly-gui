async function asyncCall() {



    // Datetime functions

    Date.prototype.addSeconds = function(seconds) {
        this.setSeconds(this.getSeconds() + seconds);
        return this;
    };

    Date.prototype.addMinutes = function(minutes) {
        this.setMinutes(this.getMinutes() + minutes);
        return this;
    };

    Date.prototype.addHours = function(hours) {
        this.setHours(this.getHours() + hours);
        return this;
    };

    Date.prototype.addDays = function(days) {
        this.setDate(this.getDate() + days);
        return this;
    };

    Date.prototype.addWeeks = function(weeks) {
        this.addDays(weeks * 7);
        return this;
    };

    Date.prototype.addMonths = function(months) {
        var dt = this.getDate();

        this.setMonth(this.getMonth() + months);
        var currDt = this.getDate();

        if (dt !== currDt) {
            this.addDays(-currDt);
        }

        return this;
    };

    Date.prototype.addYears = function(years) {
        var dt = this.getDate();

        this.setFullYear(this.getFullYear() + years);

        var currDt = this.getDate();

        if (dt !== currDt) {
            this.addDays(-currDt);
        }

        return this;
    };

    // Start Calculations


    jQuery('.view-id-user_list.view-display-id-page tbody tr').each(function() {

        var value = jQuery('td:nth-child(6) em', this).text();

        var splited = value.split(" ", 4);

        if (jQuery('td:nth-child(6) em', this).length == 0) {
            console.log('Den orizetai');
			jQuery('td:nth-child(6)', this).attr('changed','99999999');
        } else {

            // prwto kommati -parseInt(splited[0])
            // deutero kommati -parseInt(splited[2])

            if (splited[1].indexOf("week") != -1) {
                
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(-parseInt(splited[0])).addDays(0).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("month") != -1) {
                var new_date = new Date().addYears(0).addMonths(-parseInt(splited[0])).addWeeks(0).addDays(0).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("year") != -1) {
                var new_date = new Date().addYears(-parseInt(splited[0])).addMonths(0).addWeeks(0).addDays(0).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("min") != -1) {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(0).addHours(0).addMinutes(-parseInt(splited[0])).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("hour") != -1) {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(0).addHours(-parseInt(splited[0])).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("day") != -1) {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(-parseInt(splited[0])).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            } else {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(0).addHours(0).addMinutes(0).addSeconds(-parseInt(splited[0]));
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(6)', this).attr('changed', Date.parse(new_date));
            }

            // console log the results
            //jQuery('td:nth-child(6) em', this).text(Date.parse(new_date));
            //console.log(Date.parse(new_date));
            //console.log(new_date);
        }




    });





    jQuery('.view-id-user_list.view-display-id-page tbody tr').each(function() {

        var value = jQuery('td:nth-child(5) em', this).text();

        var splited = value.split(" ", 4);

        if (jQuery('td:nth-child(5) em', this).length == 0) {
            console.log('Den orizetai');
			jQuery('td:nth-child(5)', this).attr('changed','99999999');
        } else {

            // prwto kommati -parseInt(splited[0])
            // deutero kommati -parseInt(splited[2])

            if (splited[1].indexOf("week") != -1) {
                
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(-parseInt(splited[0])).addDays(0).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("month") != -1) {
                var new_date = new Date().addYears(0).addMonths(-parseInt(splited[0])).addWeeks(0).addDays(0).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("year") != -1) {
                var new_date = new Date().addYears(-parseInt(splited[0])).addMonths(0).addWeeks(0).addDays(0).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("min") != -1) {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(0).addHours(0).addMinutes(-parseInt(splited[0])).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("hour") != -1) {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(0).addHours(-parseInt(splited[0])).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            } else if (splited[1].indexOf("day") != -1) {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(-parseInt(splited[0])).addHours(0).addMinutes(0).addSeconds(0);
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            } else {
                var new_date = new Date().addYears(0).addMonths(0).addWeeks(0).addDays(0).addHours(0).addMinutes(0).addSeconds(-parseInt(splited[0]));
                new_date = add_extra(new_date,splited[3],splited[2]);
                jQuery('td:nth-child(5)', this).attr('changed', Date.parse(new_date));
            }

        }




    });

    function add_extra(fixed_date,seccond_half,extra_time){

    if(seccond_half.indexOf("month") != -1){
        fixed_date.addMonths(-parseInt(extra_time));
    }else if(seccond_half.indexOf("week") != -1){
        fixed_date.addWeeks(-parseInt(extra_time));
    }else if(seccond_half.indexOf("day") != -1){
        fixed_date.addDays(-parseInt(extra_time));
    }else if(seccond_half.indexOf("hour") != -1){
        fixed_date.addHours(-parseInt(extra_time));
    }else if(seccond_half.indexOf("min") != -1){
        fixed_date.addMinutes(-parseInt(extra_time));
    }else{
        fixed_date.addSeconds(-parseInt(extra_time));
    }
    console.log(fixed_date);
    return fixed_date;
    //console.log(fixed_date,seccond_half);        

    }



}

asyncCall();