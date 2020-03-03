jQuery(document).ready(function() {
    //var pathsad = require("path");
    //console.log(pathsad.resolve(__dirname, './projects/').replace(/\\/g,"/")+ "/" +localStorage.getItem("LoadProject") + "/project_images/");


    print_project_gallery();
    var show_slide = true;
    var can_save_image = false;
    /* BETA TESTING FOR DIRECTORY FILES */
    function print_project_gallery() {
        jQuery('ul.project_gallery_render li').remove();
        //var get_path_images = './projects/' + localStorage.getItem("LoadProject").replace(" ", "") + '/project_images/';
        //const testFolder = __dirname + '/projects/' + localStorage.getItem("LoadProject").replace(" ", "") + '/project_images/';
        var pathsad = require("path");
        var final_correct_path = pathsad.resolve(__dirname, './projects/').replace(/\\/g, "/") + "/" + localStorage.getItem("LoadProject") + "/project_images/";
        var fix_location = final_correct_path.split("/resources/app");
        const fs = require('fs');

        if (fix_location[1] == null) {
            var final_link = fix_location[0];
        } else {
            var final_link = fix_location[0] + fix_location[1];
        }

        fs.readdirSync(final_link.replace(" ", "")).forEach(file => {

            if (file.indexOf(".jpg") != -1 || file.indexOf(".png") != -1 || file.indexOf(".jpeg") != -1) {
                //console.log(file);
                jQuery('ul.project_gallery_render').append('<li class="nav-item"><div class="gallery_image_Settings_hover"><i class="far fa-eye"></i></div><img src="' + final_link.replace(" ", "") + file + '"></li>');
            }

        });

    }





    // RUN EXCECUTABLE HERE
    var child = require('child_process').execFile;
    var executablePath = "C:/Python36/dist/app.exe";
    //var parameters = ["--incognito"];

    child(executablePath, function(err, data) {
        console.log(err)
        console.log(data.toString());
    });




    // check if load proejext exists
    var project_path = localStorage.getItem("LoadProject");
    load_project_calulated_path();

    var get_center = localStorage.getItem("LoadedProjectCenter");
    var clean_center = get_center.split(",");


    // Initialize map
    var map = L.mapbox.map('map').setView([parseFloat(clean_center[1]), parseFloat(clean_center[0])], 17);


    // Disable Zoom Map 
    
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();

    



    //var map = L.mapbox.map('map').setView([23.736116731514866, 37.97002501526711], 17);




    // Add layers to the map
    L.control.layers({
        'Satellite Map': L.mapbox.tileLayer('bobbysud.map-l4i2m7nd', {
            detectRetina: true
        }).addTo(map),
        'Terrain Map': L.mapbox.tileLayer('bobbysud.i2pfp2lb', {
            detectRetina: true
        })
    }).addTo(map);

    var featureGroup = L.featureGroup().addTo(map);

    

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: featureGroup
        }
    }).addTo(map);

    // Ftiaxnw ton marker mou pou ousiastika einai to pou briskete to drone mou
    var drone_icon = L.icon({
        iconUrl: 'img/our_marker.png',
        /*shadowUrl: 'img/leaf-shadow.png',*/

        iconSize: [50, 73], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        iconAnchor: [25, 70], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -76] // point from which the popup should open relative to the iconAnchor
    });


    // Ftiaxnw ton marker gia tis eikones pou erxontai
    var image_icon = L.icon({
        iconUrl: 'img/1pixel_transparent.png',
        /*shadowUrl: 'img/leaf-shadow.png',*/

        iconSize: [50, 73], // size of the icon
        /*
        shadowSize: [50, 64], // size of the shadow
        //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        iconAnchor: [25, 70], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        */
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor

    });
    
    /* Apofugei empodiwn draw new polygons */
    
    // test oti fortwnw sto featurefroup layers 
    //featureGroup.addLayer(disabled_paths());
    //console.log(disabled_paths());
    map.on('draw:created', function(e) {
        //alert('Create new');
        
        // Each time a feaute is created, it's added to the over arching feature group
        featureGroup.addLayer(e.layer);
        all_new_disabled_paths = featureGroup.toGeoJSON();
        var old_disabled = disabled_paths_read();
        temp_json = JSON.stringify(all_new_disabled_paths["features"]).slice(0,-1);
        if(old_disabled == "" || old_disabled == " "){
            alert('einai adeio');
            fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson','{"type":"FeatureCollection","features":['+temp_json.slice(1) + ']}');
        }else{
            var old_disabled = disabled_paths_read().slice(0,-2);
            console.log(old_disabled + ','+ temp_json.slice(1) + ']}');
            fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', old_disabled + ','+ temp_json.slice(1) + ']}');
        }
        


        //console.log(JSON.stringify(featureGroup.toGeoJSON()));
    
    
    });



    const path = require('path');


    var image_count = 0;

    

