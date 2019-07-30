jQuery(document).ready(function() {
    //var pathsad = require("path");
    //console.log(pathsad.resolve(__dirname, './projects/').replace(/\\/g,"/")+ "/" +localStorage.getItem("LoadProject") + "/project_images/");


    print_project_gallery();
    var show_slide = true;
    /* BETA TESTING FOR DIRECTORY FILES */
    function print_project_gallery() {
        jQuery('ul.project_gallery_render li').remove();
        //var get_path_images = './projects/' + localStorage.getItem("LoadProject").replace(" ", "") + '/project_images/';
        //const testFolder = __dirname + '/projects/' + localStorage.getItem("LoadProject").replace(" ", "") + '/project_images/';
        var pathsad = require("path");
        var final_correct_path = pathsad.resolve(__dirname, './projects/').replace(/\\/g,"/")+ "/" +localStorage.getItem("LoadProject") + "/project_images/";
        var fix_location = final_correct_path.split("/resources/app");
        const fs = require('fs');

        if(fix_location[1] == null){
            var final_link = fix_location[0];
        }else{
            var final_link = fix_location[0]+ fix_location[1];
        }

        fs.readdirSync(final_link.replace(" ","")).forEach(file => {

            if (file.indexOf(".jpg") != -1 || file.indexOf(".png") != -1 || file.indexOf(".jpeg") != -1) {
                //console.log(file);
                jQuery('ul.project_gallery_render').append('<li class="nav-item"><img src="' + final_link.replace(" ","") + file + '"></li>');
            }

        });

    }

    // check if load proejext exists
    var project_path = localStorage.getItem("LoadProject");

    var get_center = localStorage.getItem("LoadedProjectCenter");
    var clean_center = get_center.split(",");


    // Initialize map
    var map = L.mapbox.map('map')
        .setView([parseFloat(clean_center[1]), parseFloat(clean_center[0])], 17);

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

    const path = require('path');


    /* LISTEN NEW SERVICE  UPLOAD FILE TO PROJECT FILE */
    const express = require('express');
    const multer = require('multer');
    const upload = multer();
    var bodyParser = require("body-parser");
    const fs = require('fs');

    var app = express();
    app.use(express.static(__dirname));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());


    app.post('/drone_location', function(req, res) {
        var drone_longtitude = req.query.longitude;
        var drone_latitude = req.query.latitude;

        //delete previous mark if exist
        jQuery('.leaflet-marker-pane img').remove();

        // draw new marker [Current] drone location
               var marker = L.marker(
            [drone_longtitude,drone_latitude], {
                title: 'Drone Current Position',
                icon: drone_icon
            }
        ).addTo(map);

        map.panTo(new L.LatLng(drone_longtitude, drone_latitude));


        console.log('Long: '+ drone_longtitude + ' Lat: ' + drone_latitude);
        res.status(200).send('Drone Location Received');
    });



    app.post('/calculated_path', function(req, res) {
        var path = JSON.parse(req.query.path);
        
        var pointList = [];

        for(var points=0; points < path.DataObject.path.waypoints.length; points++){

            var tmp_point = new L.LatLng(path.DataObject.path.waypoints[points].latitude, path.DataObject.path.waypoints[points].longitude);
            pointList.push(tmp_point);
        }

        var firstpolyline = new L.Polyline(pointList, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1,
            /*fill:none*/
        });
        // This is an amazing polyline in order to communicate 
        firstpolyline.addTo(map);

        //console.log(pointList);
        res.status(200).send('Path Received');
    });


    // GET POST UPLOAD IMAGE FUNCTION 
    app.post('/post_image/', upload.any(), (req, res) => {
        //console.log('POST /post_image/');
        //console.log('Files: ', req.files);
        if (show_slide) {
            show_slide_message("Gallery Sync Started");
        }
        fs.writeFile('./projects/' + localStorage.getItem("LoadProject").replace(" ", "") + '/project_images/' + req.files[0].originalname, req.files[0].buffer, (err) => {
            if (err) {
                console.log('Error: ', err);
                res.status(500).send('An error occurred: ' + err.message);
            } else {
                res.status(200).send('ok');
                // FS CHECK DIRECTORY IMAGES and recreate thumbnails
                // function gia na sbisw oles tis photo pou uphrxan kai na rendarw tiw kainourgies
                print_project_gallery();

            }
        });
    });




    app.listen(process.env.PORT || 8081);


    // Function pou deixnei slide message gia kapoia wra kai meta to krubei 
    function show_slide_message(message_string) {
        jQuery('.slide_messages ul p').text(message_string);

        if (show_slide = true) {
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

            show_slide = true;

        }, 10000);




    }


    // Calculate path button trigger
    jQuery('div#calculate_path_planing').click(function() {

        var get_time_now = new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric",second: "numeric"});

        var polygon_object = JSON.parse(load_map_project());
        var coordnites = polygon_object["features"][0]["geometry"]["coordinates"];
        //console.log(coordnites[0].length);
        var create_polygon = [];
        for (var f = 0; f < coordnites[0].length; f++) {

            if (f + 1 == coordnites[0].length) {
               //console.log('{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '}],');
                create_polygon.push('{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '}],');
            } else if (f == 0) {
                //console.log('[{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '},');
                create_polygon.push('[{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '},');
            } else {
                create_polygon.push('{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '},');
                //console.log('{"latitude": ' + coordnites[0][f][0] + ', "longitude": ' + coordnites[0][f][1] + '},');
            }

        }

        // final creation of polygon 
        var final_string = '{ "SenderID":"IKHEditor", "DataObject": { "mission_id": 1, "start_time": "'+get_time_now+'", "area": { "polygon":';
        for (var final_text = 0; final_text < create_polygon.length; final_text++) {
            final_string += create_polygon[final_text];
        }
        final_string += '"scanning_distance": '+jQuery('input#altitude_show').val().replace("m","")+' } } }';
        console.log(final_string);

        /*
        for(var i_cord =0; i_cord < parseit.length; i_cord++){
            console.log('ID: ' + coordnites[i_cord]);
        }
        */
        /*
        const request = require('request');

        request.post('http://127.0.0.1:8081/', {
            json: {
                coordinates: polygon_object["features"][0]["geometry"]["coordinates"]
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                //jQuery(this).append('<i class="fas fa-times"></i>');
                jQuery(this).append('<i class="fas fa-check"></i>');
                jQuery('#start_scanning').slideDown();
                jQuery('path.leaflet-clickable').addClass('make_it_transparent');
                //draw_path_line();
                console.log(body);

                return
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (parseInt(res.statusCode) == 200) {
                jQuery(this).append('<i class="fas fa-check"></i>');
                jQuery('#start_scanning').slideDown();
                jQuery('path.leaflet-clickable').addClass('make_it_transparent');
                //draw_path_line();
                console.log(body);
            } else {
                //jQuery(this).append('<i class="fas fa-times"></i>');
                jQuery(this).append('<i class="fas fa-check"></i>');
                jQuery('#start_scanning').slideDown();
                jQuery('path.leaflet-clickable').addClass('make_it_transparent');
                //draw_path_line();
                console.log(body);
            }


        })
        */




    });

    // START PATH BUTTON TRIGGER
    jQuery('div#start_scanning').click(function() {

        // SEND POST REQUEST TO DRONE IN ORDER TO START THE EXCECUTION OF PATH


    });


    // function demo draw pathline
    function draw_path_line() {

        var pointA = new L.LatLng(37.969543384722314, 23.738421874377195);
        var pointB = new L.LatLng(37.97115601583948, 23.733815962268523);
        var pointC = new L.LatLng(37.97214274819643, 23.734746129566588);
        var pointD = new L.LatLng(37.971003776087706, 23.739224300161254);
        var pointE = new L.LatLng(37.97209200241575, 23.739510737295745);
        var pointF = new L.LatLng(37.97306180710804, 23.735419809317932);
        var pointH = new L.LatLng(37.97442063978674, 23.735942280845734);
        var pointI = new L.LatLng(37.97425713018002, 23.73985506456836);
        var pointJ = new L.LatLng(37.97524382085256, 23.74016295937497);
        var pointK = new L.LatLng(37.97540583024541, 23.736427499970887);
        //create variable in order to get point list and draw it in the map.
        var pointList = [pointA, pointB, pointC, pointD, pointE, pointF, pointH, pointI, pointJ, pointK];
        //create first polyline dataset cause this is what we like
        var firstpolyline = new L.Polyline(pointList, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1,
            /*fill:none*/
        });
        // This is an amazing polyline in order to communicate 
        firstpolyline.addTo(map);


    }

    // function in order to call loaded project settings

    function load_project_settings() {
        var fs = require('fs');

        var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/proj_settings.json', 'utf8');
        return contents;
    }

    //initialize project map and render it into map
    load_map_project();

    // render again input slider 
    function load_map_project() {
        var fs = require('fs');

        var contents = fs.readFileSync('./projects/' + project_path.replace(" ", "") + '/map_data.geojson', 'utf8');
        L.geoJson(JSON.parse(contents)).addTo(map);
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




});