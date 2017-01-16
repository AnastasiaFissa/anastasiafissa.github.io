(function($){
	'use strict';
	$(function(){
		if (typeof google === 'object' && typeof google.maps === 'object') {
			//initialize();
		}
		
		/*** ============ Функция для определения существования элемента на странице =========== ***/
		$('.general-slider_cnt').css("display","block");
		(function() {
			$.fn.exists = function(selector) {
				return $(this).length;
			}
		})();
		/*** ====================== Слайдеры ====================== ***/
		if($('#general-slider_cnt').exists()){
			$("#general-slider_cnt").owlCarousel({
				loop:true,
				nav:false,
				autoplay:false,
				autoplayTimeout:3000,
				autoplayHoverPause:true,
				items:1,
				dots:true
			});
		}
		/*** ====================== АККОРДЕОН ====================== ***/
		$(".page-contacts_child > a").on("click", function(){
			if($(this).hasClass('active')){
				$(this).removeClass("active");
				$(this).siblings('.page-contacts_child_cnt').slideUp(200);
			}else{
				$(".page-contacts_child > a").removeClass("active");
				$(this).addClass("active");
				$('.page-contacts_child_cnt').slideUp(200);
				$(this).siblings('.page-contacts_child_cnt').slideDown(200);
			}
			return false;
		});
		/*** ====================== Стилизация селекта ====================== ***/
		if($('.distance-form_sel').exists()){
			$('.distance-form_sel').SumoSelect();
		}

		/*** ====================== Мобильное меню ====================== ***/
		$( '#dl-menu' ).dlmenu({
			animationClasses : { classin : 'dl-animate-in-3', classout : 'dl-animate-out-3' }
		});

		$('.lang_e').on('click', function(e){
			$(".lang_lst").slideToggle();
		});
		/*** ====================== Autocomplete====================== ***/
		var availableTags = [
		"Air vent",
		"Air mover",
		"Axial-flo",
		"BASIC",
		"C",
		"C++",
		"Clojure",
		"COBOL",
		"ColdFusion",
		"Erlang",
		"Fortran",
		"Groovy",
		"Haskell",
		"Java",
		"JavaScript",
		"Lisp",
		"Perl",
		"PHP",
		"Python",
		"Ruby",
		"Scheme"
		];
		$("#autocomplete").autocomplete({
			source: availableTags
		});
	});
})(jQuery);

	/* map */
	var myLatlng = new google.maps.LatLng(53.33087298, 6.96533203);
    var myOptions = {
        zoom: 5,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        zoomControl: true,
        draggable:true,
        scrollwheel: false,
        minZoom: 2,
    }

    var map = new google.maps.Map(document.getElementById("map"), myOptions);

    
    /**
     * map styles
     * @type Array
     */
    var styles = [
      {
         featureType: "water",
         elementType: "labels",
         stylers: [
           { visibility: "off" }
         ]
        },
        {
            "featureType": "water",
            "stylers": [
               { "lightness": 7 }
            ]
        },

 	];
    
    map.setOptions({styles: styles});

   
$(document).ready(function () {

    /**
    * 
    * @param {type} geocoder
    * @param {type} resultsMap
    * @returns {undefined}
    * calculates where the county is situated
    */
    function geocodeAddress(geocoder, resultsMap) {

        geocoder.geocode({'address': address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                //get center on the country
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                resultsMap.setCenter(new google.maps.LatLng(lat, lng));

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    $('.distance-form_btn, .location-form-submit').on('click', function(e){
    	e.preventDefault();
        address = $('.location-form_field').val();
 
        var geocoder = new google.maps.Geocoder();
       	geocodeAddress(geocoder, map);

       //set zoom for country
       var selectVal = $('.distance-form_sel').val();
       	
       		if(selectVal == 10){
       			map.setZoom(20);
       		}
       		else if(selectVal == 15){
       			map.setZoom(18);
       		}
       		else if(selectVal == 20){
       			map.setZoom(16);
       		}
       		else if(selectVal == 25){
       			map.setZoom(14);
       		}
            else if(selectVal == 30){
       			map.setZoom(12);
       		}
       		else{
       			map.setZoom(5);
       		}

    });

});
    
function addMarker(marker) {

  	var contentString = '<div class="map-popup_w">'+
	'<div class="map-popup_cnt cf">'+
	'<div class="map-popup_l">'+
	'<div class="map-popup_img">'+
	'<img src="images/map_logo.png" alt="Blackorchild">'+
	'</div>'+
	'</div>'+
	'<div class="map-popup_r">'+
	'<div class="map-popup_t">'+marker.cityName+'</div>'+
	'<div class="map-popup_tx">'+marker.address+'</div>'+
	'</div>'+
	'</div>'+
	'</div>';
	
	//create infoWindow
    infoBubble = new InfoBubble({ //global infobuble
		content: contentString,
		shadowStyle: 0,
		padding: 0,
		backgroundColor: '#3c3a3c',
		borderRadius: 0,
		arrowSize: 19,
		minWidth:'auto',
		minHeight:'auto',
		overflow:'auto',
		maxWidth: 460,
		borderWidth: 0,
		disableAutoPan: true,
		hideCloseButton: true,
		arrowPosition:50,
		pixelOffset: new google.maps.Size(200,0),
		backgroundClassName: 'map-popup',
		arrowStyle:0
	});

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(marker.lat, marker.lng),
        icon: 'images/map-icon.png',
        map: map,
        content: contentString
	});

     var onMarkerClick = function () {
		infoBubble.close();
        var marker = this;
        var latLng = marker.getPosition();
        
        infoBubble.open(map, marker);
    };

    var moveToMarker = function(){
        var zoom = map.getZoom();
        var marker = this;

        var center =  marker.getPosition(); 
        var span = map.getBounds().toSpan(); 

        var newCenter = { 
          lat: center.lat()+ span.lat()*0.35,
          lng: center.lng()
        };
        map.panTo(newCenter);   
        
    };

    google.maps.event.addListener(map, 'click', function () {
        infoBubble.close();
        if(map.getZoom()==5){
			map.setCenter(myLatlng);
        }
	});

        google.maps.event.addListener(marker, 'click', onMarkerClick);
        google.maps.event.addListener(marker, 'click', moveToMarker);
}
    var markers = new Array();

    markers[0] = {
        lat:51.45400691,
        lng:10.17333984,
        cityName: "London",
        address: "Unit 9 Oj's Industrial Park, 3 Clay- bank Road, Portsmouth PO3, UK"
    };
    
    markers[1] = {
        lat:56.58369172,
        lng:-4.54833984,
        cityName: "Liverpool",
        address: "Unit 9 Oj's Industrial Park, 3 Clay- bank Road, Portsmouth PO3, UK"
        
    }

    markers[2] = {
        lat:53.54030739,
        lng:-0.32958984,
        cityName: "Edinburgh",
        address: "Unit 9 Oj's Industrial Park, 3 Clay- bank Road, Portsmouth PO3, UK"
    }

    markers[3] = {
        lat:52.69636108,
        lng:-0.32958984,
        cityName: "Brit Crops",
        address: "Unit 9 Oj's Industrial Park, 3 Clay- bank Road, Portsmouth PO3, UK"
    }
    

for (i=0; i<markers.length; i++){
    addMarker(markers[i]);
}
/* end map */