/*     function post_image_with_marker(file_link) {

        image_count++;
        jQuery('#photo_picker_receiver_start').slideDown();
        // Diabazw to onoma ths eikones pou molis irthe apo to drone kai me splits katalabainw to lat lon
        var read_file_link = file_link.split("Lat=", 3);
        var lat = read_file_link[1].split(",Lon=", 3);
        var lon = lat[1].split(",Alt=", 3);
        // Ean einai h prwth photo kalo to wizard.
        //if (jQuery('ul.navbar-nav.mb-md-3.collapsed.project_gallery_render li').length == 0) {
        //    image_settings_wizard(lat[0], lon[0]);
       // } else {

        
            L.popup({
                    closeButton: false,
                    closeOnClick: false,
                    keepInView: true
                })
                .setLatLng([lat[0], lon[0]])
                .setContent('<img give_id="marker_' + image_count + '" width="150px" src="./projects/' + localStorage.getItem('LoadProject').replace(" ", "") + '/project_images/' + file_link + '">')
                .addTo(map);


            //give each mark an id
            jQuery('.leaflet-marker-pane img').last().attr('id', 'marker_' + image_count);
            //create image puzzle div
            jQuery('#image_container').append('<div marker_id="marker_' + image_count + '" class="image_toggle_button"><i class="far fa-image"></i> <p>Image #' + image_count + '</p></div>');



            //console.log(file_link);
            //console.log(lat[0], lon[0]);
       // }

    } */


    // Trigger zoom event on map ( Change all markers size )
    var prevZoom = map.getZoom();
    console.log('GET ZOOM: ' + prevZoom);

    map.on('zoomend', function(e) {
        //debugger;
        var currZoom = map.getZoom();
        var diff = prevZoom - currZoom;
        if (diff > 0) {
            console.log('zoomed out', currZoom);

            var newzoom = '' + ((250) * currZoom) + 'px';
            console.log(newzoom);
            $('.leaflet-popup-content img').css({
                'width': newzoom,
                'height': 'auto'
            });

        } else if (diff < 0) {
            console.log('zoomed in' + currZoom);
            var newzoom = '' + ((250) / currZoom) + 'px';
            console.log(newzoom);
            $('.leaflet-popup-content img').css({
                'width': newzoom,
                'height': 'auto'
            });
        } else {
            alert('no change');
        }

        prevZoom = currZoom;
    });


    /* LISTEN NEW SERVICE  UPLOAD FILE TO PROJECT FILE */
    const express = require('express');
    const multer = require('multer');
    const upload = multer();
    var bodyParser = require("body-parser");
    const fs = require('fs');

    var app = express();
    app.use(express.static(__dirname));
/*
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    */
    app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
    app.use(bodyParser.json());


    app.post('/post_location', function(req, res) {
      

        
//console.log(res.req.body);
        var location = req.body;

        var drone_longtitude = res.req.body.lng;
        var drone_latitude = res.req.body.lat;

        //delete previous mark if exist
        jQuery('.leaflet-marker-pane img').remove();

        // draw new marker [Current] drone location
        var marker = L.marker(
            [drone_latitude,drone_longtitude], {
                title: 'Drone Current Position',
                icon: drone_icon
            }
        ).addTo(map);

        map.panTo(new L.LatLng(drone_latitude, drone_longtitude));

            


        res.status(200).send('Drone Location Received');
    });



    app.post('/scan_completed', function(req, res) {

        var path = req.body;
        //alert('Job Done');
        console.log(path);
        can_save_image = false;
        show_slide = true;
        res.status(200).send('ok');

        jQuery('#scan_completed').fadeIn();
        jQuery('div#start_scanning').fadeIn();
        jQuery('div#cancel_scanning').fadeOut();

        var get_center = localStorage.getItem('LoadedProjectCenter').split(",");
        // create link depending the center of project and call the weather api 
        // http://api.openweathermap.org/data/2.5/weather?lat=37.969059771389645&lon=23.746398389339447&APPID=f6f1b45b882965c039fae9390a8250e4
        jQuery.get( 'http://api.openweathermap.org/data/2.5/weather?lat='+get_center[1]+'&lon='+get_center[0]+'&APPID=f6f1b45b882965c039fae9390a8250e4', function( data ) {
            console.log(data);

            var wind_speed = data.wind["speed"];
            var max_temp = Math.abs(data.main["temp_max"]-272.15);
            var min_temp = Math.abs(data.main["temp_min"]-272.15);
            var humidity = data.main["humidity"];
            var weather_description = data.weather[0]["description"];

            let unix_timestamp = data.sys["sunset"];
            var date = new Date(unix_timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var sunset = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
            //console.log(parseInt(max_temp),parseInt(min_temp),humidity,wind_speed,sunset,weather_description);
            // Set Content 
            jQuery('span#weather_desc').text(weather_description);
            jQuery('.weather_stats ul li:nth-child(1) p').text(parseInt(min_temp) + ' - ' + parseInt(max_temp) + ' °C');
            jQuery('.weather_stats ul li:nth-child(2) p').text(humidity + ' %');
            jQuery('.weather_stats ul li:nth-child(3) p').text(wind_speed + ' km/h');
            jQuery('.weather_stats ul li:nth-child(4) p').text(sunset);

          });


    });



    // Receive data to trigger save image
    app.post('/can_save_image', function(req, res) {

        can_save_image = true;
        res.status(200).send('ok');
        

    });
    

    // To python script apo KETA stelnei se auto to link to ypologismeno monopati pou tha akoloutheisei to drone.

    app.post('/calculated_path', function(req, res) {
        
            //console.log(req.body);
    
    
            var path = req.body;
            console.log(path);
            var pointList = [];
    
            for (var points = 0; points < path.DataObject.path.waypoints.length; points++) {
    
                //var tmp_point = new L.LatLng(path.DataObject.path.waypoints[points]);
    
    
                var test = String(path.DataObject.path.waypoints[points]);
                //console.log(test);
                var res_g = test.split("{latitude: ", 3);
                var res_t = test.split(", lognitude :", 3);
                var lon = res_t[1].split(" }", 3);
                var lat = res_g[1].split(" ,", 3);
    
                var tmp_point = new L.LatLng($.trim(lon[0]), $.trim(lat[0]));
                pointList.push(tmp_point);
            }
        console.log(pointList);
        var firstpolyline = new L.Polyline(pointList, {
            color: 'purple',
            weight: 3,
            opacity: 0.8,
            smoothFactor: 1,
            className : 'CalculatedPathRender'
        });
        // This is an amazing polyline in order to communicate 
        firstpolyline.addTo(map);

        //console.log(pointList);

        res.status(200).send('Path Received');

        jQuery('#pop_up_container').fadeOut();
        jQuery('div#calculate_path_planing').fadeOut();
        jQuery('div#start_scanning').fadeIn();
        jQuery('.button_all_ok').attr('style', 'display:block;');
        jQuery('path.leaflet-clickable').first().attr('style','fill:transparent;');

        // Exei lifthei to monopati opote to apothikeuw se arxeio ston fakelo tou project

        // register variables in order to send it to json
        var altitude = jQuery('#altitude_show').val().split("m", 2);
        var gimbal_pitch = jQuery('input#gimbal_pitch').val().split("°", 2);
        var n_speed = jQuery('input#drone_speed').val().split("m/s", 2);

        var create_json = '{ "SenderID":"IKHEditor", "DataObject": { "path": { "waypoints": ' + JSON.stringify(pointList) + ' , "altitude": ' + parseFloat(altitude[0]) + ', "speed": ' + parseFloat(n_speed[0]) + ', "Gimbal Pitch": ' + parseFloat(gimbal_pitch[0]) + ' } } }';

        // get pathname of project
        var plan_name = jQuery('input#plan_name').val();
        console.log('Trying to create the folder');
        // make dir if does not exist and create file with path included
        fs.mkdir('./projects/' + plan_name + '/paths', function() {
            fs.writeFileSync('./projects/' + plan_name + '/paths/calculated_path.json', JSON.stringify(create_json));
        });

        // Send post with json data to DJI ADAPTOR
        /*
        jQuery.ajax({
             type: "POST",
             url: "http://localhost:5000/",
             // The key needs to match your method's input parameter (case-sensitive).
             data: JSON.stringify(create_json),
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             success: function(data){console.log('Received from the server');},
             failure: function(errMsg) {
                 console.log(errMsg);
             }
         });       
         */


    });



    // GET POST UPLOAD IMAGE FUNCTION erxetai apo to drone kai ginontai sync oi eikones
    app.post('/post_image/', upload.any(), (req, res) => {

        console.log('Can Save: ',can_save_image)

 
        var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
        const uuidv4 = require('uuid/v4'); // I chose v4 ‒ you can select others
        var filename = uuidv4(); // '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

        //console.log('./projects/' + localStorage.getItem("LoadProject").replace(" ", "") +  '/project_images/' + filename + '.jpg');
        if(can_save_image){

            if (show_slide) {
                show_slide_message("Gallery Sync Started");
            }
            
        
        require("fs").writeFile(localStorage.getItem('Save_Image_Path') +'/' + filename + '.jpg', base64Data, 'base64', function(err) {
        
        if(err){
            console.log(err);
        }else{
            print_project_gallery();
            res.status(200).send('ok');
    }
        });
    }else{
        res.status(200).send('ok');
    }
    });




    app.listen(process.env.PORT || 8081);




    // Function pou deixnei slide message gia kapoia wra kai meta to krubei 
    function show_slide_message(message_string) {
        jQuery('.slide_messages ul p').text(message_string);

        if (show_slide) {
            show_slide = false;
            jQuery(".slide_messages ul").animate({
                width: 'toggle'
            }, 350);

        }

        //setimout
        setTimeout(function() {

            jQuery(".slide_messages ul").animate({
                width: 'toggle'
            }, 350);

        }, 5000);

        setTimeout(function() {

            //show_slide = true;

        }, 10000);




    }


    // Calculate path button trigger
    jQuery('div#calculate_path_planing').click(function() {

        var get_time_now = new Date().toLocaleTimeString('en-GB', {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        });

        var polygon_object = JSON.parse(load_map_project_w_o_render());
        var coordnites = polygon_object["features"][0]["geometry"]["coordinates"];
        //console.log(coordnites[0].length);
        var create_polygon = [];
        for (var f = 0; f < coordnites[0].length; f++) {

            if (f + 1 == coordnites[0].length) {
                //console.log('{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '}],');
                create_polygon.push('{"latitude": ' + coordnites[0][f][1] + ', "longitude": ' + coordnites[0][f][0] + '}],');
            } else if (f == 0) {
                //console.log('[{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '},');
                create_polygon.push('[{"latitude": ' + coordnites[0][f][1] + ', "longitude": ' + coordnites[0][f][0] + '},');
            } else {
                create_polygon.push('{"latitude": ' + coordnites[0][f][1] + ', "longitude": ' + coordnites[0][f][0] + '},');
                //console.log('{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '},');
            }

        }

        // final creation of polygon 
        var final_string = '{ "SenderID":"IKHEditor", "DataObject": { "mission_id": 1, "start_time": "' + get_time_now + '", "area": { "polygon":';
        for (var final_text = 0; final_text < create_polygon.length; final_text++) {
            final_string += create_polygon[final_text];
        }
        final_string += '"scanning_distance": ' + jQuery('input#scanning_distance_now').val().replace("m", "") + ' } } }';
        console.log(final_string);

        // Send to python script the polygon
        var data = '' + final_string;

        jQuery.ajax({
            type: "POST",
            url: "http://localhost:5000/",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                console.log('Received from the server');
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });

        // show loading pop up
        jQuery('#pop_up_container').fadeIn();
        jQuery('.pop_up_content').prepend('<div class="loader loader--style5" title="4"> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="0" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="10" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="20" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" /> </rect> </svg> </div>');
        jQuery('.pop_up_content p').text('Path Calculation Started');
        jQuery('.button_all_ok').attr('style', 'display:none;');


        // Rewrite json and trigger locked value on

        var plan_name = jQuery('input#plan_name').val();
        var altitude = jQuery('input#altitude_show').val().replace('m','');
        var direction_show = jQuery('input#direction_show').val().replace('°','');
        var scanning_distance = jQuery('input#scanning_distance_now').val().replace('m','');
        var gimbal_pitch = jQuery('input#gimbal_pitch').val().replace('°','');
        var drone_speed = jQuery('input#drone_speed').val().replace('m/s','');
        var acres = jQuery('span#acres_num').text();

        var prepare_json_project = '{"CoFly": { "Plan_Name":"' + plan_name + '", "Calculated_Minutes":"' + '--:--' + '","Calculated_Acres":"' + acres + '","Altitude":"' + altitude + '","Rotation":"' + direction_show + '","Lock_Project":"1","Scanning_Distance":"'+scanning_distance+'","Gimbal_Pitch":"'+gimbal_pitch+'","Drone_Speed":"'+drone_speed+'" } }';

        fs.mkdir('./projects/' + plan_name, function() {
            fs.writeFileSync('projects/' + plan_name + '/proj_settings.json', prepare_json_project);
        });





    });

    // START PATH BUTTON TRIGGER
    jQuery('div#start_scanning').click(function() {

        jQuery('div#cancel_scanning').fadeIn();
        jQuery(this).fadeOut();
        // datetime now
        var date_time = Date.now();
        //console.log(date_time);

        fs.mkdir('./projects/' + localStorage.getItem("LoadProject").replace(" ","")+'/project_images/'+date_time, function() {
            localStorage.setItem('Save_Image_Path','./projects/' + localStorage.getItem("LoadProject").replace(" ","")+'/project_images/'+date_time);
        });


        var contents = JSON.parse(fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8'));
        var path_obj = JSON.parse(contents);
        //console.log(JSON.stringify(path_obj.DataObject.path.waypoints));
    
        data_send = '{"missionID":1,"time":1575213238186,"waypoints":'+JSON.stringify(path_obj.DataObject.path.waypoints)+',"altitude":15.0,"speed":5.0,"gimbalPitch":45.0}';
        var new_data = {"missionID":1,"time":1575213238186,"waypoints":[{"lat":37.96801664793166,"lng":23.74654090605244},{"lat":37.967877700862395,"lng":23.746668089091877},{"lat":37.968270729863285,"lng":23.747049354187133},{"lat":37.96840967720364,"lng":23.746922171023495},{"lat":37.96815559500093,"lng":23.746668089091877},{"lat":37.96829992273745,"lng":23.746511997449733},{"lat":37.96880808660068,"lng":23.747020161312964},{"lat":37.968947033909885,"lng":23.746892978149326},{"lat":37.968438869504496,"lng":23.746384814286092},{"lat":37.96858319599752,"lng":23.746228724189667},{"lat":37.96934544179237,"lng":23.74699096998452},{"lat":37.96948438907043,"lng":23.746863786820878},{"lat":37.968722142462354,"lng":23.74610154102603},{"lat":37.96886646771189,"lng":23.745945452475294},{"lat":37.969628713506744,"lng":23.746707698270146},{"lat":37.970050930349025,"lng":23.74629724493785},{"lat":37.9699119836754,"lng":23.746170061898415},{"lat":37.969628713506744,"lng":23.74645333206707},{"lat":37.96886646771189,"lng":23.745691086272217},{"lat":37.96801664793166,"lng":23.74654090605244}],"altitude":15.0,"speed":5.0,"gimbalPitch":45.0 }
        // SEND POST REQUEST TO DRONE IN ORDER TO START THE EXCECUTION OF PATH
        setTimeout(function(){ 
        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8080/api/missionStart",
            data: JSON.stringify(data_send),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){             
                console.log(data);              
            },
            failure: function(errMsg) {
                alert(errMsg);
            }
        });
        }, 1000);
        

    });

    // ABORT scanning 
    jQuery('div#cancel_scanning').click(function(){

        console.log('Abort scanning');
        var data_send = { "missionID": 1, "time": 1575213238186 };
        console.log(JSON.stringify(data_send));
        jQuery.ajax({
            type: "POST",
            url: "http://localhost:8080/api/missionAbort",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(data_send),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                
                console.log(data);
                jQuery('div#cancel_scanning').fadeOut();
                jQuery('div#start_scanning').fadeIn();
 

                // func in order to delete folder + files
                var fs = require('fs');
                var deleteFolderRecursive = function(path) {
                if( fs.existsSync(path) ) {
                    fs.readdirSync(path).forEach(function(file,index){
                    var curPath = path + "/" + file;
                    if(fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                    });
                    fs.rmdirSync(path);
                }
                };

                // Delete created path + images
                deleteFolderRecursive(localStorage.getItem('Save_Image_Path') +'/');

                // reset variables
                can_save_image = false;


                
                
            },
            failure: function(errMsg) {
                alert(errMsg);
            }
        });

    });

    function scan_complete(){
        jQuery('div#cancel_scanning').fadeOut();
        jQuery('div#start_scanning').fadeIn();
    }


    // function in order to call loaded project settings

    function load_project_settings() {
        var fs = require('fs');

        var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/proj_settings.json', 'utf8');
        return contents;
    }

       // function in order to call loaded project settings

    function load_project_calulated_path() {

        var fs = require('fs');
        try{
            fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8');
            var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8');
            jQuery('div#calculate_path_planing').fadeOut();
            jQuery('div#start_scanning').fadeIn();

        }catch(err){
            return false;
        }
        
        //console.log(contents);
        //return contents;
        try {
      
            setTimeout(function(){ 
            var map_Data_load = JSON.parse(contents);
            var map_Data = JSON.parse(map_Data_load);
            var size_of_path = map_Data.DataObject.path.waypoints.length;
            var pointList = [];
            for (var points = 0; points < size_of_path; points++) {
                var tmp_point = new L.LatLng(map_Data.DataObject.path.waypoints[points].lat,map_Data.DataObject.path.waypoints[points].lng);
                pointList.push(tmp_point);
            }
            var firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 3,
                opacity: 0.8,
                smoothFactor: 1,
                className : 'CalculatedPathRender'
            });
            // This is an amazing polyline in order to communicate 
            firstpolyline.addTo(map);
            jQuery('path.leaflet-clickable').first().attr('style','fill:transparent;');
        }, 1500);
          }
          catch(err) {
              console.log(err);
            //console.log('There is not calculated path on the project');
            //return false;
          }

    }



    //initialize project map and render it into map
    load_map_project();
    // initialize project timeline
    jQuery("div#timeline_div").load("scan_timeline.html");
    // render again input slider 
    function load_map_project() {
        var fs = require('fs');

        var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/map_data.geojson', 'utf8');
        L.geoJson(JSON.parse(contents)).addTo(map);
        return contents;
    }

        //initialize project map and render it into map
        disabled_paths();
        // render disabled paths
        function disabled_paths() {
            var fs = require('fs');
    
            var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', 'utf8');
            try{
                L.geoJson(JSON.parse(contents)).addTo(map);
            }catch(err){
                console.log(err);
            }
            return contents;
        }

        // function gia na mou epistefei se json to arxeio twn disabled paths kai na mporw na to epexergastw
        function disabled_paths_read() {
            var fs = require('fs');
    
            var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', 'utf8');
            return contents;
        }

/*         jQuery(document).on("click","svg.leaflet-zoom-animated g:nth-child(n+2) path",function() {

            console.log('Must delete svg and regerate layers delete');
            var index = jQuery("svg.leaflet-zoom-animated g:nth-child(n+2) path").index(this);
            alert(index);
            var get_file = JSON.parse(disabled_paths_read());
            

            get_file["features"].splice(index, 1);
            console.log(JSON.stringify(get_file));
            fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', JSON.stringify(get_file));
            jQuery(this).remove();

            
        }); */


        jQuery('svg.leaflet-zoom-animated g:nth-child(n+2) path').click(function(){

            console.log('Must delete svg and regerate layers delete');
            var index = jQuery("svg.leaflet-zoom-animated g:nth-child(n+2) path").index(this);
            console.log(index);
            var get_file = JSON.parse(disabled_paths_read());
            
            if(get_file["features"].length-1 == 0){
                //alert('prepei na kanw xars');
                fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', ' ');
            }else{             
                get_file["features"].splice(index, 1);
                console.log(JSON.stringify(get_file));
                fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', JSON.stringify(get_file));
            }

            jQuery(this).remove();

            
        });



    // return polygon map with out render it on map 
    function load_map_project_w_o_render() {
        var fs = require('fs');

        var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/map_data.geojson', 'utf8');
        return contents;
    }


    // Load Project // Fill Elements
    var loaded_project = JSON.parse(load_project_settings());
    jQuery('input#plan_name').val(loaded_project.CoFly.Plan_Name);
    jQuery('span#acres_num').text(loaded_project.CoFly.Calculated_Acres);
    jQuery('span#minutes_calc').text(loaded_project.CoFly.Calculated_Minutes);
    jQuery('input.input-range--custom.altitude').val(parseInt(loaded_project.CoFly.Altitude));
    jQuery('input#altitude_show').val(parseInt(loaded_project.CoFly.Altitude) + 'm');
    jQuery('input#direction_show').val(parseInt(loaded_project.CoFly.Rotation) + '°');
    jQuery('input.input-range--custom.direction').val(parseInt(loaded_project.CoFly.Rotation));
    jQuery('input#scanning_distance_now').val(parseInt(loaded_project.CoFly.Scanning_Distance) + 'm');
    jQuery('input#gimbal_pitch').val(parseInt(loaded_project.CoFly.Gimbal_Pitch) + '°');
    jQuery('input#drone_speed').val(parseInt(loaded_project.CoFly.Drone_Speed) + 'm/s');
    var is_project_locked = parseInt(loaded_project.CoFly.Lock_Project);
    if(is_project_locked == 1){
        jQuery('div#calculate_path_planing').fadeOut();
        jQuery('div#start_scanning').fadeIn();
    }
    console.log('Project Condition:' + is_project_locked);
    
    update_viewer_slider_altitude();
    update_viewer_slider_rotation();



    function update_viewer_slider_altitude() {

        var fillColor = "rgba(254,200,64,1)",
            emptyColor = "rgba(238,238,238, 1)";

        var percent = 100 * (document.querySelector('input.altitude').value - document.querySelector('input.altitude').min) / (document.querySelector('input.altitude').max - document.querySelector('input.altitude').min) + '%';
        document.querySelector('input.altitude').style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;

    }

    function update_viewer_slider_rotation() {

        var fillColor = "rgba(254,200,64,1)",
            emptyColor = "rgba(238,238,238, 1)";

        var percent = 100 * (document.querySelector('input.direction').value - document.querySelector('input.direction').min) / (document.querySelector('input.direction').max - document.querySelector('input.direction').min) + '%';
        document.querySelector('input.direction').style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;

    }

    jQuery('div#exit_button').click(function() {
        window.location = "./index.html";
    });

    jQuery('.button_all_ok').click(function() {

        jQuery('div#pop_up_container').fadeOut();

    });



    // Gallery Image click listener

    jQuery(document).on("click", '.nav-item div', function() {

        var get_image_path = jQuery(this).closest('li').find('img').attr('src');
        //console.log(get_image_path);
        if (jQuery('#div#lightbox').css('display') == 'none') {
            jQuery('div#lightbox').attr('style', 'background-image:url("' + get_image_path + '"); display:block;');

        } else {
            jQuery('div#lightbox').css('display', 'block');
            jQuery('div#lightbox').attr('style', 'background-image:url("' + get_image_path + '"); display:block;');

        }


    });

    // Close Image Shower Action

    jQuery('.close_image_shower').click(function() {

        jQuery('div#lightbox').fadeOut();

    });

    // Close Top Bar with images from drone receiver
    jQuery('div#close_map_photo_picker i').click(function() {

        if(jQuery('div#open_image_settings_map i').hasClass('open_it')){}else{jQuery('div#photo_picker_receiver_start').slideUp();}

    });

    // Variable in order to trigger selection mode of printed images on map
    var selection_mode = false;
    // Toogle to open menu bar for images
    jQuery('div#open_image_settings_map i').click(function() {


        if (jQuery('div#open_image_settings_map i').hasClass('open_it')) {
            jQuery(this).removeClass('open_it');
            jQuery('#photo_wizard_start').slideUp();

        } else {
            jQuery(this).addClass('open_it');
            jQuery('#photo_wizard_start').slideDown();
            // Set selectrion mode on true
            selection_mode = true;
            // Grayscale all the images in order to select which one will we move.
            jQuery('.leaflet-popup-content img').css('filter', 'grayscale(1)');

        }


    });

    // Variable gia na exw to id thw eikonas pou tha xeirizete o controller
    var selected_image_for_control = '';
    // Function pou kanw trigger to click se eikona poy exei postaristei otan to selection mode einai true
    jQuery(document).on('click', '.leaflet-popup-content img', function() {

        if (selection_mode) {
            selection_mode = false;
            selected_image_for_control = jQuery(this).attr('give_id');
            jQuery('img[give_id="' + jQuery(this).attr('give_id') + '"]').addClass('selected_edit_image');
            console.log('Selected image is: ' + selected_image_for_control);
            check_for_existing_values();
        }

    });

    /* Basic Image Controller Listeners */
    var i_top = 0;
    var i_left = -55;
    var angle = 0;
    var opacity = 0;

    function check_for_existing_values(){

        var demo = JSON.parse(load_image_settings());

        for (k in demo['ImageSettings']) {

            var image_title = jQuery('.selected_edit_image').attr('src');
            if (demo['ImageSettings'][k]['title'] == image_title) {
                //alert('Brethike Eikona');
                i_top = parseInt(demo['ImageSettings'][k]['Top'].replace("px",""));
                i_left = parseInt(demo['ImageSettings'][k]['Left'].replace("px",""));
                angle = i_top = parseInt(demo['ImageSettings'][k]['Rotate']);
                console.log('Found Values Already',i_top,i_left,angle);
            }

        }
        
    }

    jQuery(document).on('click', '.image_toggle_button', function() {

        var read_id = jQuery(this).attr('marker_id');


        if (jQuery(this).hasClass('inactive')) {
            jQuery(this).removeClass('inactive');
            jQuery('img[give_id="' + read_id + '"]').fadeIn();
        } else {
            jQuery(this).addClass('inactive');
            jQuery('img[give_id="' + read_id + '"]').fadeOut();
        }


    });


    var timer = 0;

    $('.dirs .rotate_neg').on('mousedown', function() {
        timer = setInterval(rotatePositive, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });


    $('.dirs .rotate').on('mousedown', function() {
        timer = setInterval(rotateNegative, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .right').on('mousedown', function() {
        timer = setInterval(move_right, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .left').on('mousedown', function() {
        timer = setInterval(move_left, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .up').on('mousedown', function() {
        timer = setInterval(move_up, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .down').on('mousedown', function() {
        timer = setInterval(move_down, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });



    function rotatePositive() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle++ + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px');
        //console.log('Rotate: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('transform'));
    }

    function rotateNegative() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle-- + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px');
        //console.log('Rotate: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('transform'));
    }

    function move_right() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left++ + 'px');
        //console.log('Left: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('left'));
    }

    function move_left() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left-- + 'px');
        //console.log('Left: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('left'));
    }

    function move_up() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top-- + 'px; margin-left:' + i_left + 'px');
        //console.log('Top: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('top'));
    }

    function move_down() {
        opacity_down();
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top++ + 'px; margin-left:' + i_left + 'px');
        //console.log('Top: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('top'));
    }

    function opacity_up(){
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px; opacity:'+opacity++);
        
    }

    
    function opacity_down(){
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px; opacity:'+opacity--);
        
    }


    // Save Button for printed images on map clicked
    jQuery('#save_settings_img i').click(function() {
        console.log('Debug edw: ' + jQuery('.selected_edit_image').attr('src'));
        i_top = 0;
        i_left = -55;
        angle = 0;

        // TODO CREATE JSON FILE AND SAVE IMAGE SETTINGS
        // ean den exei idio onoma me rythmiseis sto json image settings
        if (!check_if_image_settings_already_exists()) {

            var demo = JSON.parse(load_image_settings());

            var read_left = jQuery('.selected_edit_image').css('margin-left');
            var read_top = jQuery('.selected_edit_image').css('margin-top');
            var read_rotate = jQuery('.selected_edit_image').attr('style');
            var keep_deg = read_rotate.split("rotate(", 3);
            keep_deg = keep_deg[1].split("deg);", 3);

            demo['ImageSettings'].push({
                "title": jQuery('.selected_edit_image').attr('src'),
                "Rotate": keep_deg[0],
                "Top": read_top,
                "Left": read_left
            });
            console.log('Add new Item', demo);
            json_data = JSON.stringify(demo);
            // SAVE JSON FILE
            var fs = require('fs');
            //alert(plan_name);
            
            fs.mkdir('./projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
                fs.writeFileSync('projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/image_settings.json', JSON.stringify(demo));
            });




        }

        jQuery('.selected_edit_image').removeClass('selected_edit_image');
        jQuery('#photo_wizard_start').slideUp();
        jQuery('#open_image_settings_map i').removeClass('open_it');
        jQuery('.leaflet-popup-pane img').css('filter', 'grayscale(0)');




    });

    function check_if_image_settings_already_exists() {

        var demo = JSON.parse(load_image_settings());

        for (k in demo['ImageSettings']) {

            //console.log(demo['ImageSettings'][k]['title']);
            var image_title = jQuery('.selected_edit_image').attr('src');
            if (demo['ImageSettings'][k]['title'] == image_title) {
                //alert('Brethike Eikona');

                var read_left = jQuery('.selected_edit_image').css('margin-left');
                var read_top = jQuery('.selected_edit_image').css('margin-top');
                var read_rotate = jQuery('.selected_edit_image').attr('style');
                var keep_deg = read_rotate.split("rotate(", 3);
                keep_deg = keep_deg[1].split("deg);", 3);

                demo['ImageSettings'][k]['Rotate'] = keep_deg[0];
                demo['ImageSettings'][k]['Top'] = read_top;
                demo['ImageSettings'][k]['Left'] = read_left;
                // SAVE JSON FILE
                var fs = require('fs');
                fs.mkdir('./projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
                    fs.writeFileSync('projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/image_settings.json', JSON.stringify(demo));
                });
    
                console.log('Change Existing Item', demo);
                return true;
            }

        }

        return false;


    }




    function load_image_settings() {
        var fs = require('fs');

        var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/image_settings.json', 'utf8');
        return contents;
    }

    jQuery('input[type="file"]').change(function(){

        export_project(document.getElementsByTagName('input')[0].files[0].path);

    });
    


    // initialise function Export Project 
    function export_project(out_dir){


        jQuery('#pop_up_container').fadeIn();
        jQuery('.pop_up_content').prepend('<div class="loader loader--style5" title="4"> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="0" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="10" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="20" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" /> </rect> </svg> </div>');
        jQuery('.pop_up_content p').text('Exporting...');
        jQuery('.button_all_ok').attr('style', 'display:none;');
       
        const zl = require("zip-lib");
    
        zl.archiveFolder('./projects/' + localStorage.getItem("LoadProject").replace(" ", "")+'/', out_dir+"/"+localStorage.getItem("LoadProject").replace(" ","")+".zip").then(function () {
            console.log("Export done");
            jQuery('#pop_up_container').fadeOut();
            jQuery('.button_all_ok').attr('style', 'display:block;');
        }, function (err) {
            console.log(err);
        });


    }

    // Draw Map Click Handler
    jQuery('div#DrawOnMapGallery').click(function(){


        DrawImagesOnMap();
        
        
    });

    // Initialise function draw images on map
    function DrawImagesOnMap(){

        // Dropdown menu 
        jQuery('div#photo_picker_receiver_start').slideDown();
        // Clear all markers from the images toolbox
        console.log('working');
    
    }







    



});